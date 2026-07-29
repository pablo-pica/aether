# Aethyr Hero Banner
<p align="center">
  <img src="docs/assets/banner.png" alt="Aethyr Banner" width="100%" />
</p>

<h1 align="center">🌌 Aethyr</h1>
<p align="center">
  <strong>Aethyr Aid — Verified Typhoon Relief Payments on Stellar</strong>
</p>

<p align="center">
  <a href="https://github.com/pablo-pica/aethyr/actions"><img src="https://github.com/pablo-pica/aethyr/actions/workflows/ci.yml/badge.svg" alt="Build Status"></a>
  <img src="https://img.shields.io/badge/Stellar-Testnet-blue?style=flat-square&logo=stellar" alt="Network">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=nextdotjs" alt="Next.js">
  <img src="https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss" alt="Styling">
  <img src="https://img.shields.io/badge/Rust%20Tests-18%2F18%20Passed-green?style=flat-square&logo=rust" alt="Rust Tests">
  <img src="https://img.shields.io/badge/Vitest-59%2F59%20Passed-green?style=flat-square&logo=vitest" alt="Vitest Tests">
</p>

---

## 💡 Approved Product Direction

Aethyr Aid addresses the last-mile accountability gap in typhoon relief. The Level 4 MVP will let donors fund campaign escrows, NGO/admin operators issue purpose-bound vouchers to beneficiary case IDs, approved local merchants submit delivery evidence, admins emergency-freeze disputed claims, and independent verifiers approve or reject payouts and resolve frozen claims. Beneficiaries will not need crypto wallets; sensitive personal data and raw evidence will remain off-chain.

The approved scope is documented in [`docs/IDEA-SUBMISSION.md`](./docs/IDEA-SUBMISSION.md), and the implementation-ready domain model and acceptance scenarios are defined in [`docs/LEVEL-4-IMPLEMENTATION-SPEC.md`](./docs/LEVEL-4-IMPLEMENTATION-SPEC.md). Delivery gates and the August target are tracked in [`docs/PROGRESS.md`](./docs/PROGRESS.md).

> **Status:** The disaster-relief workflow is planned, not yet implemented. The repository currently contains the completed Level 3 wallet, routing, escrow, relayer, testing, and deployment foundation described below. The internal Level 4 submission deadline is **August 28, 2026**, with approval targeted by **August 31, 2026**.

### Green Belt MVP Scope

- Campaign escrow and donation allocation.
- Approved merchant/cooperative registry.
- Beneficiary case IDs without on-chain personal data.
- Purpose-bound voucher issuance and merchant redemption.
- Evidence digest plus opaque-ID submission, admin emergency freeze, and verifier-only approval, rejection, and frozen-claim resolution.
- One end-to-end clean delivery and one disputed delivery in the demo.
- Production deployment, monitoring/analytics, 10 real operational wallet users, and basic feedback evidence.

---

## 🏆 Implemented Level 3 Foundation

### Smart Contract System (Soroban / Rust)
* 🔐 **Aethyr Aid Contract** — Purpose-bound aid delivery, merchant registry, opaque beneficiary cases, vouchers, evidence digests, admin emergency freeze, and verifier resolution.
  * **Address**: [`CDERJSFS75XYBXJOZYOJA62T4GFHSJZAM34D4OAXNSPOFSAUPWEQ3BST`](https://stellar.expert/explorer/testnet/contract/CDERJSFS75XYBXJOZYOJA62T4GFHSJZAM34D4OAXNSPOFSAUPWEQ3BST)
  * **Deployment Tx**: [`0b48000a46b3a6...`](https://stellar.expert/explorer/testnet/tx/0b48000a46b3a63465f7eaaecd49915bd13aa095d6981f59e2107a875ba93593)
  * **Initialization Tx**: [`831184035d160a...`](https://stellar.expert/explorer/testnet/tx/831184035d160a9cf88a1532c59fa28a4ca661890d254b159efa65db7b811828)
* 🔐 **Aethyr Router Contract** — Multi-hop DEX routing with atomic swaps and direct escrow funding.
  * **Address**: [`CA5ZEROS4VGIOZ2MIDVV7C7W4DFKWE76P4KBG455KO26RPKD2W3TC6MM`](https://stellar.expert/explorer/testnet/contract/CA5ZEROS4VGIOZ2MIDVV7C7W4DFKWE76P4KBG455KO26RPKD2W3TC6MM)
  * **Deployment Tx**: [`8ffea29ec2c445...`](https://stellar.expert/explorer/testnet/tx/8ffea29ec2c44577cfbc00a4c34b251a5e20a72c063a1ebf28dc0512cb78c01d)
* 🔐 **Aethyr Escrow Contract** — Milestone escrow contract invoked by Router.
  * **Address**: [`CD734V7PATOR7NW7APYQLUNEON2GZ7EUBM27MFQO3WDQZGCPKIWB6NOT`](https://stellar.expert/explorer/testnet/contract/CD734V7PATOR7NW7APYQLUNEON2GZ7EUBM27MFQO3WDQZGCPKIWB6NOT)
  * **Deployment Tx**: [`0362bad15f575c...`](https://stellar.expert/explorer/testnet/tx/0362bad15f575ce70d9ce291dd937ef39f2c7da2aaaaa07928bbf7ef8a8cd961)
* 🔐 **Aethyr Escrow Contract Features**:
  * **Milestone submission** by freelancers with on-chain timestamp tracking.
  * **Client dispute** flags that block auto-release.
  * **7-day auto-release** timer for uncontested submitted milestones.
  * **30-day refund lock** to protect against dispute-bypassing refund attacks.
  * **Dust-truncation protection**: Final milestone payouts use the remaining locked balance instead of basis-point division to prevent token dust loss.
  * **18 passing Rust contract tests** covering happy paths, edge cases, aid delivery, and panic guards.

### Gasless Fee Sponsorship Relayer
* ⛽ **`/api/sponsor` Endpoint** — Server-side fee-bump transaction relayer that pays Soroban gas fees on behalf of users:
  * **Contract destination whitelisting**: Only `invokeHostFunction` calls targeting approved Aethyr contracts are sponsored (prevents fee-siphoning attacks).
  * **IP-based rate limiting**: 30 requests/minute per IP with `Retry-After` headers.
  * **Automatic client fallback**: If the relayer is unconfigured or fails, the frontend transparently falls back to user-paid fees.

### Frontend (Next.js 16 / TypeScript / Tailwind v4)
* 🦊 **Multi-Wallet Support**: StellarWalletsKit integration supporting Freighter, Albedo, and xBull via a unified modal selector.
* 🤖 **AI Intent Parser**: Gemini-powered natural language bar that converts human commands (e.g., *"Pay 100 XLM to GA... for Milestone 1"*) into structured transaction payloads.
* 📱 **PWA-Ready Layout**: Full-bleed mobile UI with safe-area notch handling, glassmorphic drawers, and a desktop phone-shell mockup.
* 🏗️ **Visual Milestone Builder**: Drag-and-edit milestone card editor for composing AI-drafted escrow milestones before on-chain submission.
* 🧪 **59 passing Vitest tests** covering AI parsing, page integration, component rendering, and API route logic.
* 🔒 **Pre-commit security hooks** scanning for Stellar private key leaks and running full test suites before every commit.

---

## 🎬 Live Demo & Presentation

* 🌐 **Live Application**: [Aethyr on Vercel](https://aethyr-pica.vercel.app/)
* 🎥 **Video Walkthrough**: [Aethyr Walkthrough Video (YouTube)](https://www.youtube.com/watch?v=F_bBEHbHh0A) | [Local Walkthrough Video (MP4)](./docs/assets/video_demo.mp4)

---

## 🏗️ Current Level 3 System Architecture

The currently implemented application connects users, the optional AI parser, and the existing Stellar contracts. The planned voucher architecture is documented separately in [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).

```mermaid
graph TD
    User([User]) -->|Inputs Command / Form| UI[PWA Frontend]
    UI -->|Queries DEX Liquidity| Pathfinder[Pathfinder Engine]
    UI -->|Optional: Text Command| AI[Gemini Intent Parser]
    AI -->|Structured Params| UI
    Pathfinder -->|Best Route resolved| UI
    UI -->|Signs Tx| Wallet[StellarWalletsKit / Freighter]
    Wallet -->|Submits Signed XDR| Relayer["/api/sponsor Gasless Relayer"]
    Relayer -->|Fee-Bump + Submit| RPC[Soroban Testnet RPC]
    Relayer -.->|Fallback: Direct Submit| RPC
    RPC -->|Executes| RouterContract[Aethyr Router Contract]
    RouterContract -->|Inter-Contract Call| EscrowContract[Aethyr Escrow Contract]
    RouterContract -->|Executes Swaps| DEX[Stellar DEX Pools]
    EscrowContract -->|Milestone Payout| Receiver([Recipient])
```

The client queries Horizon endpoints to identify active market makers while the Soroban smart contracts execute atomic, multi-hop swaps directly on-chain. The gasless relayer sponsors transaction fees so end-users pay zero gas costs.

---

## 📂 Code Navigation

Below is a map of the repository's directory layout to assist in codebase evaluation:

```text
aethyr/
├── .agents/                 # Developer agents instruction and status trackers
├── .github/workflows/       # CI/CD pipeline configuration
│   └── ci.yml               # GitHub Actions: lint, test (Rust + Vitest), build
├── contracts/               # Soroban smart contracts (Rust)
│   └── aethyr-router/
│       ├── contracts/
│       │   ├── aethyr-escrow/   # Milestone escrow: create, release, dispute, auto-release, refund
│       │   │   ├── src/lib.rs   # Core escrow contract logic
│       │   │   └── src/test.rs  # 7 comprehensive Rust tests
│       │   └── aethyr-router/   # DEX routing: swap, fallback, route-to-escrow
│       │       ├── src/lib.rs   # Core router contract logic
│       │       └── src/test.rs  # 4 comprehensive Rust tests
│       └── Cargo.toml           # Workspace manifest
├── docs/                    # Design documentation, architecture files, and submission assets
│   ├── assets/              # Interface screenshots and project banners
│   ├── IDEA-SUBMISSION.md   # Approved Aethyr Aid product direction
│   ├── ARCHITECTURE.md      # Implemented foundation + specified voucher architecture
│   ├── LEVEL-4-IMPLEMENTATION-SPEC.md # Domain model, invariants, tests, evidence plan
│   ├── BELT-REQUIREMENTS.md # JTM belt submission checklists through Level 6
│   ├── PROGRESS.md          # Living progress tracker and August Level 4 gates
│   └── MASTERPLAN.md        # Product strategy, scope, and belt roadmap
├── scripts/
│   └── pre-commit.sh        # Git compliance hook (secret scanning + test runner)
├── src/
│   ├── app/                 # Next.js App Router pages and layouts
│   │   ├── api/sponsor/     # Gasless relayer API route
│   │   │   ├── route.ts     # Fee-bump builder with contract whitelisting + rate limiting
│   │   │   └── route.test.ts# Relayer unit tests
│   │   ├── page.tsx         # Main entry point (interactive mobile mockup container)
│   │   ├── page.test.tsx    # Page component integration tests
│   │   └── layout.tsx       # Global wrappers and metadata setup
│   ├── components/          # Reusable React components
│   │   ├── ui/              # BottomSheet, CustomNumberInput, SegmentedControl, ConfirmationDialog, Toast, InfoTooltip
│   │   ├── BottomNav.tsx    # Mobile-friendly PWA bottom tab navigation
│   │   ├── MilestoneBuilder.tsx # Visual milestone card editor
│   │   ├── ProfileDrawer.tsx# Wallet balance overview and account control bottom sheet
│   │   ├── WalletPickerBottomSheet.tsx # Custom dark wallet picker
│   │   ├── SendTab.tsx      # Main Send / Swap view component
│   │   ├── EscrowTab.tsx    # Escrow Creation form and milestones tracker view
│   │   ├── ActivityTab.tsx  # Interactive transaction log view
│   │   ├── SettingsTab.tsx  # Configurable network and slippage preset controls
│   │   └── WalletConnect.tsx# Interactive wallet status controller
│   ├── hooks/
│   │   ├── useFreighter.ts  # Legacy Freighter-only hook
│   │   └── useStellarWallet.ts # Full-featured hook: StellarWalletsKit, contract calls, gasless submit
│   ├── lib/
│   │   ├── aiParser.ts      # Gemini AI intent parser (natural language → tx params)
│   │   ├── aiParser.test.ts # Parser unit tests (6 cases)
│   │   ├── utils.ts         # Tailwind CSS styling and address helper functions
│   │   └── utils.test.ts    # Utility unit tests
│   └── styles/
│       └── globals.css      # Core Tailwind styling & safe-area notch utility configuration
├── package.json             # Package scripts and external dependencies
├── tsconfig.json            # TypeScript configuration
└── vitest.config.ts         # Vitest setup configuration file
```

### Key Implementation Files
* [page.tsx](./src/app/page.tsx): Primary container UI with tabs, forms, activity ledger, and milestone actions.
* [lib.rs (Escrow)](./contracts/aethyr-router/contracts/aethyr-escrow/src/lib.rs): Milestone escrow logic — create, release, submit, dispute, auto-release, refund.
* [lib.rs (Router)](./contracts/aethyr-router/contracts/aethyr-router/src/lib.rs): Payment routing contract — DEX swaps and escrow funding.
* [useStellarWallet.ts](./src/hooks/useStellarWallet.ts): Full-featured wallet hook — multi-wallet, contract calls, gasless relayer integration with exponential backoff.
* [route.ts (Sponsor)](./src/app/api/sponsor/route.ts): Gasless relayer with contract whitelisting and rate limiting.
* [aiParser.ts](./src/lib/aiParser.ts): Gemini AI intent parser converting natural language to structured payloads.
* [MilestoneBuilder.tsx](./src/components/MilestoneBuilder.tsx): Visual milestone card editor.
* [pre-commit.sh](./scripts/pre-commit.sh): Git compliance hook — secret scanning and full test runner.

---

## 🔒 Security Model

| Threat | Mitigation |
|:-------|:-----------|
| **Fee-siphoning** via arbitrary contract calls | Relayer parses XDR operations and only sponsors `invokeHostFunction` calls targeting approved Aethyr contracts |
| **Rate-drain attacks** on sponsor wallet | IP-based rate limiter (30 req/min) with `429 Retry-After` responses |
| **Dispute-bypass refund** | Refund lock extended to 30 days (`LOCK_PERIOD_SECONDS`) so disputes cannot be front-run |
| **Dust token loss** on final milestone | Final milestone pays out full remaining balance instead of basis-point calculation |
| **Private key leaks** | Pre-commit hook scans diffs for Stellar seed patterns; `SPONSOR_SECRET_KEY` is never committed |
| **Unconfigured relayer in production** | Fail-fast `503` if `SPONSOR_SECRET_KEY` is absent; random fallback key only in `test` env |

---

## 🏅 Belt Submission Evidence

Each belt section below maps **1:1** against the [Belt Requirements](./docs/BELT-REQUIREMENTS.md) checklist. Every requirement links directly to its proof — source file, Stellar Explorer transaction, or screenshot.

---

### ⚪ White Belt — Foundational PWA Container

<details>
<summary><strong>✅ All Requirements Met — Click to expand</strong></summary>

#### Core Tasks

| # | Requirement | Status | Evidence |
|:-:|:-----------|:------:|:---------|
| 1 | Connect a wallet via Freighter | ✅ | [`useFreighter.ts`](./src/hooks/useFreighter.ts) — `connect()` calls `requestAccess()` |
| 2 | Display connected wallet XLM balance | ✅ | [`useStellarWallet.ts`](./src/hooks/useStellarWallet.ts) — `fetchBalance()` queries Horizon |
| 3 | Wallet disconnect functionality | ✅ | [`useStellarWallet.ts`](./src/hooks/useStellarWallet.ts) — `disconnect()` resets state |
| 4 | Send a transaction on Stellar Testnet | ✅ | [`useStellarWallet.ts`](./src/hooks/useStellarWallet.ts) — `sendPayment()` builds and submits native XLM transfers |
| 5 | Display transaction feedback (success/failure) | ✅ | [`page.tsx`](./src/app/page.tsx) — toast notifications on tx result |
| 6 | Show transaction hash on completion | ✅ | [`page.tsx`](./src/app/page.tsx) — Activity ledger displays tx hash with explorer link |

#### Submission Assets

| Asset | Screenshot |
|:------|:----------:|
| **Wallet connected** — profile drawer displaying connected address and balances | <img src="docs/assets/screen1.png" width="220" alt="Wallet Connected"> |
| **XLM balance** — main balance card fetching live Stellar Testnet balance | <img src="docs/assets/screen2.png" width="220" alt="XLM Balance"> |
| **Transaction executing** — broadcasting status screen while signing in Freighter | <img src="docs/assets/screen3.png" width="220" alt="Transaction Executing"> |
| **Transaction result** — success screen showing confirmed transaction hash and explorer link | <img src="docs/assets/screen4.png" width="220" alt="Transaction Hash Result"> |

</details>

---

### 🟡 Yellow Belt — Soroban Smart Contracts

<details>
<summary><strong>✅ All Requirements Met — Click to expand</strong></summary>

#### Core Tasks

| # | Requirement | Status | Evidence |
|:-:|:-----------|:------:|:---------|
| 1 | Error handling for 3+ transaction error types | ✅ | [`useStellarWallet.ts`](./src/hooks/useStellarWallet.ts) — handles: **Wallet not found**, **User rejected**, **Insufficient balance** |
| 2 | Deploy a Soroban smart contract to Testnet | ✅ | Router contract: [`CA5ZERO...6MM`](https://stellar.expert/explorer/testnet/contract/CA5ZEROS4VGIOZ2MIDVV7C7W4DFKWE76P4KBG455KO26RPKD2W3TC6MM) |
| 3 | Call a contract function from the frontend | ✅ | [`useStellarWallet.ts`](./src/hooks/useStellarWallet.ts) — `routeToEscrow()`, `releaseMilestone()`, etc. invoke Soroban |
| 4 | Multi-wallet integration (StellarWalletsKit) | ✅ | [`useStellarWallet.ts`](./src/hooks/useStellarWallet.ts) — initializes `StellarWalletsKit` with `defaultModules()` (Freighter, Albedo, xBull) |
| 5 | Display contract tx status (pending/success/fail) | ✅ | [`page.tsx`](./src/app/page.tsx) — status badges + toast notifications for all contract operations |

#### On-Chain Proof

| Artifact | Value |
|:---------|:------|
| **Deployed Contract Address** | [`CA5ZEROS4VGIOZ2MIDVV7C7W4DFKWE76P4KBG455KO26RPKD2W3TC6MM`](https://stellar.expert/explorer/testnet/contract/CA5ZEROS4VGIOZ2MIDVV7C7W4DFKWE76P4KBG455KO26RPKD2W3TC6MM) |
| **Deployment Tx Hash** | [`8ffea29ec2c445...`](https://stellar.expert/explorer/testnet/tx/8ffea29ec2c44577cfbc00a4c34b251a5e20a72c063a1ebf28dc0512cb78c01d) |
| **Frontend Invocation Tx Hash** | [`cf417f87e58e3a...`](https://stellar.expert/explorer/testnet/tx/cf417f87e58e3a4cc53d4ee572115474afea0568609fbde6e49df2d8c5d14623) |
| **Commit Count** | 65+ conventional commits ([`git log`](https://github.com/pablo-pica/aethyr/commits/dev-branch)) |

#### Submission Assets

| Asset | Screenshot |
|:------|:----------:|
| **Multi-wallet modal** — Freighter, Albedo, xBull selection drawer | <img src="docs/assets/screen5.png" width="240" alt="Multi-wallet Modal"> |
| **DEX pathfinding route** — real-time path routing visualization (XLM ➔ USDC ➔ PHP) and fee analysis | <img src="docs/assets/screen6.png" width="240" alt="DEX Pathfinder Route"> |

</details>

---

### 🟠 Orange Belt — Advanced Contracts, CI/CD & Production Architecture

<details open>
<summary><strong>✅ All Requirements Met — Click to expand</strong></summary>

#### Core Tasks

| # | Requirement | Status | Evidence |
|:-:|:-----------|:------:|:---------|
| 1a | **Inter-contract communication** | ✅ | Router calls Escrow via `route_to_escrow()` → [`lib.rs (Router)`](./contracts/aethyr-router/contracts/aethyr-router/src/lib.rs) invokes [`lib.rs (Escrow)`](./contracts/aethyr-router/contracts/aethyr-escrow/src/lib.rs) |
| 1b | **Event streaming** from contracts | ✅ | Both contracts emit events via `env.events().publish(...)` — see [`lib.rs (Escrow) L179, L262, L306, L347, L388, L462`](./contracts/aethyr-router/contracts/aethyr-escrow/src/lib.rs) |
| 2 | **CI/CD pipeline** (lint + test + build) | ✅ | GitHub Actions: [`.github/workflows/ci.yml`](./.github/workflows/ci.yml) — runs `npm run lint`, `npm run test`, `npm run build`, and `cargo test` on every push/PR |
| 3 | **Mobile-responsive PWA** with safe-area notch | ✅ | [`globals.css`](./src/styles/globals.css) — `env(safe-area-inset-*)` + [`page.tsx`](./src/app/page.tsx) — max-width 420px phone shell |
| 4 | **Error handling & state indicators** | ✅ | Loading spinners, skeleton UI, toast notifications throughout [`page.tsx`](./src/app/page.tsx) and [`WalletConnect.tsx`](./src/components/WalletConnect.tsx) |
| 5a | **Smart contract tests** (Rust) | ✅ | **11 tests passing**: 7 in [`test.rs (Escrow)`](./contracts/aethyr-router/contracts/aethyr-escrow/src/test.rs) + 4 in [`test.rs (Router)`](./contracts/aethyr-router/contracts/aethyr-router/src/test.rs) |
| 5b | **Frontend tests** (Vitest) | ✅ | **59 tests passing** across 17 files |
| 6 | **Production-ready architecture** | ✅ | Gasless relayer with contract whitelisting, rate limiting, 30-day refund lock, dust-truncation fix — see [Security Model](#-security-model) |

#### Codebase Requirements

| Requirement | Status | Evidence |
|:-----------|:------:|:---------|
| Public GitHub repository | ✅ | [github.com/pablo-pica/aethyr](https://github.com/pablo-pica/aethyr) |
| 10+ meaningful commits | ✅ | **65+ conventional commits** — `feat:`, `fix:`, `test:`, `docs:`, `ci:` |
| Live demo on Vercel/Netlify | ✅ | [aethyr-pica.vercel.app](https://aethyr-pica.vercel.app/) |
| No hardcoded secrets | ✅ | All secrets via `.env.local` + [pre-commit hook](./scripts/pre-commit.sh) scanning for Stellar seeds |

#### On-Chain Proof

| Artifact | Value |
|:---------|:------|
| **Verified Escrow Contract** | [`CD734V7PATOR7NW7APYQLUNEON2GZ7EUBM27MFQO3WDQZGCPKIWB6NOT`](https://stellar.expert/explorer/testnet/contract/CD734V7PATOR7NW7APYQLUNEON2GZ7EUBM27MFQO3WDQZGCPKIWB6NOT) |
| **Inter-Contract Call Tx Hash** | [`cf417f87e58e3a4cc53d4ee572115474afea0568609fbde6e49df2d8c5d14623`](https://stellar.expert/explorer/testnet/tx/cf417f87e58e3a4cc53d4ee572115474afea0568609fbde6e49df2d8c5d14623) |

#### Submission Assets

| Asset | Screenshot |
|:------|:----------:|
| **Milestone Activity timeline** — tracking status of released/pending milestones with transaction hashes | <img src="docs/assets/screen7.png" width="220" alt="Milestones Activity Timeline"> |
| **GitHub Actions CI/CD** — green/passing build and test runs dashboard | <img src="docs/assets/screen8.png" width="220" alt="GitHub Actions CI/CD"> |
| **Test suite output** — 11 Rust contract tests and 59 Vitest frontend tests passing in terminal | <img src="docs/assets/screen9.png" width="220" alt="Test Suite Output"> |
| **Video walkthrough** | [Aethyr Walkthrough Video (YouTube)](https://www.youtube.com/watch?v=F_bBEHbHh0A) or [Local Walkthrough Video (MP4)](./docs/assets/video_demo.mp4) |

</details>

---

### 🖼️ Visual Showcase — App Interface & Roles

<details>
<summary><strong>📱 Click to view additional screenshots</strong></summary>

| View | Screenshot |
|:-----|:----------:|
| **Create Escrow** — client configuration form | <img src="docs/assets/createescrow.png" width="220" alt="Create Escrow"> |
| **Milestone Builder** — visual milestone designer sheet | <img src="docs/assets/configuremilestones.png" width="220" alt="Milestone Builder"> |
| **Active Escrows** — freelancer task tracking view | <img src="docs/assets/activeescrows.png" width="220" alt="Active Escrows"> |
| **Settings Tab** — slippage control, network toggles, AI configs | <img src="docs/assets/settingstab.png" width="220" alt="Settings Tab"> |

</details>

---

## 🛠️ Step-by-Step Quickstart

Follow these instructions to run Aethyr locally on your development machine.

### 1. Prerequisites
Ensure you have the following installed:
* **Node.js**: v20 or later
* **npm**: v10 or later
* **Rust / Cargo**: For compiling Soroban contracts
* **Stellar CLI** (Optional, for contract invokes): `cargo install --locked stellar-cli`

### 2. Project Installation
```bash
# Clone the repository
git clone https://github.com/pablo-pica/aethyr.git
cd aethyr

# Install project dependencies
npm install
```

### 3. Environment Configuration
Duplicate the example environment file:
```bash
cp .env.example .env.local
```

Open [env.local](./.env.local) and customize its parameters:
* `NEXT_PUBLIC_STELLAR_NETWORK`: Configures the target chain network. Set to `TESTNET` for public testing.
* `NEXT_PUBLIC_STELLAR_RPC_URL`: The RPC endpoint used for Horizon queries (e.g., `https://soroban-testnet.stellar.org:443`).
* `NEXT_PUBLIC_ROUTER_CONTRACT_ID`: The deployed Soroban router contract address (`CB...`).
* `NEXT_PUBLIC_ESCROW_CONTRACT_ID`: The deployed Soroban escrow contract address (`CC...`).
* `NEXT_PUBLIC_GEMINI_API_KEY`: The API key utilized to authenticate with the Gemini API for plain text intent parsing.
* `SPONSOR_SECRET_KEY`: *(Optional)* Secret key of the fee-sponsoring account. If unset, the gasless relayer is disabled and users pay their own fees.

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) inside your web browser to test.

### 5. Running Verification Suites
Verify code health by running the verification commands:
```bash
# Run frontend unit and integration tests (Vitest)
npm test

# Run smart contract tests (Rust)
cd contracts/aethyr-router && cargo test

# Run code style and structure lints (Next.js ESLint)
npm run lint
```

---

## 🗺️ Product Roadmap

| Gate | Target | Outcome | Status |
|:-----|:-------|:--------|:------:|
| ⚪–🟠 Levels 1–3 | July 2026 | Wallet, contracts, PWA, tests, CI/CD, relayer, and demo foundation | ✅ Complete |
| 💡 Idea gate | July 2026 | Aethyr Aid direction approved | ✅ Complete |
| 🟢 Level 4 definition | Aug 3–6 | Domain model, implementation specification, acceptance criteria, and evidence plan | ✅ Complete |
| 🟢 Level 4 contracts | Aug 7–14 | Tested campaign, voucher, registry, evidence, verification, and dispute logic on Testnet | 📋 Planned |
| 🟢 Level 4 product | Aug 15–20 | Complete donor/admin, merchant, and verifier workflows | 📋 Planned |
| 🟢 Level 4 validation | Aug 21–27 | Production deployment, monitoring/analytics, 10-user proof, feedback, and demo | 📋 Planned |
| 🟢 Level 4 submission | Aug 28 | Green Belt package submitted with Aug 29–31 review buffer | 🎯 Target |
| 🔵 Level 5 | After Level 4 | 50 Testnet users, feedback-led improvements, verification thresholds, donor traceability, pricing checks, receipt, pitch, and demo | Future |
| ⚫ Level 6 | After Level 5 | Security review, local pilot, Mainnet, 20 verified users, public launch, and ecosystem contribution | Future |

See [`docs/PROGRESS.md`](./docs/PROGRESS.md) for the acceptance checklist and [`docs/BELT-REQUIREMENTS.md`](./docs/BELT-REQUIREMENTS.md) for the program requirements.

---

## 📄 License

No license file is currently included in this repository.
