# Aethyr Aid — Level 4 Implementation Specification

**Status:** Approved for Phase 6 implementation  
**Scope:** Green Belt voucher MVP on Stellar Testnet  
**Decision date:** August 4, 2026  
**Source:** Approved proposal in [`IDEA-SUBMISSION.md`](./IDEA-SUBMISSION.md)

This specification is the Phase 5 contract between product intent, implementation, tests, and submission evidence. Phase 6 must write failing contract tests from these scenarios before adding contract code. Any change to the states, authorization rules, accounting, privacy boundary, or deferred scope requires an explicit documentation decision first.

## 1. Approved Architecture Decisions

1. Add one new Soroban contract, provisionally named `aethyr-aid`, for campaign custody, merchant registry, beneficiary case IDs, vouchers, evidence attestations, verification, payout, and disputes.
2. Keep the Level 3 `aethyr-router` and `aethyr-escrow` contracts unchanged. Their wallet/auth/event patterns may be reused, but neither contract participates in the Level 4 voucher lifecycle.
3. Do not route aid funds through the Router's simulated swap path. Donors fund a campaign directly in its configured Soroban token.
4. Use pooled campaign custody. Voucher issuance reserves funds immediately so every issued voucher remains covered.
5. Keep NGO/admin and verifier roles separate. Admins operate campaigns and may emergency-freeze claims; only verifiers approve, reject, or resolve frozen claims.
6. Store an evidence content digest and a non-sensitive opaque evidence-record ID on-chain. Raw files, URLs, identity data, and personal data remain in access-controlled off-chain storage.
7. A frozen claim may receive at most one append-only evidence revision. The original submission remains immutable and auditable.
8. No voucher auto-release exists. Every payout requires an explicit verifier authorization.

## 2. Level 4 Boundary

### Included

- Campaign creation, direct token funding, pooled accounting, closure, and proportional refund claims.
- Approved/suspended merchant or cooperative registry.
- Privacy-preserving beneficiary case IDs.
- Purpose-bound voucher issuance, reservation, redemption, expiration, and cancellation.
- Evidence digest plus opaque evidence-record ID submission.
- Admin emergency freeze plus verifier approval, rejection, and frozen-claim resolution.
- Admin emergency freeze.
- Atomic merchant payout on verifier approval.
- Events and read methods needed by the frontend and submission evidence.

### Deferred

- Beneficiary wallets or applications, SMS, QR/PIN redemption, and full identity/KYC systems.
- Multi-party verification thresholds, multisig governance, donor trace pages, pricing checks, and Verified Delivery Receipts.
- Token conversion, Router integration, anchors, GCash/Maya, regulated cash-out, Mainnet, and automatic payout.
- Evidence replacement beyond one append-only frozen-claim revision.
- Public raw evidence or public personal feedback data.

## 3. Roles and Authorization

| Role | Permitted actions | Prohibited actions |
|------|-------------------|--------------------|
| Donor | Fund an open campaign; claim their proportional refund after closure | Create operational records; redeem; verify; withdraw another donor's refund |
| Admin | Manage admin/verifier membership; create/close campaigns; approve/suspend merchants; create/close cases; issue/cancel vouchers; emergency-freeze redeemed claims | Approve, reject, or pay merchant claims; act as a verifier; redirect donor refunds |
| Merchant | Redeem an assigned voucher and submit its initial evidence package; add one evidence revision while frozen | Redeem for another merchant; choose a payout decision; mutate prior evidence |
| Verifier | Approve or reject redeemed claims; approve or reject frozen claims | Emergency-freeze claims; manage campaigns/cases/merchant registry; alter evidence; act without verifier auth |
| Beneficiary | No wallet role in Level 4 | All on-chain actions |

Role membership is stored on-chain. Admin and verifier sets must be disjoint. Initialization creates the first admin; at least one admin must remain. Role changes require admin authorization and emit events. Multi-party thresholds are deferred, so a single authorized verifier decision is sufficient for Level 4.

## 4. Domain Records

All IDs are caller-supplied random `BytesN<32>` values and must be unique within their record type. IDs must not be derived from names, phone numbers, addresses, government identifiers, or other personal data.

### Configuration

- `initialized: bool`
- `admins: Address -> bool`
- `verifiers: Address -> bool`

### Campaign

- `campaign_id: BytesN<32>`
- `creator_admin: Address`
- `token: Address`
- `status: Open | Closed`
- `total_funded: i128`
- `available_amount: i128`
- `reserved_amount: i128`
- `paid_amount: i128`
- `refund_pool_total: i128` — immutable closure snapshot used for proportional calculations
- `refundable_amount: i128` — unclaimed portion of the refund pool
- `refunded_amount: i128`
- `refunded_contribution_weight: i128` — contribution principal already represented by claims
- `created_at: u64`
- `closed_at: u64`

Per-donor storage records `contributed_amount`, `refund_claimed_amount`, and `refund_claimed`. These fields make entitlement and replay checks deterministic.

### Merchant

- `merchant: Address`
- `status: Approved | Suspended`
- `profile_hash: BytesN<32>` — digest of an off-chain, access-controlled merchant record; never identity data itself
- `updated_at: u64`
- `updated_by: Address`

### Beneficiary Case

- `case_id: BytesN<32>`
- `campaign_id: BytesN<32>`
- `status: Active | Closed`
- `case_record_hash: BytesN<32>` — digest of the private off-chain case record
- `created_at: u64`
- `created_by: Address`

The contract never stores beneficiary names, contact details, household descriptions, documents, or wallet addresses.

### Voucher

- `voucher_id: BytesN<32>`
- `campaign_id: BytesN<32>`
- `case_id: BytesN<32>`
- `merchant: Address`
- `amount: i128`
- `category: Food | Medicine | Shelter | Other`
- `purpose_hash: BytesN<32>`
- `status: Issued | Redeemed | Frozen | Paid | Rejected | Cancelled | Expired`
- `expires_at: u64`
- `issued_at: u64`
- `redeemed_at: u64`
- `decided_at: u64`
- `decision_by: Option<Address>`

### Evidence Submission

Each voucher has at most two immutable submissions: revision `0` at redemption and optional revision `1` while frozen.

- `voucher_id: BytesN<32>`
- `revision: u32`
- `content_digest: BytesN<32>` — SHA-256 digest of the complete off-chain evidence package
- `evidence_record_id: BytesN<32>` — random opaque lookup ID, not a URI or encoded personal data
- `submitted_by: Address`
- `submitted_at: u64`

### Decision Attestation

- `voucher_id: BytesN<32>`
- `decision: Approve | Reject | Freeze`
- `actor: Address`
- `reason_hash: BytesN<32>` — digest of a private reason record; use an agreed empty-value digest when no reason is supplied
- `evidence_revision: u32`
- `decided_at: u64`

Decision events provide the audit trail. Contract storage must retain enough information to return the current decision and evidence revision without exposing private content.

## 5. State Machines

### Campaign

```text
Open --close (reserved == 0)--> Closed
```

- Only open campaigns accept funding or voucher issuance.
- Closing moves all `available_amount` to `refundable_amount`; it never transfers funds to an admin.
- Closing is rejected while `reserved_amount > 0`.
- After closure, each donor may claim `floor(refund_pool_total × contributed_amount / total_funded)`.
- A claim increments `refunded_contribution_weight`. When it reaches `total_funded`, that final eligible claim receives all integer-division dust remaining in `refundable_amount`.

### Merchant

```text
Unregistered --approve--> Approved --suspend--> Suspended --approve--> Approved
```

A suspended merchant cannot receive new vouchers, redeem, submit evidence revisions, or receive payout approval.

### Beneficiary Case

```text
Active --close--> Closed
```

Only an active case in the same campaign can receive a new voucher. Closure does not mutate vouchers already issued.

### Voucher

```text
Issued --redeem + evidence[0]--> Redeemed --verifier approve + payout--> Paid
   |                                  |--verifier reject-----------> Rejected
   |                                  |--admin emergency freeze----> Frozen
   |--admin cancel---------------> Cancelled                           |--merchant evidence[1]--> Frozen
   |--expire---------------------> Expired                             |--verifier approve + payout--> Paid
                                                                      |--verifier reject-----------> Rejected
```

- Issuance moves `amount` from campaign available balance to reserved balance.
- Cancellation and expiration are valid only from `Issued` and release the reservation to campaign availability.
- Redemption requires the assigned merchant, an approved merchant record, an active case, a non-expired voucher, and initial evidence.
- Rejection releases the reservation to campaign availability.
- Freeze keeps the reservation intact. Only an admin may emergency-freeze a redeemed claim; only a verifier may resolve it.
- A merchant may append exactly one evidence revision while frozen. Prior evidence is never overwritten.
- Approval and token payout occur atomically in one verifier-authorized invocation. Success moves reserved balance to paid balance and sets `Paid`; any transfer failure reverts the entire invocation.
- No terminal state can transition again.

## 6. Campaign Accounting and Payout Invariants

For every campaign, all amounts are non-negative and:

```text
total_funded
  = available_amount
  + reserved_amount
  + paid_amount
  + refundable_amount
  + refunded_amount
```

The contract token balance attributable to a campaign is:

```text
available_amount + reserved_amount + refundable_amount
```

For each token, the contract's actual token balance must equal the sum of that expression across all campaigns configured for the token. `refund_pool_total` is a closure snapshot and is not added to the accounting identity.

Required guards:

1. Voucher amount must be positive and no greater than campaign availability.
2. Issuance decreases available and increases reserved by exactly the voucher amount.
3. Reject/cancel/expire decreases reserved and increases available exactly once.
4. Freeze does not alter accounting.
5. Approval decreases reserved, increases paid, and transfers exactly the voucher amount exactly once.
6. Campaign closure requires zero reserved balance and moves available to refundable exactly once.
7. Refund claims cannot exceed the campaign refundable pool or a donor's calculated entitlement.
8. Admins cannot withdraw campaign funds or choose refund recipients.
9. Check state and authorization, update effects, and perform token interaction so Soroban rollback preserves atomicity on failure.

## 7. Replay and State-Transition Protection

- Reject duplicate campaign, case, and voucher IDs.
- Reject duplicate initial evidence and more than one frozen-claim evidence revision.
- Reject repeated redemption, decision, payout, cancellation, expiration, closure, and refund claims.
- Bind each voucher to one campaign, case, merchant, token amount, category, and purpose hash at issuance; these fields are immutable.
- Check role membership and record status at execution time, not only at creation time.
- Reject approval when the merchant is suspended, evidence is absent, the caller is not a verifier, or the voucher is not `Redeemed`/`Frozen`.
- Reject any automatic or time-based payout. Expiration may release only an unredeemed voucher.
- Emit a unique event for every successful state transition and accounting movement.
- Use persistent storage for domain records and extend record TTLs on creation and mutation beyond the documented Testnet validation horizon. Instance storage for configuration/roles must also be extended. Phase 6 must centralize TTL constants and include a maintenance operation or access pattern that prevents live campaigns, unresolved reservations, and unclaimed refunds from expiring silently.

## 8. Privacy Boundary

### Allowed on-chain

- Random case, campaign, voucher, and opaque evidence IDs.
- Content, profile, purpose, case-record, and reason digests created from salted or otherwise non-enumerable private records where dictionary inference is plausible.
- Public operational wallet addresses and role membership.
- States, amounts, timestamps, evidence revision numbers, decisions, payout records, and events.

### Prohibited on-chain and in public analytics/logs

- Beneficiary names, phone numbers, addresses, emails, household details, government IDs, photographs, or documents.
- Merchant identity/KYC documents.
- Raw evidence, evidence URLs, storage credentials, signed URLs, or access tokens.
- Free-text verifier reasons or feedback containing personal data.

A digest proves integrity only; it does not prove truth. The frontend must generate random IDs, validate fixed-width digest inputs, and warn operators never to encode personal data. The contract cannot infer whether arbitrary 32-byte values originated from personal data, so this boundary also requires UI validation, operator guidance, and review procedures.

## 9. Required Contract Interface Semantics

Exact Rust names may change during Phase 6 without changing behavior, but the contract must expose operations equivalent to:

- `initialize`, `add_admin`, `remove_admin`, `add_verifier`, `remove_verifier`
- `create_campaign`, `fund_campaign`, `close_campaign`, `claim_refund`
- `approve_merchant`, `suspend_merchant`
- `create_case`, `close_case`
- `issue_voucher`, `cancel_voucher`, `expire_voucher`
- `redeem_voucher`, `append_evidence_revision`
- `freeze_claim`, `decide_claim`
- Read methods for configuration, role membership, campaigns, donor contributions/refunds, merchants, cases, vouchers, evidence submissions, and current decision attestations

Events must include stable identifiers and non-sensitive state needed to reconstruct the clean and disputed flows. Event payloads must not include raw evidence references or personal data.

## 10. Acceptance Scenarios for Phase 6 Tests

### Clean delivery

1. Initialize roles, campaign, approved merchant, and active case.
2. Donor funds the campaign; balances and contribution ledger update.
3. Admin issues a voucher; funds move available → reserved.
4. Assigned approved merchant redeems before expiry with evidence revision `0`.
5. Independent verifier approves.
6. Merchant receives exactly the voucher amount; campaign moves reserved → paid; voucher becomes `Paid`.
7. Repeating redemption, approval, or payout fails without changing balances.

### Disputed delivery

1. Follow the clean flow through redemption.
2. Admin emergency-freezes the claim; voucher becomes `Frozen` and funds remain reserved.
3. Assigned merchant appends evidence revision `1`; revision `0` remains unchanged.
4. Independent verifier rejects the frozen claim.
5. Voucher becomes `Rejected`; merchant receives nothing; funds move reserved → available.
6. Repeated revision or decision attempts fail without changing balances.

### Frozen claim approved after revision

- Freeze, append revision `1`, then verifier approval pays exactly once and records revision `1` in the attestation.

### Cancellation, expiration, closure, and refund

- Admin cancellation of an issued voucher releases its reservation.
- Expiring an issued voucher after `expires_at` releases its reservation; expiration before the deadline or after redemption fails.
- Campaign closure fails while any reservation exists.
- Closing with no reservations moves available funds to the refundable pool.
- Donors claim proportional refunds exactly once; aggregate refunds never exceed the refundable pool and final dust is returned.

### Authorization and registry failures

- Non-admin role/registry/campaign/case/voucher operations fail.
- Admin approval/rejection/payout attempts fail.
- Non-verifier decisions fail.
- Wrong or suspended merchant redemption, revision, or payout approval fails.
- Admin/verifier role overlap and removal of the last admin fail.

### Validation and accounting failures

- Zero/negative funding or voucher amounts fail.
- Over-reservation fails.
- Duplicate IDs fail.
- Missing/duplicate evidence and a third evidence submission fail.
- Voucher/case campaign mismatch and closed-case issuance fail.
- Every failed call leaves contract storage and token balances unchanged.
- Property-style accounting checks assert the campaign identity after every successful transition and aggregate contract token conservation across campaigns sharing a token.
- TTL tests or storage inspection confirm live records are extended and cannot expire before the supported validation/refund horizon.

### Privacy checks

- Contract fields accept only fixed-width IDs/digests, never strings or URLs for evidence/case records.
- Frontend tests verify no raw evidence URL or beneficiary data is serialized into contract arguments, analytics, monitoring context, or public activity records.
- Manual validation confirms private evidence requires authorized access and public screenshots contain no personal data.

## 11. Validation and Submission Evidence Plan

### Ten real wallet users

Use ten distinct consenting Testnet wallet users:

- 3 donors
- 2 NGO/admin operators
- 2 merchants/cooperatives
- 3 independent verifiers

Beneficiaries do not need wallets. Maintain a private consent/contact sheet only if operationally required. Public evidence should use role aliases, transaction hashes, dates, and aggregate counts rather than names or contact details.

### Representative Testnet evidence

Record the deployed `aethyr-aid` contract ID and explorer links or transaction hashes for:

- Initialization and role assignment.
- Campaign creation and at least three donor funding transactions.
- Merchant approval, case creation, and voucher issuance.
- Clean redemption, evidence submission, verifier approval, and payout.
- Disputed redemption, freeze, evidence revision, and verifier rejection.
- Campaign closure and at least one refund claim when exercised in validation.

Also preserve deployment commands, network, source commit, WASM hash when available, contract test output, and CI run URL.

### Analytics

Collect privacy-conscious product events only, such as:

- Wallet connection success/failure by wallet provider and role selection.
- Flow started/completed/failed by operation type.
- Transaction confirmation latency bucket and recoverable error category.
- Mobile viewport/session counts and onboarding completion.

Do not send full wallet addresses, campaign/case/voucher/evidence IDs, transaction XDR, raw error payloads, personal data, or evidence metadata to analytics. Transaction hashes belong in the explicit evidence register, not general analytics.

### Monitoring

Capture frontend exceptions, API/relayer availability, RPC failures, transaction simulation/submission outcomes, and deployment health. Redact wallet addresses, contract arguments, XDR, opaque IDs, evidence references, signed URLs, and user-entered text. Document retention and access settings before onboarding.

### Feedback

Use a short private form covering role, task completed, usability blockers, trust/clarity, errors, and one improvement request. Obtain consent, minimize identity fields, restrict raw-response access, and publish only an aggregate summary with themes and resulting changes.

### Required screenshots and demo artifacts

Capture sanitized evidence of:

1. Mobile donor campaign funding and confirmation.
2. Admin merchant approval, case creation, and voucher reservation.
3. Merchant redemption and evidence submission confirmation without raw evidence.
4. Verifier review and clean payout.
5. Frozen disputed claim, appended evidence revision, and rejection/no-payout result.
6. Activity/audit trail with explorer links.
7. Passing contract/frontend tests and CI.
8. Production deployment, analytics dashboard, and monitoring dashboard with sensitive fields hidden.
9. Ten-wallet interaction register using role aliases and transaction links.

Record one live demo covering both the clean and disputed flows. The disputed demo must show that freeze retains the reservation, only a verifier resolves it, rejection returns funds to campaign availability, and no merchant payout occurs.

## 12. Phase 6 Entry Gate

Phase 6 may begin when:

- This specification and its architecture decisions are approved.
- Phase 5 checklist items in [`PROGRESS.md`](./PROGRESS.md) are complete.
- Contract tests are derived from Section 10 before implementation.
- Any deviation is recorded in this file and the progress audit log before code changes.
