#![cfg(test)]

use super::*;
use soroban_sdk::{
    testutils::{Address as _, Ledger},
    token, Address, BytesN, Env,
};

const FUNDING: i128 = 10_000;
const VOUCHER_AMOUNT: i128 = 4_000;

struct Fixture {
    contract: Address,
    admin: Address,
    verifier: Address,
    donor: Address,
    merchant: Address,
    token: Address,
    campaign_id: BytesN<32>,
    case_id: BytesN<32>,
    voucher_id: BytesN<32>,
}

fn id(env: &Env, value: u8) -> BytesN<32> {
    BytesN::from_array(env, &[value; 32])
}

fn fixture(env: &Env) -> Fixture {
    env.mock_all_auths();
    env.ledger().with_mut(|ledger| ledger.timestamp = 1_000);

    let contract = env.register(AethyrAid, ());
    let client = AethyrAidClient::new(env, &contract);
    let admin = Address::generate(env);
    let verifier = Address::generate(env);
    let donor = Address::generate(env);
    let merchant = Address::generate(env);
    let token_admin = Address::generate(env);
    let token = env
        .register_stellar_asset_contract_v2(token_admin)
        .address();

    token::StellarAssetClient::new(env, &token).mint(&donor, &FUNDING);

    let campaign_id = id(env, 1);
    let case_id = id(env, 2);
    let voucher_id = id(env, 3);

    client.initialize(&admin);
    client.add_verifier(&admin, &verifier);
    client.create_campaign(&admin, &campaign_id, &token);
    client.approve_merchant(&admin, &merchant, &id(env, 4));
    client.create_case(&admin, &campaign_id, &case_id, &id(env, 5));
    client.fund_campaign(&donor, &campaign_id, &FUNDING);
    client.issue_voucher(
        &admin,
        &voucher_id,
        &campaign_id,
        &case_id,
        &merchant,
        &VOUCHER_AMOUNT,
        &VoucherCategory::Food,
        &id(env, 6),
        &2_000,
    );

    Fixture {
        contract,
        admin,
        verifier,
        donor,
        merchant,
        token,
        campaign_id,
        case_id,
        voucher_id,
    }
}

fn assert_campaign_identity(campaign: &Campaign) {
    assert_eq!(
        campaign.total_funded,
        campaign.available_amount
            + campaign.reserved_amount
            + campaign.paid_amount
            + campaign.refundable_amount
            + campaign.refunded_amount
    );
}

#[test]
fn clean_delivery_pays_once_and_rejects_replay() {
    let env = Env::default();
    let fx = fixture(&env);
    let client = AethyrAidClient::new(&env, &fx.contract);
    let token_client = token::Client::new(&env, &fx.token);

    assert_eq!(token_client.balance(&fx.donor), 0);
    assert_eq!(token_client.balance(&fx.contract), FUNDING);

    let funded = client.get_campaign(&fx.campaign_id).unwrap();
    assert_eq!(funded.available_amount, FUNDING - VOUCHER_AMOUNT);
    assert_eq!(funded.reserved_amount, VOUCHER_AMOUNT);
    assert_campaign_identity(&funded);

    client.redeem_voucher(&fx.merchant, &fx.voucher_id, &id(&env, 7), &id(&env, 8));
    assert_eq!(client.get_evidence(&fx.voucher_id, &0).unwrap().revision, 0);
    assert_eq!(
        client.get_voucher(&fx.voucher_id).unwrap().status,
        VoucherStatus::Redeemed
    );

    client.decide_claim(
        &fx.verifier,
        &fx.voucher_id,
        &ClaimDecision::Approve,
        &id(&env, 9),
    );

    let paid = client.get_campaign(&fx.campaign_id).unwrap();
    assert_eq!(paid.available_amount, FUNDING - VOUCHER_AMOUNT);
    assert_eq!(paid.reserved_amount, 0);
    assert_eq!(paid.paid_amount, VOUCHER_AMOUNT);
    assert_campaign_identity(&paid);
    assert_eq!(
        client.get_voucher(&fx.voucher_id).unwrap().status,
        VoucherStatus::Paid
    );
    assert_eq!(token_client.balance(&fx.merchant), VOUCHER_AMOUNT);
    assert_eq!(token_client.balance(&fx.contract), FUNDING - VOUCHER_AMOUNT);

    assert_eq!(
        client.try_redeem_voucher(&fx.merchant, &fx.voucher_id, &id(&env, 10), &id(&env, 11)),
        Err(Ok(AidError::InvalidVoucherState))
    );
    assert_eq!(
        client.try_decide_claim(
            &fx.verifier,
            &fx.voucher_id,
            &ClaimDecision::Approve,
            &id(&env, 12),
        ),
        Err(Ok(AidError::InvalidVoucherState))
    );

    assert_eq!(token_client.balance(&fx.merchant), VOUCHER_AMOUNT);
    assert_eq!(client.get_campaign(&fx.campaign_id).unwrap(), paid);
}

#[test]
fn disputed_delivery_preserves_evidence_and_releases_rejected_reservation() {
    let env = Env::default();
    let fx = fixture(&env);
    let client = AethyrAidClient::new(&env, &fx.contract);
    let token_client = token::Client::new(&env, &fx.token);
    let original_digest = id(&env, 20);
    let original_record_id = id(&env, 21);

    client.redeem_voucher(
        &fx.merchant,
        &fx.voucher_id,
        &original_digest,
        &original_record_id,
    );
    client.freeze_claim(&fx.admin, &fx.voucher_id, &id(&env, 22));

    let frozen = client.get_campaign(&fx.campaign_id).unwrap();
    assert_eq!(frozen.reserved_amount, VOUCHER_AMOUNT);
    assert_eq!(frozen.paid_amount, 0);
    assert_eq!(
        client.get_voucher(&fx.voucher_id).unwrap().status,
        VoucherStatus::Frozen
    );

    let revised_digest = id(&env, 23);
    let revised_record_id = id(&env, 24);
    client.append_evidence_revision(
        &fx.merchant,
        &fx.voucher_id,
        &revised_digest,
        &revised_record_id,
    );

    let original = client.get_evidence(&fx.voucher_id, &0).unwrap();
    let revision = client.get_evidence(&fx.voucher_id, &1).unwrap();
    assert_eq!(original.content_digest, original_digest);
    assert_eq!(original.evidence_record_id, original_record_id);
    assert_eq!(revision.content_digest, revised_digest);
    assert_eq!(revision.evidence_record_id, revised_record_id);

    client.decide_claim(
        &fx.verifier,
        &fx.voucher_id,
        &ClaimDecision::Reject,
        &id(&env, 25),
    );

    let rejected = client.get_campaign(&fx.campaign_id).unwrap();
    assert_eq!(rejected.available_amount, FUNDING);
    assert_eq!(rejected.reserved_amount, 0);
    assert_eq!(rejected.paid_amount, 0);
    assert_campaign_identity(&rejected);
    assert_eq!(
        client.get_voucher(&fx.voucher_id).unwrap().status,
        VoucherStatus::Rejected
    );
    assert_eq!(token_client.balance(&fx.merchant), 0);
    assert_eq!(token_client.balance(&fx.contract), FUNDING);

    assert_eq!(
        client.try_append_evidence_revision(
            &fx.merchant,
            &fx.voucher_id,
            &id(&env, 26),
            &id(&env, 27),
        ),
        Err(Ok(AidError::InvalidVoucherState))
    );
    assert_eq!(
        client.try_decide_claim(
            &fx.verifier,
            &fx.voucher_id,
            &ClaimDecision::Reject,
            &id(&env, 28),
        ),
        Err(Ok(AidError::InvalidVoucherState))
    );
    assert_eq!(client.get_campaign(&fx.campaign_id).unwrap(), rejected);
}

#[test]
fn frozen_claim_approval_after_revision_pays_once_and_attests_revision() {
    let env = Env::default();
    let fx = fixture(&env);
    let client = AethyrAidClient::new(&env, &fx.contract);
    let token_client = token::Client::new(&env, &fx.token);

    client.redeem_voucher(&fx.merchant, &fx.voucher_id, &id(&env, 30), &id(&env, 31));
    client.freeze_claim(&fx.admin, &fx.voucher_id, &id(&env, 32));
    client.append_evidence_revision(&fx.merchant, &fx.voucher_id, &id(&env, 33), &id(&env, 34));
    client.decide_claim(
        &fx.verifier,
        &fx.voucher_id,
        &ClaimDecision::Approve,
        &id(&env, 35),
    );

    assert_eq!(token_client.balance(&fx.merchant), VOUCHER_AMOUNT);
    assert_eq!(
        client
            .get_current_decision(&fx.voucher_id)
            .unwrap()
            .evidence_revision,
        1
    );
    let campaign = client.get_campaign(&fx.campaign_id).unwrap();
    assert_eq!(campaign.reserved_amount, 0);
    assert_eq!(campaign.paid_amount, VOUCHER_AMOUNT);
    assert_campaign_identity(&campaign);
}

#[test]
fn cancellation_expiration_closure_and_proportional_refund_return_dust() {
    let env = Env::default();
    env.mock_all_auths();
    env.ledger().with_mut(|ledger| ledger.timestamp = 1_000);
    let contract = env.register(AethyrAid, ());
    let client = AethyrAidClient::new(&env, &contract);
    let admin = Address::generate(&env);
    let donor_one = Address::generate(&env);
    let donor_two = Address::generate(&env);
    let donor_three = Address::generate(&env);
    let token = env
        .register_stellar_asset_contract_v2(Address::generate(&env))
        .address();
    let token_admin = token::StellarAssetClient::new(&env, &token);
    for donor in [&donor_one, &donor_two, &donor_three] {
        token_admin.mint(donor, &1);
    }
    let campaign_id = id(&env, 40);
    let case_id = id(&env, 41);
    let cancel_id = id(&env, 42);
    let expire_id = id(&env, 43);
    let merchant = Address::generate(&env);

    client.initialize(&admin);
    client.create_campaign(&admin, &campaign_id, &token);
    client.approve_merchant(&admin, &merchant, &id(&env, 44));
    client.create_case(&admin, &campaign_id, &case_id, &id(&env, 45));
    for donor in [&donor_one, &donor_two, &donor_three] {
        client.fund_campaign(donor, &campaign_id, &1);
    }
    client.issue_voucher(
        &admin,
        &cancel_id,
        &campaign_id,
        &case_id,
        &merchant,
        &1,
        &VoucherCategory::Food,
        &id(&env, 46),
        &2_000,
    );
    assert_eq!(
        client.try_close_campaign(&admin, &campaign_id),
        Err(Ok(AidError::ReservedFundsExist))
    );
    client.cancel_voucher(&admin, &cancel_id);
    client.issue_voucher(
        &admin,
        &expire_id,
        &campaign_id,
        &case_id,
        &merchant,
        &1,
        &VoucherCategory::Food,
        &id(&env, 47),
        &1_001,
    );
    assert_eq!(
        client.try_expire_voucher(&expire_id),
        Err(Ok(AidError::VoucherNotExpired))
    );
    env.ledger().with_mut(|ledger| ledger.timestamp = 1_001);
    client.expire_voucher(&expire_id);
    client.close_campaign(&admin, &campaign_id);

    assert_eq!(client.claim_refund(&donor_one, &campaign_id), 1);
    assert_eq!(client.claim_refund(&donor_two, &campaign_id), 1);
    assert_eq!(client.claim_refund(&donor_three, &campaign_id), 1);
    assert_eq!(
        client.try_claim_refund(&donor_one, &campaign_id),
        Err(Ok(AidError::RefundAlreadyClaimed))
    );
    let campaign = client.get_campaign(&campaign_id).unwrap();
    assert_eq!(campaign.refundable_amount, 0);
    assert_eq!(campaign.refunded_amount, 3);
    assert_campaign_identity(&campaign);
}

#[test]
fn authorization_roles_and_registry_are_strictly_separated() {
    let env = Env::default();
    let fx = fixture(&env);
    let client = AethyrAidClient::new(&env, &fx.contract);
    let outsider = Address::generate(&env);

    assert_eq!(
        client.try_create_campaign(&outsider, &id(&env, 50), &fx.token),
        Err(Ok(AidError::NotAdmin))
    );
    assert_eq!(
        client.try_add_verifier(&fx.admin, &fx.admin),
        Err(Ok(AidError::RoleOverlap))
    );
    assert_eq!(
        client.try_add_admin(&fx.admin, &fx.verifier),
        Err(Ok(AidError::RoleOverlap))
    );
    assert_eq!(
        client.try_decide_claim(
            &fx.admin,
            &fx.voucher_id,
            &ClaimDecision::Approve,
            &id(&env, 51),
        ),
        Err(Ok(AidError::NotVerifier))
    );
    assert_eq!(
        client.try_remove_admin(&fx.admin, &fx.admin),
        Err(Ok(AidError::LastAdmin))
    );
    assert_eq!(
        client.try_redeem_voucher(&outsider, &fx.voucher_id, &id(&env, 52), &id(&env, 53)),
        Err(Ok(AidError::MerchantNotFound))
    );
    assert_eq!(
        fx.case_id,
        client.get_voucher(&fx.voucher_id).unwrap().case_id
    );
}

#[test]
fn aggregate_token_balance_is_conserved_across_campaigns_sharing_a_token() {
    let env = Env::default();
    let fx = fixture(&env);
    let client = AethyrAidClient::new(&env, &fx.contract);
    let token_client = token::Client::new(&env, &fx.token);
    let campaign_two = id(&env, 60);
    let case_two = id(&env, 61);
    let voucher_two = id(&env, 62);

    token::StellarAssetClient::new(&env, &fx.token).mint(&fx.donor, &100);
    client.create_campaign(&fx.admin, &campaign_two, &fx.token);
    client.create_case(&fx.admin, &campaign_two, &case_two, &id(&env, 63));
    client.fund_campaign(&fx.donor, &campaign_two, &100);
    client.issue_voucher(
        &fx.admin,
        &voucher_two,
        &campaign_two,
        &case_two,
        &fx.merchant,
        &25,
        &VoucherCategory::Medicine,
        &id(&env, 64),
        &2_000,
    );
    client.redeem_voucher(&fx.merchant, &voucher_two, &id(&env, 65), &id(&env, 66));
    client.decide_claim(
        &fx.verifier,
        &voucher_two,
        &ClaimDecision::Reject,
        &id(&env, 67),
    );

    let one = client.get_campaign(&fx.campaign_id).unwrap();
    let two = client.get_campaign(&campaign_two).unwrap();
    assert_eq!(
        token_client.balance(&fx.contract),
        one.available_amount
            + one.reserved_amount
            + one.refundable_amount
            + two.available_amount
            + two.reserved_amount
            + two.refundable_amount
    );

    client.close_campaign(&fx.admin, &campaign_two);
    assert_eq!(client.claim_refund(&fx.donor, &campaign_two), 100);
    let one = client.get_campaign(&fx.campaign_id).unwrap();
    let two = client.get_campaign(&campaign_two).unwrap();
    assert_eq!(
        token_client.balance(&fx.contract),
        one.available_amount
            + one.reserved_amount
            + one.refundable_amount
            + two.available_amount
            + two.reserved_amount
            + two.refundable_amount
    );
}

#[test]
fn live_records_extend_ttl_on_mutation_and_reads() {
    use soroban_sdk::testutils::storage::{Instance as _, Persistent as _};

    let env = Env::default();
    let fx = fixture(&env);
    let client = AethyrAidClient::new(&env, &fx.contract);
    let campaign_key = DataKey::Campaign(fx.campaign_id.clone());
    let contribution_key = DataKey::Contribution(fx.campaign_id.clone(), fx.donor.clone());
    let (before, contribution_before, instance_before) = env.as_contract(&fx.contract, || {
        (
            env.storage().persistent().get_ttl(&campaign_key),
            env.storage().persistent().get_ttl(&contribution_key),
            env.storage().instance().get_ttl(),
        )
    });
    assert!(before >= storage::TTL_THRESHOLD_LEDGERS);
    assert!(contribution_before >= storage::TTL_THRESHOLD_LEDGERS);
    assert!(instance_before >= storage::TTL_THRESHOLD_LEDGERS);

    env.ledger().with_mut(|ledger| ledger.sequence_number += 1);
    client.extend_campaign_ttl(&fx.campaign_id);
    client.extend_contribution_ttl(&fx.campaign_id, &fx.donor);
    let (after, contribution_after, instance_after) = env.as_contract(&fx.contract, || {
        (
            env.storage().persistent().get_ttl(&campaign_key),
            env.storage().persistent().get_ttl(&contribution_key),
            env.storage().instance().get_ttl(),
        )
    });
    assert!(after >= before - 1);
    assert!(contribution_after >= contribution_before - 1);
    assert!(instance_after >= instance_before - 1);
}
