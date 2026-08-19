# 🌌 Aethyr — JTM Master Plan

> *Verified typhoon-relief delivery, from donation to local payout.*

**Project**: Aethyr Aid — Verified Typhoon Relief Payments on Stellar

**Track**: Builder Track

**Program**: Stellar Journey to Mastery

**Approved Direction**: [`IDEA-SUBMISSION.md`](./IDEA-SUBMISSION.md)

**Level 4 Approval Target**: August 31, 2026

**Internal Submission Deadline**: August 28, 2026

**Implementation Rule**: Keep future capabilities labeled as planned until source code and evidence exist.

---

## 📊 Program Intelligence

### Key Rules

| Rule | Detail |
|------|--------|
| Reward model | Competitive — "selected winners" scored by technical committee |
| Highest belt only | Rewarded for the HIGHEST belt per month, not cumulative |
| Chain unbroken | Must pass every preceding level to be rewarded for higher ones |
| One project + track/month | Cannot do Builder + Startup Track simultaneously |
| Monthly evaluation | Progress reviewed at end of each month |
| No repeat rewards | Once rewarded for a level, must advance for future eligibility |
| Team = 1 prize | Prize per project, not per person |
| Earlier = reviewed first | Submit early to be reviewed before the rush |
| Mentor feedback | Recommended before scaling Levels 5–6; record it if program reviewers provide a checkpoint |

### Reward Table

| Belt | Level | Reward | Status |
|------|-------|--------|--------|
| ⚪ White | 1 | No stated reward | Complete |
| 🟡 Yellow | 2 | **$10** / selected winner | Complete |
| 🟠 Orange | 3 | **$50** / selected winner | Complete; submission status tracked in `PROGRESS.md` |
| 💡 Idea Submission | Gate | None | ✅ Approved |
| 🟢 Green | 4 | **$100** / selected winner | 🎯 Target: approval by Aug 31 |
| 🔵 Blue | 5 | **$150** / selected winner | Planned after Level 4 |
| ⚫ Black | 6 | **$200** / selected winner | Planned after Level 5 |
| 🏆 Master | 7 | See current program rules | Out of current scope |

> [!IMPORTANT]
> Level 4 is the current objective. Build only the approved voucher MVP, satisfy every Green Belt evidence requirement, and submit by August 28 to preserve a review buffer through August 31.

### 🏆 Insider Tips

1. **Judges rely heavily on README** — your README IS your pitch
2. **PWA / mobile-ready stands out** — installable on homescreen shows production thinking
3. **Strict belt compliance** — meet every checkbox first, add flair on top

---

## 🌌 Project: Aethyr

### Elevator Pitch

> Aethyr Aid is a milestone-gated typhoon-relief protocol on Stellar. Donations fund campaign escrows, approved local merchants redeem purpose-bound vouchers, and payouts occur only after evidence and verifier decisions are recorded, creating an attributable trail without forcing beneficiaries to manage wallets.

### 🌟 Product Strategy
Aethyr Aid focuses on three constraints that the approved proposal identifies:
1. **Last-mile accountability**: Trace a donation through campaign allocation, beneficiary case, voucher purpose, merchant redemption, evidence, verification, and payout or dispute.
2. **Verification before payout**: Merchant approval, evidence hashes, explicit state transitions, and dispute controls reduce the opportunity to hide duplicate, unsupported, or suspicious claims.
3. **Low-friction beneficiary experience**: NGOs, approved merchants, donors, and verifiers use wallets in the MVP; beneficiary households are represented by privacy-preserving case IDs rather than being required to operate crypto wallets.

### 📍 Initial Pilot Boundary
- **Geography**: Naga City and nearby Bicol communities.
- **Relief categories**: Food, medicine, shelter materials, and other purpose-bound voucher aid.
- **On-chain data**: Case identifiers, hashes, states, attestations, and payout records only.
- **Off-chain data**: Personal beneficiary information and raw evidence.
- **Deferred beyond Level 4**: Beneficiary app, SMS, QR/PIN redemption, GCash/Maya integration, full identity platform, and Mainnet deployment.

### Approved Green Belt Implementation Boundary

Phase 5 decisions are normative in [`LEVEL-4-IMPLEMENTATION-SPEC.md`](./LEVEL-4-IMPLEMENTATION-SPEC.md):

- One new `aethyr-aid` Soroban contract owns campaign custody and the voucher domain; the Level 3 Router/Escrow remain unchanged and outside the aid transaction path.
- Voucher issuance reserves pooled campaign funds. Rejection, cancellation, and expiration release the reservation; freeze retains it until verifier resolution.
- Admin and verifier roles are separate. Admins may emergency-freeze, but only verifiers may approve, reject, and authorize payout.
- Evidence uses an immutable digest plus a non-sensitive opaque ID. One append-only evidence revision is allowed while frozen; raw evidence and personal data remain access-controlled off-chain.
- The ten-user validation cohort is 3 donors, 2 NGO/admin operators, 2 merchants/cooperatives, and 3 independent verifiers.

### Feature Progression

| Feature | Belt | Description |
|---------|------|-------------|
| Wallet + Balance + Send | ⚪ White | Connect Freighter, show XLM balance, send transaction |
| Contract + Multi-wallet + Events | 🟡 Yellow | Payment routing contract, 3 error types, tx status |
| Full dApp + AI + Tests + CI/CD | 🟠 Orange | Production PWA, inter-contract calls, test suite, pipeline |
| Voucher MVP + 10 Users | 🟢 Green | Campaign escrow, merchant registry, beneficiary case IDs, voucher redemption, evidence hashes, verifier decisions, clean/disputed demos, production validation |
| Verification Scale + 50 Users | 🔵 Blue | Multi-party thresholds, donor trace page, pricing checks, Verified Delivery Receipt, feedback-driven iteration, pitch and demo |
| Pilot + Security + Mainnet | ⚫ Black | Security review, local pilot partner, regulated cash-out path, Mainnet launch only after workflow validation |

### Tech Stack

| Layer | Technology | Version |
|-------|-----------|--------|
| Frontend | React + Next.js (App Router) | 15+ |
| Styling | Tailwind CSS | v4 |
| PWA | `next-pwa` or `@serwist/next` | Latest |
| Contracts | Rust + Soroban | Rust 1.84+ |
| Wallet | `@stellar/freighter-api` | 6.0.1 |
| Multi-wallet | `@creit-tech/stellar-wallets-kit` | 2.2.0 |
| SDK | `@stellar/stellar-sdk` | 16.0.1 |
| CLI | `stellar-cli` | 27.0.0 |
| WASM | `wasm32v1-none` | rustup |
| AI Assist | Gemini API (free tier) | Optional |
| Deploy | Vercel | Latest |
| CI/CD | GitHub Actions | |
| Tests | Vitest + `cargo test` | |

---

## 🏷️ Task Ownership Matrix

| Label | Meaning | Examples |
|-------|---------|---------|
| **[AI]** | AI generates AND executes (auto-commit, auto-push) | Code generation, tests, README text, git commits, CI config |
| **[AI→YOU]** | AI prepares, you review/approve before it runs | Architecture decisions, commit messages |
| **[YOU]** | Strictly manual — only you can do this | Vercel deploy, screenshots, demo video, GIFs, env keys, belt submission, Freighter testing, Rise In form submission |

---

## 📅 Flexible Milestone Timeline

### Phase Overview

| Phase | Window | What Gets Done | Deliverable |
|-------|--------|----------------|-------------|
| **0: Setup** | 1-2 | Environment, tooling, crash course | Dev environment ready |
| **1: White Belt** | 1-2 | Wallet, balance, transaction, PWA shell | White Belt submitted |
| **2: Yellow Belt** | 2-3 | Smart contract, multi-wallet, events | Yellow Belt submitted |
| **3: Orange Belt** | 5-7 | Full dApp, tests, CI/CD, demo video | Orange Belt submitted |
| **4: Idea Gate** | Complete | Approved Aethyr Aid proposal | Levels 4–6 unlocked |
| **5: L4 Definition** | Aug 3–6 | Domain model, scope decisions, acceptance criteria, evidence plan | Implementation-ready specification |
| **6: L4 Contracts** | Aug 7–14 | Campaign, voucher, registry, evidence, verification, dispute logic and tests | Testnet contract release |
| **7: L4 Product Flow** | Aug 15–20 | Donor/admin, merchant, and verifier flows | Feature-complete MVP |
| **8: L4 Validation** | Aug 21–27 | Production deploy, monitoring, analytics, 10 users, feedback, demo | Technical/user/observability/final-demo evidence complete; submission pending |
| **9: L4 Submit** | Aug 28 | Final compliance audit and submission | Green Belt submitted |
| **Review Buffer** | Aug 29–31 | Respond to reviewer questions or corrections | Approval target |
| **10: L5 Growth** | Post-L4 | 50 Testnet users, feedback-led iteration, traceability features, pitch | Blue Belt candidate |
| **11: L6 Launch** | Post-L5 | Security review, pilot, Mainnet, 20 verified users, ecosystem contribution | Black Belt candidate |

### Scope Control

> [!WARNING]
> The August deadline does not support building every roadmap feature. Level 4 excludes multi-party thresholds, the Verified Delivery Receipt, anchor integrations, beneficiary wallets, SMS, QR/PIN redemption, and Mainnet. Those remain later-level work unless a Green Belt acceptance criterion requires otherwise.

---

## 📊 Pace Tracker

### How It Works

Track completion by evidence-bearing gates rather than hours coded:

1. Specification and acceptance criteria approved in [`LEVEL-4-IMPLEMENTATION-SPEC.md`](./LEVEL-4-IMPLEMENTATION-SPEC.md).
2. Contract tests demonstrate both clean and disputed delivery paths, including reservation accounting and no automatic payout.
3. Production UI completes each operational role's flow.
4. Monitoring, analytics, deployment, and documentation are verifiable.
5. Ten real users complete wallet interactions and provide basic feedback.
6. Submission package passes the Belt Checker audit.

### Milestone Checkpoints

| Date | Required State | If Behind |
|------|----------------|-----------|
| **Aug 6** | Specification and test plan approved | Freeze nonessential UX and reuse proven Level 3 components |
| **Aug 14** | Contracts tested and deployed to Testnet | Remove optional fields and preserve only the approved voucher lifecycle |
| **Aug 20** | End-to-end clean and disputed flows complete | Stop visual polish; prioritize correctness and evidence |
| **Aug 24** | Production deployment and demo ready | Begin user onboarding on the stable subset; log known limitations |
| **Aug 27** | 10-user and feedback evidence complete | Escalate missing evidence immediately; do not fabricate user proof |
| **Aug 28** | Submission sent | Use Aug 29–31 only for reviewer-requested corrections |

---

## 🔧 Vibe-Coding Rules

### Workflow Per Feature

```
1. [Claude Opus]     → Plan feature / architecture
2. [Gemini Flash 3.5]→ Generate code
3. [AI]              → Generate tests alongside code
4. [AI]              → Auto-commit + push (conventional commits)
5. [GitHub Actions]  → Auto-lint + test
6. [YOU]             → Test in browser + deploy to Vercel
7. [Belt Checker]    → Verify requirements (before submission)
```

### Commit Rules
- Conventional prefixes: `feat:`, `fix:`, `test:`, `ci:`, `docs:`, `chore:`
- No empty or trivial commits — every commit advances a belt requirement
- Minimum commits: White (3+), Yellow (2+), Orange (10+)

### Quality Gates (before each submission)
1. ✅ Belt compliance checklist — every box checked
2. ✅ All tests passing (`cargo test` + `npm test`)
3. ✅ CI/CD pipeline green
4. ✅ Live Vercel deployment accessible
5. ✅ README updated with latest screenshots + contract addresses
6. ✅ Mobile viewport tested
7. ✅ No secrets in repo

---

## ⚠️ Risk Register

| Risk | Impact | Prob. | Mitigation |
|------|--------|-------|------------|
| Voucher-domain redesign exceeds August window | Missed Level 4 deadline | HIGH | Freeze the approved Green Belt scope; defer all Blue/Black features |
| Ten real wallet users unavailable | Submission requirement fails | HIGH | Recruit the approved cohort early: 3 donors, 2 admins, 2 merchants, and 3 verifiers; do not depend on beneficiary wallets |
| Sensitive beneficiary or feedback data is exposed | Privacy and trust harm | HIGH | Keep personal data and raw evidence off-chain; publish only minimized or access-controlled evidence |
| Contract authorization or state transitions are unsafe | Invalid payouts or frozen funds | HIGH | Test-first implementation, explicit role checks, replay guards, and independent security review |
| Reviewer turnaround exceeds three days | Approval arrives after Aug 31 | MED | Submit by Aug 28 and communicate promptly through the official review channel |
| Existing remittance UI creates scope drag | Delayed MVP | MED | Reuse only stable wallet, relayer, escrow, testing, and deployment foundations |
