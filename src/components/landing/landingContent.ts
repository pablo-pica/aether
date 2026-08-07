export interface LandingFeature {
  title: string;
  body: string;
}

export interface LandingRole extends LandingFeature {
  label: "Donor" | "Coordinator" | "Merchant" | "Verifier";
  detail: string;
}

export interface LandingFaq {
  question: string;
  answer: string;
}

export const aidJourney = [
  "Campaign",
  "Case",
  "Voucher",
  "Evidence",
  "Verification",
  "Payout or Dispute",
] as const;

export const aidScopeClaims = {
  wallets: "Beneficiaries do not need wallets.",
  privacy: "Sensitive data stays off-chain.",
  truth: "Blockchain does not verify real-world truth by itself.",
} as const;

export const aidCapabilities: LandingFeature[] = [
  {
    title: "Campaign escrow",
    body: "Donations are held for a specific Bicol relief campaign before vouchers are issued.",
  },
  {
    title: "Lightweight case IDs",
    body: "Coordinators track beneficiary cases without putting names, documents, or sensitive details on-chain.",
  },
  {
    title: "Merchant redemption",
    body: "Approved merchants and cooperatives redeem purpose-limited vouchers with a digest of delivery evidence.",
  },
  {
    title: "Separated review duties",
    body: "Coordinators freeze suspicious redeemed claims; independent verifiers approve clean evidence or reject a frozen claim.",
  },
];

export const aidRoles: LandingRole[] = [
  {
    label: "Donor",
    title: "Fund accountable recovery",
    detail: "OFWs · NGOs · community donors",
    body: "Contribute to a campaign whose available, reserved, and paid balances remain visible.",
  },
  {
    label: "Coordinator",
    title: "Operate the relief program",
    detail: "NGOs · local relief teams",
    body: "Create campaigns and cases, approve merchants, issue vouchers, and freeze suspicious claims.",
  },
  {
    label: "Merchant",
    title: "Deliver and redeem",
    detail: "Stores · pharmacies · cooperatives",
    body: "Accept purpose-limited vouchers and submit a digest of delivery evidence for review.",
  },
  {
    label: "Verifier",
    title: "Make an attributable decision",
    detail: "Independent reviewers",
    body: "Approve a clean redeemed claim or reject a frozen claim. A verifier cannot approve their own merchant address.",
  },
];

export const aidFaqs: LandingFaq[] = [
  {
    question: "Is this a beneficiary app?",
    answer: "No. Families are central to the workflow, but coordinators, approved merchants, donors, and independent verifiers operate the MVP.",
  },
  {
    question: "Does it replace local verification?",
    answer: "No. It makes evidence revisions, verifier decisions, and payout states attributable and auditable.",
  },
  {
    question: "Is the operational dashboard gone?",
    answer: "No. The role-guided operational workspace is available at /app, with Send and Escrow retained under Protocol tools.",
  },
];
