#![no_std]

mod errors;
mod storage;
mod types;

pub use errors::AidError;
pub use types::*;

use soroban_sdk::{contract, contractimpl, token, Address, BytesN, Env, Symbol};

#[contract]
pub struct AethyrAid;

fn checked_add(a: i128, b: i128) -> Result<i128, AidError> {
    a.checked_add(b).ok_or(AidError::ArithmeticError)
}

fn checked_sub(a: i128, b: i128) -> Result<i128, AidError> {
    a.checked_sub(b).ok_or(AidError::ArithmeticError)
}

fn ensure_initialized(env: &Env) -> Result<(), AidError> {
    if env
        .storage()
        .instance()
        .get::<_, bool>(&DataKey::Initialized)
        .unwrap_or(false)
    {
        Ok(())
    } else {
        Err(AidError::NotInitialized)
    }
}

fn admin_member(env: &Env, address: &Address) -> bool {
    env.storage()
        .instance()
        .get::<_, bool>(&DataKey::Admin(address.clone()))
        .unwrap_or(false)
}

fn verifier_member(env: &Env, address: &Address) -> bool {
    env.storage()
        .instance()
        .get::<_, bool>(&DataKey::Verifier(address.clone()))
        .unwrap_or(false)
}

fn require_admin(env: &Env, admin: &Address) -> Result<(), AidError> {
    admin.require_auth();
    ensure_initialized(env)?;
    if admin_member(env, admin) {
        Ok(())
    } else {
        Err(AidError::NotAdmin)
    }
}

fn require_verifier(env: &Env, verifier: &Address) -> Result<(), AidError> {
    verifier.require_auth();
    ensure_initialized(env)?;
    if verifier_member(env, verifier) {
        Ok(())
    } else {
        Err(AidError::NotVerifier)
    }
}

fn approved_merchant(env: &Env, merchant: &Address) -> Result<Merchant, AidError> {
    let record = storage::get_merchant(env, merchant).ok_or(AidError::MerchantNotFound)?;
    if record.status != MerchantStatus::Approved {
        return Err(AidError::MerchantNotApproved);
    }
    Ok(record)
}

fn valid_campaign(campaign: &Campaign) -> Result<(), AidError> {
    let accounted = checked_add(
        checked_add(
            checked_add(campaign.available_amount, campaign.reserved_amount)?,
            campaign.paid_amount,
        )?,
        checked_add(campaign.refundable_amount, campaign.refunded_amount)?,
    )?;
    if campaign.total_funded != accounted
        || campaign.available_amount < 0
        || campaign.reserved_amount < 0
        || campaign.paid_amount < 0
        || campaign.refundable_amount < 0
        || campaign.refunded_amount < 0
    {
        return Err(AidError::ArithmeticError);
    }
    Ok(())
}

fn store_campaign(env: &Env, campaign: &Campaign) -> Result<(), AidError> {
    valid_campaign(campaign)?;
    storage::set_campaign(env, campaign);
    Ok(())
}

#[contractimpl]
impl AethyrAid {
    pub fn initialize(env: Env, first_admin: Address) -> Result<(), AidError> {
        if env.storage().instance().has(&DataKey::Initialized) {
            return Err(AidError::AlreadyInitialized);
        }
        first_admin.require_auth();
        env.storage().instance().set(&DataKey::Initialized, &true);
        env.storage()
            .instance()
            .set(&DataKey::Admin(first_admin.clone()), &true);
        env.storage().instance().set(&DataKey::AdminCount, &1_u32);
        storage::touch_instance(&env);
        env.events().publish(
            (Symbol::new(&env, "role_add"), Symbol::new(&env, "admin")),
            first_admin,
        );
        Ok(())
    }

    pub fn add_admin(env: Env, admin: Address, new_admin: Address) -> Result<(), AidError> {
        storage::touch_instance(&env);
        require_admin(&env, &admin)?;
        if verifier_member(&env, &new_admin) {
            return Err(AidError::RoleOverlap);
        }
        if admin_member(&env, &new_admin) {
            return Err(AidError::RoleAlreadyExists);
        }
        let count: u32 = env
            .storage()
            .instance()
            .get(&DataKey::AdminCount)
            .unwrap_or(0);
        let next = count.checked_add(1).ok_or(AidError::ArithmeticError)?;
        env.storage()
            .instance()
            .set(&DataKey::Admin(new_admin.clone()), &true);
        env.storage().instance().set(&DataKey::AdminCount, &next);
        env.events().publish(
            (Symbol::new(&env, "role_add"), Symbol::new(&env, "admin")),
            (new_admin, admin),
        );
        Ok(())
    }

    pub fn remove_admin(env: Env, admin: Address, target: Address) -> Result<(), AidError> {
        storage::touch_instance(&env);
        require_admin(&env, &admin)?;
        if !admin_member(&env, &target) {
            return Err(AidError::RoleNotFound);
        }
        let count: u32 = env
            .storage()
            .instance()
            .get(&DataKey::AdminCount)
            .unwrap_or(0);
        if count <= 1 {
            return Err(AidError::LastAdmin);
        }
        env.storage()
            .instance()
            .remove(&DataKey::Admin(target.clone()));
        env.storage()
            .instance()
            .set(&DataKey::AdminCount, &(count - 1));
        env.events().publish(
            (Symbol::new(&env, "role_del"), Symbol::new(&env, "admin")),
            (target, admin),
        );
        Ok(())
    }

    pub fn add_verifier(env: Env, admin: Address, verifier: Address) -> Result<(), AidError> {
        storage::touch_instance(&env);
        require_admin(&env, &admin)?;
        if admin_member(&env, &verifier) {
            return Err(AidError::RoleOverlap);
        }
        if verifier_member(&env, &verifier) {
            return Err(AidError::RoleAlreadyExists);
        }
        env.storage()
            .instance()
            .set(&DataKey::Verifier(verifier.clone()), &true);
        env.events().publish(
            (Symbol::new(&env, "role_add"), Symbol::new(&env, "verify")),
            (verifier, admin),
        );
        Ok(())
    }

    pub fn remove_verifier(env: Env, admin: Address, verifier: Address) -> Result<(), AidError> {
        storage::touch_instance(&env);
        require_admin(&env, &admin)?;
        if !verifier_member(&env, &verifier) {
            return Err(AidError::RoleNotFound);
        }
        env.storage()
            .instance()
            .remove(&DataKey::Verifier(verifier.clone()));
        env.events().publish(
            (Symbol::new(&env, "role_del"), Symbol::new(&env, "verify")),
            (verifier, admin),
        );
        Ok(())
    }

    pub fn create_campaign(
        env: Env,
        admin: Address,
        campaign_id: BytesN<32>,
        token: Address,
    ) -> Result<(), AidError> {
        storage::touch_instance(&env);
        require_admin(&env, &admin)?;
        if storage::get_campaign(&env, &campaign_id).is_some() {
            return Err(AidError::DuplicateCampaign);
        }
        let campaign = Campaign {
            campaign_id: campaign_id.clone(),
            creator_admin: admin.clone(),
            token: token.clone(),
            status: CampaignStatus::Open,
            total_funded: 0,
            available_amount: 0,
            reserved_amount: 0,
            paid_amount: 0,
            refund_pool_total: 0,
            refundable_amount: 0,
            refunded_amount: 0,
            refunded_contribution_weight: 0,
            created_at: env.ledger().timestamp(),
            closed_at: 0,
        };
        store_campaign(&env, &campaign)?;
        env.events()
            .publish((Symbol::new(&env, "camp_new"), campaign_id), (admin, token));
        Ok(())
    }

    pub fn fund_campaign(
        env: Env,
        donor: Address,
        campaign_id: BytesN<32>,
        amount: i128,
    ) -> Result<(), AidError> {
        storage::touch_instance(&env);
        ensure_initialized(&env)?;
        donor.require_auth();
        if amount <= 0 {
            return Err(AidError::InvalidAmount);
        }
        let mut campaign =
            storage::get_campaign(&env, &campaign_id).ok_or(AidError::CampaignNotFound)?;
        if campaign.status != CampaignStatus::Open {
            return Err(AidError::CampaignNotOpen);
        }
        let mut contribution =
            storage::get_contribution(&env, &campaign_id, &donor).unwrap_or(DonorContribution {
                contributed_amount: 0,
                refund_claimed_amount: 0,
                refund_claimed: false,
            });
        campaign.total_funded = checked_add(campaign.total_funded, amount)?;
        campaign.available_amount = checked_add(campaign.available_amount, amount)?;
        contribution.contributed_amount = checked_add(contribution.contributed_amount, amount)?;
        valid_campaign(&campaign)?;

        token::Client::new(&env, &campaign.token).transfer(
            &donor,
            &env.current_contract_address(),
            &amount,
        );
        storage::set_contribution(&env, &campaign_id, &donor, &contribution);
        storage::set_campaign(&env, &campaign);
        env.events().publish(
            (Symbol::new(&env, "camp_fund"), campaign_id),
            (donor, amount),
        );
        Ok(())
    }

    pub fn close_campaign(
        env: Env,
        admin: Address,
        campaign_id: BytesN<32>,
    ) -> Result<(), AidError> {
        storage::touch_instance(&env);
        require_admin(&env, &admin)?;
        let mut campaign =
            storage::get_campaign(&env, &campaign_id).ok_or(AidError::CampaignNotFound)?;
        if campaign.status != CampaignStatus::Open {
            return Err(AidError::CampaignNotOpen);
        }
        if campaign.reserved_amount != 0 {
            return Err(AidError::ReservedFundsExist);
        }
        let refund_pool = campaign.available_amount;
        campaign.available_amount = 0;
        campaign.refund_pool_total = refund_pool;
        campaign.refundable_amount = refund_pool;
        campaign.status = CampaignStatus::Closed;
        campaign.closed_at = env.ledger().timestamp();
        store_campaign(&env, &campaign)?;
        env.events().publish(
            (Symbol::new(&env, "camp_close"), campaign_id),
            (admin, refund_pool),
        );
        Ok(())
    }

    pub fn claim_refund(
        env: Env,
        donor: Address,
        campaign_id: BytesN<32>,
    ) -> Result<i128, AidError> {
        storage::touch_instance(&env);
        ensure_initialized(&env)?;
        donor.require_auth();
        let mut campaign =
            storage::get_campaign(&env, &campaign_id).ok_or(AidError::CampaignNotFound)?;
        if campaign.status != CampaignStatus::Closed {
            return Err(AidError::CampaignNotClosed);
        }
        let mut contribution = storage::get_contribution(&env, &campaign_id, &donor)
            .ok_or(AidError::NoContribution)?;
        if contribution.refund_claimed {
            return Err(AidError::RefundAlreadyClaimed);
        }
        let new_weight = checked_add(
            campaign.refunded_contribution_weight,
            contribution.contributed_amount,
        )?;
        if new_weight > campaign.total_funded || campaign.total_funded <= 0 {
            return Err(AidError::ArithmeticError);
        }
        let payout = if new_weight == campaign.total_funded {
            campaign.refundable_amount
        } else {
            campaign
                .refund_pool_total
                .checked_mul(contribution.contributed_amount)
                .ok_or(AidError::ArithmeticError)?
                / campaign.total_funded
        };
        if payout < 0 || payout > campaign.refundable_amount {
            return Err(AidError::ArithmeticError);
        }
        campaign.refundable_amount = checked_sub(campaign.refundable_amount, payout)?;
        campaign.refunded_amount = checked_add(campaign.refunded_amount, payout)?;
        campaign.refunded_contribution_weight = new_weight;
        contribution.refund_claimed = true;
        contribution.refund_claimed_amount = payout;
        valid_campaign(&campaign)?;

        if payout > 0 {
            token::Client::new(&env, &campaign.token).transfer(
                &env.current_contract_address(),
                &donor,
                &payout,
            );
        }
        storage::set_contribution(&env, &campaign_id, &donor, &contribution);
        storage::set_campaign(&env, &campaign);
        env.events()
            .publish((Symbol::new(&env, "refund"), campaign_id), (donor, payout));
        Ok(payout)
    }

    pub fn approve_merchant(
        env: Env,
        admin: Address,
        merchant: Address,
        profile_hash: BytesN<32>,
    ) -> Result<(), AidError> {
        storage::touch_instance(&env);
        require_admin(&env, &admin)?;
        let record = Merchant {
            merchant: merchant.clone(),
            status: MerchantStatus::Approved,
            profile_hash,
            updated_at: env.ledger().timestamp(),
            updated_by: admin.clone(),
        };
        storage::set_merchant(&env, &record);
        env.events()
            .publish((Symbol::new(&env, "merch_ok"), merchant), admin);
        Ok(())
    }

    pub fn suspend_merchant(env: Env, admin: Address, merchant: Address) -> Result<(), AidError> {
        storage::touch_instance(&env);
        require_admin(&env, &admin)?;
        let mut record =
            storage::get_merchant(&env, &merchant).ok_or(AidError::MerchantNotFound)?;
        if record.status != MerchantStatus::Approved {
            return Err(AidError::MerchantNotApproved);
        }
        record.status = MerchantStatus::Suspended;
        record.updated_at = env.ledger().timestamp();
        record.updated_by = admin.clone();
        storage::set_merchant(&env, &record);
        env.events()
            .publish((Symbol::new(&env, "merch_off"), merchant), admin);
        Ok(())
    }

    pub fn create_case(
        env: Env,
        admin: Address,
        campaign_id: BytesN<32>,
        case_id: BytesN<32>,
        case_record_hash: BytesN<32>,
    ) -> Result<(), AidError> {
        storage::touch_instance(&env);
        require_admin(&env, &admin)?;
        if storage::get_case(&env, &case_id).is_some() {
            return Err(AidError::DuplicateCase);
        }
        let campaign =
            storage::get_campaign(&env, &campaign_id).ok_or(AidError::CampaignNotFound)?;
        if campaign.status != CampaignStatus::Open {
            return Err(AidError::CampaignNotOpen);
        }
        let case = BeneficiaryCase {
            case_id: case_id.clone(),
            campaign_id: campaign_id.clone(),
            status: CaseStatus::Active,
            case_record_hash,
            created_at: env.ledger().timestamp(),
            created_by: admin.clone(),
        };
        storage::set_case(&env, &case);
        env.events().publish(
            (Symbol::new(&env, "case_new"), case_id),
            (campaign_id, admin),
        );
        Ok(())
    }

    pub fn close_case(env: Env, admin: Address, case_id: BytesN<32>) -> Result<(), AidError> {
        storage::touch_instance(&env);
        require_admin(&env, &admin)?;
        let mut case = storage::get_case(&env, &case_id).ok_or(AidError::CaseNotFound)?;
        if case.status != CaseStatus::Active {
            return Err(AidError::CaseNotActive);
        }
        case.status = CaseStatus::Closed;
        storage::set_case(&env, &case);
        env.events()
            .publish((Symbol::new(&env, "case_close"), case_id), admin);
        Ok(())
    }

    #[allow(clippy::too_many_arguments)]
    pub fn issue_voucher(
        env: Env,
        admin: Address,
        voucher_id: BytesN<32>,
        campaign_id: BytesN<32>,
        case_id: BytesN<32>,
        merchant: Address,
        amount: i128,
        category: VoucherCategory,
        purpose_hash: BytesN<32>,
        expires_at: u64,
    ) -> Result<(), AidError> {
        storage::touch_instance(&env);
        require_admin(&env, &admin)?;
        if amount <= 0 {
            return Err(AidError::InvalidAmount);
        }
        if storage::get_voucher(&env, &voucher_id).is_some() {
            return Err(AidError::DuplicateVoucher);
        }
        approved_merchant(&env, &merchant)?;
        let case = storage::get_case(&env, &case_id).ok_or(AidError::CaseNotFound)?;
        if case.status != CaseStatus::Active {
            return Err(AidError::CaseNotActive);
        }
        if case.campaign_id != campaign_id {
            return Err(AidError::CaseCampaignMismatch);
        }
        let mut campaign =
            storage::get_campaign(&env, &campaign_id).ok_or(AidError::CampaignNotFound)?;
        if campaign.status != CampaignStatus::Open {
            return Err(AidError::CampaignNotOpen);
        }
        if expires_at <= env.ledger().timestamp() {
            return Err(AidError::VoucherExpired);
        }
        if amount > campaign.available_amount {
            return Err(AidError::InsufficientAvailable);
        }
        campaign.available_amount = checked_sub(campaign.available_amount, amount)?;
        campaign.reserved_amount = checked_add(campaign.reserved_amount, amount)?;
        let voucher = Voucher {
            voucher_id: voucher_id.clone(),
            campaign_id: campaign_id.clone(),
            case_id: case_id.clone(),
            merchant: merchant.clone(),
            amount,
            category,
            purpose_hash,
            status: VoucherStatus::Issued,
            expires_at,
            issued_at: env.ledger().timestamp(),
            redeemed_at: 0,
            decided_at: 0,
            decision_by: None,
        };
        store_campaign(&env, &campaign)?;
        storage::set_voucher(&env, &voucher);
        env.events().publish(
            (Symbol::new(&env, "vouch_new"), voucher_id),
            (campaign_id, case_id, merchant, amount),
        );
        Ok(())
    }

    pub fn cancel_voucher(
        env: Env,
        admin: Address,
        voucher_id: BytesN<32>,
    ) -> Result<(), AidError> {
        storage::touch_instance(&env);
        require_admin(&env, &admin)?;
        let mut voucher =
            storage::get_voucher(&env, &voucher_id).ok_or(AidError::VoucherNotFound)?;
        if voucher.status != VoucherStatus::Issued {
            return Err(AidError::InvalidVoucherState);
        }
        let mut campaign =
            storage::get_campaign(&env, &voucher.campaign_id).ok_or(AidError::CampaignNotFound)?;
        campaign.reserved_amount = checked_sub(campaign.reserved_amount, voucher.amount)?;
        campaign.available_amount = checked_add(campaign.available_amount, voucher.amount)?;
        voucher.status = VoucherStatus::Cancelled;
        store_campaign(&env, &campaign)?;
        storage::set_voucher(&env, &voucher);
        env.events().publish(
            (Symbol::new(&env, "vouch_can"), voucher_id),
            (admin, voucher.amount),
        );
        Ok(())
    }

    pub fn expire_voucher(env: Env, voucher_id: BytesN<32>) -> Result<(), AidError> {
        storage::touch_instance(&env);
        ensure_initialized(&env)?;
        let mut voucher =
            storage::get_voucher(&env, &voucher_id).ok_or(AidError::VoucherNotFound)?;
        if voucher.status != VoucherStatus::Issued {
            return Err(AidError::InvalidVoucherState);
        }
        if env.ledger().timestamp() < voucher.expires_at {
            return Err(AidError::VoucherNotExpired);
        }
        let mut campaign =
            storage::get_campaign(&env, &voucher.campaign_id).ok_or(AidError::CampaignNotFound)?;
        campaign.reserved_amount = checked_sub(campaign.reserved_amount, voucher.amount)?;
        campaign.available_amount = checked_add(campaign.available_amount, voucher.amount)?;
        voucher.status = VoucherStatus::Expired;
        store_campaign(&env, &campaign)?;
        storage::set_voucher(&env, &voucher);
        env.events()
            .publish((Symbol::new(&env, "vouch_exp"), voucher_id), voucher.amount);
        Ok(())
    }

    pub fn redeem_voucher(
        env: Env,
        merchant: Address,
        voucher_id: BytesN<32>,
        content_digest: BytesN<32>,
        evidence_record_id: BytesN<32>,
    ) -> Result<(), AidError> {
        storage::touch_instance(&env);
        ensure_initialized(&env)?;
        merchant.require_auth();
        approved_merchant(&env, &merchant)?;
        let mut voucher =
            storage::get_voucher(&env, &voucher_id).ok_or(AidError::VoucherNotFound)?;
        if voucher.status != VoucherStatus::Issued {
            return Err(AidError::InvalidVoucherState);
        }
        if voucher.merchant != merchant {
            return Err(AidError::WrongMerchant);
        }
        if env.ledger().timestamp() >= voucher.expires_at {
            return Err(AidError::VoucherExpired);
        }
        let case = storage::get_case(&env, &voucher.case_id).ok_or(AidError::CaseNotFound)?;
        if case.status != CaseStatus::Active {
            return Err(AidError::CaseNotActive);
        }
        if storage::get_evidence(&env, &voucher_id, 0).is_some() {
            return Err(AidError::DuplicateEvidence);
        }
        let now = env.ledger().timestamp();
        let evidence = EvidenceSubmission {
            voucher_id: voucher_id.clone(),
            revision: 0,
            content_digest,
            evidence_record_id,
            submitted_by: merchant.clone(),
            submitted_at: now,
        };
        voucher.status = VoucherStatus::Redeemed;
        voucher.redeemed_at = now;
        storage::set_evidence(&env, &evidence);
        storage::set_voucher(&env, &voucher);
        env.events()
            .publish((Symbol::new(&env, "redeem"), voucher_id), (merchant, 0_u32));
        Ok(())
    }

    pub fn append_evidence_revision(
        env: Env,
        merchant: Address,
        voucher_id: BytesN<32>,
        content_digest: BytesN<32>,
        evidence_record_id: BytesN<32>,
    ) -> Result<(), AidError> {
        storage::touch_instance(&env);
        ensure_initialized(&env)?;
        merchant.require_auth();
        approved_merchant(&env, &merchant)?;
        let voucher = storage::get_voucher(&env, &voucher_id).ok_or(AidError::VoucherNotFound)?;
        if voucher.status != VoucherStatus::Frozen {
            return Err(AidError::InvalidVoucherState);
        }
        if voucher.merchant != merchant {
            return Err(AidError::WrongMerchant);
        }
        if storage::get_evidence(&env, &voucher_id, 0).is_none() {
            return Err(AidError::MissingEvidence);
        }
        if storage::get_evidence(&env, &voucher_id, 1).is_some() {
            return Err(AidError::EvidenceRevisionLimit);
        }
        let evidence = EvidenceSubmission {
            voucher_id: voucher_id.clone(),
            revision: 1,
            content_digest,
            evidence_record_id,
            submitted_by: merchant.clone(),
            submitted_at: env.ledger().timestamp(),
        };
        storage::set_evidence(&env, &evidence);
        env.events().publish(
            (Symbol::new(&env, "evid_rev"), voucher_id),
            (merchant, 1_u32),
        );
        Ok(())
    }

    pub fn freeze_claim(
        env: Env,
        admin: Address,
        voucher_id: BytesN<32>,
        reason_hash: BytesN<32>,
    ) -> Result<(), AidError> {
        storage::touch_instance(&env);
        require_admin(&env, &admin)?;
        let mut voucher =
            storage::get_voucher(&env, &voucher_id).ok_or(AidError::VoucherNotFound)?;
        if voucher.status != VoucherStatus::Redeemed {
            return Err(AidError::InvalidVoucherState);
        }
        if storage::get_evidence(&env, &voucher_id, 0).is_none() {
            return Err(AidError::MissingEvidence);
        }
        let now = env.ledger().timestamp();
        voucher.status = VoucherStatus::Frozen;
        voucher.decided_at = now;
        voucher.decision_by = Some(admin.clone());
        let decision = DecisionAttestation {
            voucher_id: voucher_id.clone(),
            decision: ClaimDecision::Freeze,
            actor: admin.clone(),
            reason_hash,
            evidence_revision: 0,
            decided_at: now,
        };
        storage::set_voucher(&env, &voucher);
        storage::set_decision(&env, &decision);
        env.events()
            .publish((Symbol::new(&env, "freeze"), voucher_id), admin);
        Ok(())
    }

    pub fn decide_claim(
        env: Env,
        verifier: Address,
        voucher_id: BytesN<32>,
        decision: ClaimDecision,
        reason_hash: BytesN<32>,
    ) -> Result<(), AidError> {
        storage::touch_instance(&env);
        require_verifier(&env, &verifier)?;
        if decision == ClaimDecision::Freeze {
            return Err(AidError::InvalidDecision);
        }
        let mut voucher =
            storage::get_voucher(&env, &voucher_id).ok_or(AidError::VoucherNotFound)?;
        if voucher.status != VoucherStatus::Redeemed && voucher.status != VoucherStatus::Frozen {
            return Err(AidError::InvalidVoucherState);
        }
        let evidence_revision = if storage::get_evidence(&env, &voucher_id, 1).is_some() {
            1
        } else if storage::get_evidence(&env, &voucher_id, 0).is_some() {
            0
        } else {
            return Err(AidError::MissingEvidence);
        };
        if decision == ClaimDecision::Approve {
            approved_merchant(&env, &voucher.merchant)?;
        }
        let mut campaign =
            storage::get_campaign(&env, &voucher.campaign_id).ok_or(AidError::CampaignNotFound)?;
        campaign.reserved_amount = checked_sub(campaign.reserved_amount, voucher.amount)?;
        match decision {
            ClaimDecision::Approve => {
                campaign.paid_amount = checked_add(campaign.paid_amount, voucher.amount)?;
                voucher.status = VoucherStatus::Paid;
            }
            ClaimDecision::Reject => {
                campaign.available_amount = checked_add(campaign.available_amount, voucher.amount)?;
                voucher.status = VoucherStatus::Rejected;
            }
            ClaimDecision::Freeze => return Err(AidError::InvalidDecision),
        }
        valid_campaign(&campaign)?;
        let now = env.ledger().timestamp();
        voucher.decided_at = now;
        voucher.decision_by = Some(verifier.clone());
        let attestation = DecisionAttestation {
            voucher_id: voucher_id.clone(),
            decision: decision.clone(),
            actor: verifier.clone(),
            reason_hash,
            evidence_revision,
            decided_at: now,
        };

        if decision == ClaimDecision::Approve {
            token::Client::new(&env, &campaign.token).transfer(
                &env.current_contract_address(),
                &voucher.merchant,
                &voucher.amount,
            );
        }
        storage::set_campaign(&env, &campaign);
        storage::set_voucher(&env, &voucher);
        storage::set_decision(&env, &attestation);
        env.events().publish(
            (Symbol::new(&env, "decision"), voucher_id),
            (verifier, decision, evidence_revision, voucher.amount),
        );
        Ok(())
    }

    pub fn is_admin(env: Env, address: Address) -> bool {
        storage::touch_instance(&env);
        admin_member(&env, &address)
    }

    pub fn is_verifier(env: Env, address: Address) -> bool {
        storage::touch_instance(&env);
        verifier_member(&env, &address)
    }

    /// Permissionless maintenance touch for a live campaign record.
    pub fn extend_campaign_ttl(env: Env, campaign_id: BytesN<32>) -> Result<(), AidError> {
        storage::touch_instance(&env);
        storage::get_campaign(&env, &campaign_id).ok_or(AidError::CampaignNotFound)?;
        Ok(())
    }

    /// Permissionless maintenance touch so unclaimed donor refunds remain recoverable.
    pub fn extend_contribution_ttl(
        env: Env,
        campaign_id: BytesN<32>,
        donor: Address,
    ) -> Result<(), AidError> {
        storage::touch_instance(&env);
        storage::get_contribution(&env, &campaign_id, &donor).ok_or(AidError::NoContribution)?;
        Ok(())
    }

    /// Permissionless maintenance touch for a live case record.
    pub fn extend_case_ttl(env: Env, case_id: BytesN<32>) -> Result<(), AidError> {
        storage::touch_instance(&env);
        storage::get_case(&env, &case_id).ok_or(AidError::CaseNotFound)?;
        Ok(())
    }

    /// Permissionless maintenance touch for an unresolved voucher and its evidence.
    pub fn extend_voucher_ttl(env: Env, voucher_id: BytesN<32>) -> Result<(), AidError> {
        storage::touch_instance(&env);
        let voucher = storage::get_voucher(&env, &voucher_id).ok_or(AidError::VoucherNotFound)?;
        let _ = storage::get_evidence(&env, &voucher_id, 0);
        let _ = storage::get_evidence(&env, &voucher_id, 1);
        let _ = storage::get_decision(&env, &voucher_id);
        let _ = storage::get_case(&env, &voucher.case_id);
        Ok(())
    }

    pub fn get_campaign(env: Env, campaign_id: BytesN<32>) -> Option<Campaign> {
        storage::touch_instance(&env);
        storage::get_campaign(&env, &campaign_id)
    }

    pub fn get_contribution(
        env: Env,
        campaign_id: BytesN<32>,
        donor: Address,
    ) -> Option<DonorContribution> {
        storage::touch_instance(&env);
        storage::get_contribution(&env, &campaign_id, &donor)
    }

    pub fn get_merchant(env: Env, merchant: Address) -> Option<Merchant> {
        storage::touch_instance(&env);
        storage::get_merchant(&env, &merchant)
    }

    pub fn get_case(env: Env, case_id: BytesN<32>) -> Option<BeneficiaryCase> {
        storage::touch_instance(&env);
        storage::get_case(&env, &case_id)
    }

    pub fn get_voucher(env: Env, voucher_id: BytesN<32>) -> Option<Voucher> {
        storage::touch_instance(&env);
        storage::get_voucher(&env, &voucher_id)
    }

    pub fn get_evidence(
        env: Env,
        voucher_id: BytesN<32>,
        revision: u32,
    ) -> Option<EvidenceSubmission> {
        storage::touch_instance(&env);
        storage::get_evidence(&env, &voucher_id, revision)
    }

    pub fn get_current_decision(env: Env, voucher_id: BytesN<32>) -> Option<DecisionAttestation> {
        storage::touch_instance(&env);
        storage::get_decision(&env, &voucher_id)
    }
}

#[cfg(test)]
mod test;
