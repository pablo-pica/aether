# Aethyr Aid — Idea Submission

> Stellar Journey to Mastery — Builder Track
>
> Question 1 [Essay]: What is your idea?
>
> **Status: Approved — gate to Levels 4–6 passed.**
>
> **Phase 5 implementation clarification:** This file preserves the approved proposal wording. The normative Level 4 runtime roles and lifecycle are in [`LEVEL-4-IMPLEMENTATION-SPEC.md`](./LEVEL-4-IMPLEMENTATION-SPEC.md): admins may emergency-freeze claims, while independent verifiers alone approve, reject, and resolve frozen claims.

---

## Aethyr Aid — Verified Typhoon Relief Payments on Stellar

### 1. Problem Statement

My province Bicol in the Philippines gets hit by typhoons harder than most. During Typhoon Kristine in October 2024, our entire town Bato, Camarines Sur was submerged. My brother and my father were there for a visit and were stranded for several days. Families lost homes and waited months for shelter aid.

This is not a one-off. According to the COA's 2024 audit of the DHSUD Integrated Disaster Shelter Assistance Program (IDSAP), relief can take 59 to 186 days to reach victims because of paper-based beneficiary lists, manual processing, and bureaucratic bottlenecks. Relief groups also struggle with a basic accountability question: who received what, from whom, and when? After Typhoon Kristine, even public relief reporting between Naga City and Angat Buhay became disputed.

Aethyr Aid is my attempt to fix that last-mile accountability gap. It is a milestone-gated relief protocol on Stellar where donations become vouchers, vouchers are redeemed through verified local merchants or cooperatives, and funds are released only after delivery is confirmed. The goal is not to pretend blockchain can magically know who needs help. The goal is to make every verification, voucher redemption, dispute, and payout attributable, timestamped, and auditable.

### 2. Why Stellar?

Stellar is a natural fit because it is built for low-cost payments, anchors, and real-world asset movement. Platforms like Coins.ph and MoneyGram show how Stellar can connect blockchain payments to familiar cash-in and cash-out rails. That matters in the Philippines because victims and small merchants should not need to understand crypto just to receive aid.

Stellar Aid Assist already proves that blockchain-based aid disbursement can work. Aethyr Aid focuses on the next layer: local verification and last-mile payout control. Soroban smart contracts can hold funds in phased escrows, track voucher states, store evidence hashes, record verifier attestations, and release payment only when the required checks are complete.

### 3. Target Users

The primary users are international donors, NGOs, and Overseas Filipino Workers (OFWs) who want to fund typhoon recovery and know where the money went. The operational users are NGO admins, barangay officials, volunteers, cooperatives, and registered merchants. The beneficiaries are families affected by typhoons who receive food, medicine, shelter materials, or other voucher-based aid.

Naga City and nearby Bicol communities are the ideal starting point because the problem is personal to me and the geography is clear. I would not start by forcing victims to use crypto wallets. The first pilot would use simple beneficiary case IDs and merchant voucher redemption, while NGOs and approved merchants interact with the Stellar-backed system behind the scenes.

### 4. Technical Architecture

Aethyr Aid is a mobile-first PWA built with Next.js and Tailwind CSS, connected to Stellar through StellarWalletsKit. I already built and deployed 2 Soroban contracts on testnet: a Router contract for token conversion paths and an Escrow contract for milestone-based release, disputes, refunds, and auto-release. The project currently has passing Rust contract tests and frontend Vitest coverage.

The Green Belt MVP stays intentionally narrow. A donor funds a campaign escrow. An NGO/admin creates beneficiary case IDs and approves local merchants or cooperatives. A voucher is issued for a purpose like food, medicine, or rebuilding materials. The merchant redeems the voucher, uploads a receipt or delivery evidence, and a verifier/admin approves or rejects the payout. Sensitive data stays off-chain; only hashes, states, and attestations are recorded for auditability.

This keeps the first version realistic. No beneficiary app, no SMS system, no QR/PIN flow, no GCash/Maya integration, and no full identity platform yet. The first validation is simple: can we trace one donation from campaign escrow to voucher, merchant evidence, verifier approval, and payout or dispute?

### 5. Complexity Evaluation

The hardest part is not putting a registry on-chain. The hardest part is making sure bad data does not enter the registry in the first place.

For the MVP, beneficiary verification is case-based and lightweight. An NGO opens the case, a barangay or community verifier confirms local impact, and a volunteer or field partner can add another attestation when needed. Beneficiaries do not need to manage wallets or upload documents themselves. For higher-risk or disputed cases, the system can require more evidence before release.

For merchants and cooperatives, Aethyr Aid requires approval before payout. Merchants submit basic identity, location, supply category, price list, and payout details. During redemption, they upload receipts or delivery evidence. Suspicious receipts, price gouging, repeated complaints, or mismatched deliveries can trigger review or suspension.

Dispute handling is part of the core flow. If goods were not received, if a household looks duplicated, or if merchant evidence is suspicious, the payout is frozen. An admin or independent reviewer can request more proof, approve release, reject the claim, refund unreleased funds, or suspend the merchant/verifier. Aethyr Aid does not eliminate fraud; it makes fraud harder to hide.

### 6. Roadmap

For Level 4 Green Belt, I will build the voucher MVP: campaign escrow, merchant registry, beneficiary case IDs, voucher redemption, evidence hash upload, verifier/admin approval, and basic dispute states: approve, reject, freeze. The demo should show one clean delivery and one disputed delivery.

For Level 5 Blue Belt, I will add multi-party verification thresholds, a donor trace page, merchant pricing checks, and a non-transferable Verified Delivery Receipt. The receipt will show the verified trail: donation allocation, voucher purpose, merchant redemption, evidence hash, verifier attestations, payout status, and dispute outcome if any.

For Level 6 Black Belt, the goal is a security review, a tighter pilot with a local NGO, cooperative, or volunteer group, and a realistic path to regulated cash-out partners. Mainnet deployment should only happen after the verification workflow is tested, because putting unverified data on-chain just makes bad data permanent.
