# 🏆 Aethyr — JTM Belt Requirements Reference (BELT-REQUIREMENTS.md)

This file contains working audit checklists for the **Stellar Journey to Mastery** challenges. Levels 4–6 are transcribed from [`LEVELS-4-7-REQUIREMENTS.md`](./LEVELS-4-7-REQUIREMENTS.md); the **Belt Checker** subagent reads this file before any submission.

---

## ⚪ White Belt Requirements (Level 1)

### Core Tasks
- [ ] Connect a wallet using the Freighter browser extension.
- [ ] Display the connected wallet’s XLM balance.
- [ ] Implement a wallet disconnect functionality.
- [ ] Send a transaction on the Stellar Testnet.
- [ ] Display transaction feedback to the user (success/failure status).
- [ ] Show the transaction hash or confirmation message upon completion.

### Codebase Requirements
- [ ] Public GitHub repository.
- [ ] A clean, comprehensive `README.md` at the root.

### Submission Assets (Required in README.md)
- [ ] Brief project description.
- [ ] Detailed setup instructions showing how to run the project locally.
- [ ] **Screenshot 1**: Wallet connected state showing public key/address.
- [ ] **Screenshot 2**: Connected wallet's XLM balance displayed in the UI.
- [ ] **Screenshot 3**: A successful transaction being executed on Stellar Testnet.
- [ ] **Screenshot 4**: Clear transaction result page/modal showing transaction hash.

---

## 🟡 Yellow Belt Requirements (Level 2)

### Core Tasks
- [ ] Implement error handling for at least **3 different transaction error types** (e.g., wallet not found, transaction rejected by user, insufficient balance, network timeout).
- [ ] Develop and deploy a simple Soroban smart contract to the Stellar Testnet.
- [ ] Call at least one function from the deployed contract from the frontend.
- [ ] Integrate a multi-wallet module using **StellarWalletsKit** or custom connectors (allowing user to select between Freighter, Albedo, xBull, etc.).
- [ ] Display contract transaction status on the frontend (pending, success, failure).

### Codebase Requirements
- [ ] Public GitHub repository.
- [ ] Clean and structured commit history with **at least 2+ meaningful commits**.

### Submission Assets (Required in README.md)
- [ ] Deployed smart contract address (verifiable on Stellar Explorer).
- [ ] Transaction hash of a successful contract invocation from the frontend.
- [ ] **Screenshot 1**: Multi-wallet modal showing at least two different wallet connection options.
- [ ] **Screenshot 2**: Transaction feedback showing contract call status (pending/success/fail).

---

## 🟠 Orange Belt Requirements (Level 3)

### Core Tasks
- [ ] Implement advanced smart contract development patterns:
  - [ ] **Inter-contract communication** (e.g., Aethyr Router calls Aethyr Escrow contract).
  - [ ] **Event streaming** (emitting events from smart contracts and parsing/listening to them on the frontend).
- [ ] Setup a functional **CI/CD pipeline** (GitHub Actions, GitLab CI, etc.) that runs lints, tests, and validates builds on pushes/PRs.
- [ ] Develop a fully mobile-responsive frontend (PWA format with notched viewports safe design).
- [ ] Complete error handling and state indicators (loading icons, skeleton UI, toast notifications).
- [ ] Write unit and integration tests:
  - [ ] Smart contract tests in Rust (`cargo test`).
  - [ ] Frontend tests (`vitest` or `jest`).
- [ ] Adhere to production-ready architecture practices.

### Codebase Requirements
- [ ] Public GitHub repository.
- [ ] Structured git history with **at least 10+ meaningful commits**.
- [ ] Live demo link deployed to Vercel/Netlify.
- [ ] Configured environment variables (no hardcoded secrets).

### Submission Assets (Required in README.md)
- [ ] Verified smart contract address on Testnet.
- [ ] Transaction hash of an advanced contract call (incorporating inter-contract communication).
- [ ] **Screenshot 1**: Mobile viewport verification showing responsive UI on a small screen layout.
- [ ] **Screenshot 2**: GitHub Actions CI/CD dashboard showing a green/passing pipeline.
- [ ] **Screenshot 3**: Test suite output in terminal showing **at least 3+ passing tests**.
- [ ] **Video Link**: A 1-2 minute video walk-through demonstrating the app's functionality (uploaded to YouTube or Loom).

---

## 💡 Idea Submission Requirements (Gate to Green Belt)

**Status:** Approved. The accepted direction is preserved in [`IDEA-SUBMISSION.md`](./IDEA-SUBMISSION.md).

### Approved Document Sections
- [x] **Problem Statement**: Last-mile accountability and delay in typhoon-relief delivery in Bicol, Philippines.
- [x] **Why Stellar?**: Low-cost payments, Soroban controls, and a future path to regulated cash-in/cash-out rails.
- [x] **Target Users**: Donors, NGOs, barangay/community verifiers, volunteers, cooperatives, approved merchants, and beneficiary households.
- [x] **Technical Architecture**: Campaign escrow, beneficiary case IDs, vouchers, merchant redemption, evidence hashes, verifier decisions, payouts, and disputes.
- [x] **Complexity Evaluation**: Verification quality, merchant controls, privacy boundaries, and dispute handling.
- [x] **Product Roadmap**: Green Belt voucher MVP, Blue Belt verification and traceability, and Black Belt security/pilot/Mainnet readiness.

---

## 🟢 Green Belt Requirements (Level 4)

> **Audit status (2026-08-22):** The technical MVP, 10+ user/feedback gates, observability evidence, and current desktop/mobile product screenshots are complete. The complete form export and reviewer-friendly summary are included in the repository at [`docs/GREEN-BELT-USER-TEST-RAW.csv`](./GREEN-BELT-USER-TEST-RAW.csv) and [`docs/GREEN-BELT-FEEDBACK-SUMMARY.md`](./GREEN-BELT-FEEDBACK-SUMMARY.md). Only the final live demo remains as an operator artifact; RiseIn reviewers evaluate the four quality characteristics from the README and demo after submission. Do not treat local demo activity as wallet or Testnet evidence.

### Production MVP
- [x] Fully functional production-ready MVP (technical scope) — feature-complete Aid workspace with clean and disputed lifecycle paths; see [`docs/LEVEL-4-IMPLEMENTATION-SPEC.md`](./LEVEL-4-IMPLEMENTATION-SPEC.md).
- [x] Stable frontend and smart-contract architecture — [`src/components/workflows/aid/`](../src/components/workflows/aid/) and [`contracts/aethyr-router/contracts/aethyr-aid/`](../contracts/aethyr-router/contracts/aethyr-aid/).
- [x] Mobile-responsive UI — responsive Playwright coverage in [`scripts/ui.spec.ts`](../scripts/ui.spec.ts) and Aid visual baselines in [`scripts/aid-visual.spec.ts`](../scripts/aid-visual.spec.ts).
- [x] Proper loading states and error handling — pending, success, recoverable error, wallet, and contract authorization states are covered by the Aid workspace and wallet hook.

### User Onboarding
- [x] At least **10 real users** onboarded — 15 distinct wallet addresses are present in [`docs/GREEN-BELT-USER-TEST-RAW.csv`](./GREEN-BELT-USER-TEST-RAW.csv).
- [x] Proof of wallet interactions — 12 respondents reported signing live Testnet transactions and 11 valid transaction hashes are included in the complete export.
- [x] Basic user-feedback collection — all 15 response rows and raw comments are preserved in [`docs/GREEN-BELT-FEEDBACK-SUMMARY.md`](./GREEN-BELT-FEEDBACK-SUMMARY.md), with aggregate ratings and themes summarized.

### Product Quality and Technical Standards
- [x] Production deployment — [Aethyr Aid on Vercel](https://aethyr-pica.vercel.app/).
- [x] Monitoring and analytics integration — privacy-constrained PostHog/Sentry instrumentation in [`src/lib/observability.ts`](../src/lib/observability.ts); dashboard screenshots remain operator evidence.
- [x] Optimized user experience — role-guided onboarding, deterministic local walkthroughs, accessible focus states, reduced-motion support, and route persistence.
- [x] Proper project structure and documentation — [`README.md`](../README.md), [`docs/DEPLOYMENT.md`](./DEPLOYMENT.md), and [`docs/TESTNET-USER-WALKTHROUGH.md`](./TESTNET-USER-WALKTHROUGH.md).
- [x] Smart contracts deployed on Stellar Testnet — hardened Aid contract and validation records in [`docs/DEPLOYMENT.md`](./DEPLOYMENT.md).
- [x] At least **15 meaningful commits** — 190 commits on the current public repository.
- [x] Public GitHub repository — [`github.com/pablo-pica/aethyr`](https://github.com/pablo-pica/aethyr).

### Demo and Submission Evidence
- [ ] Live demo video showing complete functionality (**operator evidence**; follow [`docs/GREEN-BELT-VIDEO-SCRIPT.md`](./GREEN-BELT-VIDEO-SCRIPT.md)).
- [ ] Team review covers technical complexity, product quality, architecture quality, and real-world usefulness (**external RiseIn reviewer evaluation; README and demo coverage is prepared**).
- [x] README with complete technical documentation — [`README.md`](../README.md).
- [x] Live application link and contract deployment addresses — [`README.md`](../README.md#-live-demo--presentation) and [`docs/DEPLOYMENT.md`](./DEPLOYMENT.md).
- [x] Screenshots of the product UI, mobile layout, and analytics or monitoring setup — current [desktop Aid workspace](../docs/assets/green-belt-aid-desktop.png), [mobile Aid workspace](../docs/assets/green-belt-aid-mobile.png), [PostHog events](../docs/assets/posthog-events.png), and [Sentry redacted error](../docs/assets/sentry-redacted-error.png).
- [x] Proof of 10+ user wallet interactions — complete CSV export: [`docs/GREEN-BELT-USER-TEST-RAW.csv`](./GREEN-BELT-USER-TEST-RAW.csv).
- [x] Basic user-feedback summary — [`docs/GREEN-BELT-FEEDBACK-SUMMARY.md`](./GREEN-BELT-FEEDBACK-SUMMARY.md).

---

## 🔵 Blue Belt Requirements (Level 5)

### Growth and Product Iteration
- [ ] At least **50 Testnet users** onboarded.
- [ ] Real transaction activity and active-usage proof.
- [ ] Features added from user feedback.
- [ ] UX/UI, stability, and onboarding improved.

### Presentation and Technical Standards
- [ ] Professional pitch deck covering the problem, solution, market, architecture, growth strategy, and roadmap.
- [ ] Full product walkthrough showing real user flows and use cases.
- [ ] At least **20 meaningful commits**.
- [ ] Updated documentation.

### User Evidence and Submission
- [ ] Collect wallet address, email, name, and product feedback using the program-required form.
- [ ] Export responses to a spreadsheet and link it from the README using privacy-appropriate access controls.
- [ ] Explain feedback-driven improvements in the README and link the corresponding commits.
- [ ] Provide the public repository, live app, pitch deck, demo, proof of 50+ users, analytics or transaction screenshots, and iteration summary.

---

## ⚫ Black Belt Requirements (Level 6)

### Mainnet, Adoption, and Security
- [ ] Smart contracts deployed on Stellar Mainnet.
- [ ] Public production application live.
- [ ] At least **20 verified Mainnet users** with real on-chain transaction activity.
- [ ] Smart-contract audit or mentor/team-approved security review.

### Launch and Ecosystem Contribution
- [ ] Twitter/X launch post or thread and demo/showcase content.
- [ ] Complete a technical blog, workshop, tutorial, open-source contribution, or community session.
- [ ] At least **30 meaningful commits**.
- [ ] Full technical, production, and user documentation.

### User Evidence and Advanced Feature
- [ ] Collect and export the program-required user details and feedback, link the sheet from the README, and document feedback-driven improvements with commit links.
- [ ] Implement at least one qualifying advanced feature: fee sponsorship, SEP-24/SEP-31 cross-border flow, multi-signature logic, or account abstraction.
- [ ] Provide Mainnet addresses, user and transaction proof, security-review proof, launch/demo links, and the ecosystem-contribution link.
