use soroban_sdk::{Address, BytesN, Env};

use crate::{
    BeneficiaryCase, Campaign, DataKey, DecisionAttestation, DonorContribution, EvidenceSubmission,
    Merchant, Voucher,
};

// Roughly 30- and 120-day windows at Stellar's target five-second ledger cadence.
pub const TTL_THRESHOLD_LEDGERS: u32 = 518_400;
pub const TTL_EXTEND_TO_LEDGERS: u32 = 2_073_600;

pub fn touch_instance(env: &Env) {
    env.storage()
        .instance()
        .extend_ttl(TTL_THRESHOLD_LEDGERS, TTL_EXTEND_TO_LEDGERS);
}

fn touch(env: &Env, key: &DataKey) {
    env.storage()
        .persistent()
        .extend_ttl(key, TTL_THRESHOLD_LEDGERS, TTL_EXTEND_TO_LEDGERS);
}

pub fn get_campaign(env: &Env, id: &BytesN<32>) -> Option<Campaign> {
    let key = DataKey::Campaign(id.clone());
    let value = env.storage().persistent().get(&key);
    if value.is_some() {
        touch(env, &key);
    }
    value
}

pub fn set_campaign(env: &Env, campaign: &Campaign) {
    let key = DataKey::Campaign(campaign.campaign_id.clone());
    env.storage().persistent().set(&key, campaign);
    touch(env, &key);
}

pub fn get_contribution(
    env: &Env,
    campaign_id: &BytesN<32>,
    donor: &Address,
) -> Option<DonorContribution> {
    let key = DataKey::Contribution(campaign_id.clone(), donor.clone());
    let value = env.storage().persistent().get(&key);
    if value.is_some() {
        touch(env, &key);
    }
    value
}

pub fn set_contribution(
    env: &Env,
    campaign_id: &BytesN<32>,
    donor: &Address,
    contribution: &DonorContribution,
) {
    let key = DataKey::Contribution(campaign_id.clone(), donor.clone());
    env.storage().persistent().set(&key, contribution);
    touch(env, &key);
}

pub fn get_merchant(env: &Env, address: &Address) -> Option<Merchant> {
    let key = DataKey::Merchant(address.clone());
    let value = env.storage().persistent().get(&key);
    if value.is_some() {
        touch(env, &key);
    }
    value
}

pub fn set_merchant(env: &Env, merchant: &Merchant) {
    let key = DataKey::Merchant(merchant.merchant.clone());
    env.storage().persistent().set(&key, merchant);
    touch(env, &key);
}

pub fn get_case(env: &Env, id: &BytesN<32>) -> Option<BeneficiaryCase> {
    let key = DataKey::Case(id.clone());
    let value = env.storage().persistent().get(&key);
    if value.is_some() {
        touch(env, &key);
    }
    value
}

pub fn set_case(env: &Env, case: &BeneficiaryCase) {
    let key = DataKey::Case(case.case_id.clone());
    env.storage().persistent().set(&key, case);
    touch(env, &key);
}

pub fn get_voucher(env: &Env, id: &BytesN<32>) -> Option<Voucher> {
    let key = DataKey::Voucher(id.clone());
    let value = env.storage().persistent().get(&key);
    if value.is_some() {
        touch(env, &key);
    }
    value
}

pub fn set_voucher(env: &Env, voucher: &Voucher) {
    let key = DataKey::Voucher(voucher.voucher_id.clone());
    env.storage().persistent().set(&key, voucher);
    touch(env, &key);
}

pub fn get_evidence(
    env: &Env,
    voucher_id: &BytesN<32>,
    revision: u32,
) -> Option<EvidenceSubmission> {
    let key = DataKey::Evidence(voucher_id.clone(), revision);
    let value = env.storage().persistent().get(&key);
    if value.is_some() {
        touch(env, &key);
    }
    value
}

pub fn set_evidence(env: &Env, evidence: &EvidenceSubmission) {
    let key = DataKey::Evidence(evidence.voucher_id.clone(), evidence.revision);
    env.storage().persistent().set(&key, evidence);
    touch(env, &key);
}

pub fn get_decision(env: &Env, voucher_id: &BytesN<32>) -> Option<DecisionAttestation> {
    let key = DataKey::Decision(voucher_id.clone());
    let value = env.storage().persistent().get(&key);
    if value.is_some() {
        touch(env, &key);
    }
    value
}

pub fn set_decision(env: &Env, decision: &DecisionAttestation) {
    let key = DataKey::Decision(decision.voucher_id.clone());
    env.storage().persistent().set(&key, decision);
    touch(env, &key);
}
