use soroban_sdk::{contracttype, Address, BytesN};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum CampaignStatus {
    Open,
    Closed,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Campaign {
    pub campaign_id: BytesN<32>,
    pub creator_admin: Address,
    pub token: Address,
    pub status: CampaignStatus,
    pub total_funded: i128,
    pub available_amount: i128,
    pub reserved_amount: i128,
    pub paid_amount: i128,
    pub refund_pool_total: i128,
    pub refundable_amount: i128,
    pub refunded_amount: i128,
    pub refunded_contribution_weight: i128,
    pub created_at: u64,
    pub closed_at: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct DonorContribution {
    pub contributed_amount: i128,
    pub refund_claimed_amount: i128,
    pub refund_claimed: bool,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum MerchantStatus {
    Approved,
    Suspended,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Merchant {
    pub merchant: Address,
    pub status: MerchantStatus,
    pub profile_hash: BytesN<32>,
    pub updated_at: u64,
    pub updated_by: Address,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum CaseStatus {
    Active,
    Closed,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct BeneficiaryCase {
    pub case_id: BytesN<32>,
    pub campaign_id: BytesN<32>,
    pub status: CaseStatus,
    pub case_record_hash: BytesN<32>,
    pub created_at: u64,
    pub created_by: Address,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum VoucherCategory {
    Food,
    Medicine,
    Shelter,
    Other,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum VoucherStatus {
    Issued,
    Redeemed,
    Frozen,
    Paid,
    Rejected,
    Cancelled,
    Expired,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Voucher {
    pub voucher_id: BytesN<32>,
    pub campaign_id: BytesN<32>,
    pub case_id: BytesN<32>,
    pub merchant: Address,
    pub amount: i128,
    pub category: VoucherCategory,
    pub purpose_hash: BytesN<32>,
    pub status: VoucherStatus,
    pub expires_at: u64,
    pub issued_at: u64,
    pub redeemed_at: u64,
    pub decided_at: u64,
    pub decision_by: Option<Address>,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct EvidenceSubmission {
    pub voucher_id: BytesN<32>,
    pub revision: u32,
    pub content_digest: BytesN<32>,
    pub evidence_record_id: BytesN<32>,
    pub submitted_by: Address,
    pub submitted_at: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ClaimDecision {
    Approve,
    Reject,
    Freeze,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct DecisionAttestation {
    pub voucher_id: BytesN<32>,
    pub decision: ClaimDecision,
    pub actor: Address,
    pub reason_hash: BytesN<32>,
    pub evidence_revision: u32,
    pub decided_at: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DataKey {
    Initialized,
    Admin(Address),
    AdminCount,
    Verifier(Address),
    Campaign(BytesN<32>),
    Contribution(BytesN<32>, Address),
    Merchant(Address),
    Case(BytesN<32>),
    Voucher(BytesN<32>),
    Evidence(BytesN<32>, u32),
    Decision(BytesN<32>),
}
