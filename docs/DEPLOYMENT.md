# 🚀 Aethyr — Deployment & Setup Guide (DEPLOYMENT.md)

This document records the implemented Level 3 foundation and the validated Level 4 Aethyr Aid deployment to Stellar Testnet and Vercel. The superseded contract is retained below only to prevent accidental reuse; all live validation and submission evidence use the hardened Aid deployment and its deliberate operator-role provisioning.

---

## 🎯 Level 4 Deployment Evidence

### Superseded deployment record — do not use for validation

The prior Aethyr Aid contract is [`CDERJSFS75XYBXJOZYOJA62T4GFHSJZAM34D4OAXNSPOFSAUPWEQ3BST`](https://stellar.expert/explorer/testnet/contract/CDERJSFS75XYBXJOZYOJA62T4GFHSJZAM34D4OAXNSPOFSAUPWEQ3BST). It predates the self-approval guard and must not be used for validation. Its historical WASM upload, contract creation, and initialization transactions are respectively [`91136c9764ce8eb5e4159d7d9f6a8c687766fad74dc543a2b8246a518757b58d`](https://stellar.expert/explorer/testnet/tx/91136c9764ce8eb5e4159d7d9f6a8c687766fad74dc543a2b8246a518757b58d), [`0b48000a46b3a63465f7eaaecd49915bd13aa095d6981f59e2107a875ba93593`](https://stellar.expert/explorer/testnet/tx/0b48000a46b3a63465f7eaaecd49915bd13aa095d6981f59e2107a875ba93593), and [`831184035d160a9cf88a1532c59fa28a4ca661890d254b159efa65db7b811828`](https://stellar.expert/explorer/testnet/tx/831184035d160a9cf88a1532c59fa28a4ca661890d254b159efa65db7b811828).

### Hardened Testnet deployment — validation target

Use [`CBZKE67HDBTWIZLKZFJOMEMJSENJOUHJVBURYED5M7VYUQCPJH5VOVIC`](https://stellar.expert/explorer/testnet/contract/CBZKE67HDBTWIZLKZFJOMEMJSENJOUHJVBURYED5M7VYUQCPJH5VOVIC) for validation. It was initialized with admin `GDIOBU6KL3WY5UMWVLRAQJRCZOAAK2HWWPFENKKDFZUH55DBVCWSKZC6` in [transaction `f7b025…`](https://stellar.expert/explorer/testnet/tx/f7b0254742b351b2997f8965b62348e2157d9a9d119ae13ac0de5e2c20471ac5), and verifier `GBFFXFVXFMAPP5E6JXTV4FVH6TUBXCIIXSZJBGJNCIIL4D6UPR2UMXHL` was provisioned in [transaction `80e98d…`](https://stellar.expert/explorer/testnet/tx/80e98d1ca202960a04643c2005574a7db23bc3cbbb7234b1f14e75b59686dee1). `is_admin` and `is_verifier` reads returned `true` after deployment.

The completed Green Belt submission evidence includes:

- Hardened Testnet contract address and representative operational transaction hashes.
- Production application URL and deployment guidance.
- Monitoring and analytics setup without beneficiary personal data.
- Clean-delivery and disputed-delivery traces.
- Proof of wallet interactions from at least 10 real operational users.
- Rollback and redeployment steps for a failed contract or frontend release.
- Final live demo: [Aethyr Aid Level 4 demo on YouTube](https://youtu.be/yBHOUj8hG3k).

Mainnet deployment is outside Level 4 scope and remains blocked on the Level 6 pilot and security-review gates.

### Frontend route validation before deployment

The Aid-first frontend keeps the public story at `/` and the operational application at `/app`. Validate the role routes, `/app/activity`, `/app/settings`, `/app/tools/send`, `/app/tools/escrow`, and the non-operational `/preview` before promoting a release. The preview is deterministic and must never import wallet, sponsor, or contract submission seams.

Run:

```bash
npm test
npm run lint
npm run build
# Start the production build, then run the responsive/accessibility suite:
PLAYWRIGHT_BASE_URL=http://localhost:3000 npm run test:ui
PLAYWRIGHT_BASE_URL=http://localhost:3000 npm run test:demo
PLAYWRIGHT_BASE_URL=http://localhost:3000 npm run test:visual
```

The current presentation release passed these checks. No backend, contract, sponsorship, or wallet-serialization change is required for the documented Green Belt evidence package.

---

## 🦊 Freighter Wallet Configuration

1. **Installation**: Install the Freighter extension from [freighter.app](https://www.freighter.app/).
2. **Network Toggle**:
   - Open the Freighter extension window.
   - Click the gear icon in the top right.
   - Navigate to **Preferences** -> **Network**.
   - Toggle the active network to **Testnet** (Default is Public).
3. **Funding your Wallet**:
   - Copy your public key address starting with `G...` from the main screen.
   - Visit the [Stellar Laboratory Friendbot](https://laboratory.stellar.org/#account-creator?network=testnet).
   - Paste your address and click **Get testnet network funds**.
   - Verify balance in Freighter (should show 10,000 XLM).

---

## 🏗️ CLI Testnet Key Generation

We need a funded dev key to deploy contracts from our terminal.

```bash
# Generate key pair for deployment
stellar keys generate deployer --network testnet --fund
```
This generates a keypair, funds it with 10,000 XLM, and registers it in the local keyring as `deployer`.

---

## 🛠️ Smart Contract Compilation, Deployment & Initialization

Compile the smart contracts, deploy them to Testnet, and execute initialization parameters:

```bash
# 1. Build WASM artifacts
stellar contract build

# 2. Deploy aethyr-aid (only when creating a new Testnet environment)
stellar contract deploy \
  --wasm target/wasm32v1-none/release/aethyr_aid.wasm \
  --source-account deployer \
  --network testnet \
  --alias aethyr-aid

# 3. Initialize it exactly once with an admin account
stellar contract invoke \
  --id aethyr-aid \
  --source-account deployer \
  --network testnet \
  -- \
  initialize \
  --first_admin deployer

# 4. Provision a separate verifier account. Do not make an admin a verifier.
stellar contract invoke \
  --id aethyr-aid \
  --source-account deployer \
  --network testnet \
  -- \
  add_verifier \
  --admin deployer \
  --verifier <VERIFIER_G_ADDRESS>

# 5. Deploy aethyr-router
stellar contract deploy \
  --wasm target/wasm32v1-none/release/aethyr_router.wasm \
  --source-account dev \
  --network testnet \
  --alias aethyr-router

# 6. Deploy aethyr-escrow
stellar contract deploy \
  --wasm target/wasm32v1-none/release/aethyr_escrow.wasm \
  --source-account dev \
  --network testnet \
  --alias aethyr-escrow

# 7. Initialize aethyr-escrow with its validator address
# The router contract has no initialize function.
stellar contract invoke \
  --id aethyr-escrow \
  --source-account dev \
  --network testnet \
  -- \
  initialize \
  --validator dev

# 8. Generate TypeScript bindings for integration
stellar contract bindings typescript \
  --network testnet \
  --contract-id aethyr-router \
  --output-dir ./packages/aethyr-router-bindings
```

---

## 🪙 Mock Assets & Liquidity Setup (Testnet Testing)

Since cross-border pathfinding requires liquid trading routes between assets, you must configure mock token contracts representing USD, PHP, and NGN on Stellar Testnet:

### 1. Deploy & Initialize Mock USDC
```bash
# Deploy token contract
stellar contract deploy \
  --wasm target/wasm32v1-none/release/soroban_token_contract.wasm \
  --source-account dev \
  --network testnet \
  --alias mock-usdc

# Initialize Mock USDC (7 decimals)
stellar contract invoke \
  --id mock-usdc \
  --source-account dev \
  --network testnet \
  -- \
  initialize \
  --admin dev \
  --decimal 7 \
  --name "Mock USD Coin" \
  --symbol "USDC"
```

### 2. Mint Mock Tokens to Test Account
To run swaps, mint tokens to your Freighter or Testnet address:
```bash
stellar contract invoke \
  --id mock-usdc \
  --source-account dev \
  --network testnet \
  -- \
  mint \
  --to <YOUR_WALLET_ADDRESS> \
  --amount 100000000000 # Mints 10,000.0000000 USDC
```

*(Repeat this process for Mock PHP and Mock NGN to establish the node assets in the routing pathfinder).*

---


## 🔑 Environment Variables Setup

Create a `.env.local` file in the root workspace directory:

```env
# Network configuration
NEXT_PUBLIC_STELLAR_NETWORK=TESTNET
NEXT_PUBLIC_STELLAR_RPC_URL=https://soroban-testnet.stellar.org:443

# Deployed Contract Addresses
NEXT_PUBLIC_ROUTER_CONTRACT_ID=CA5ZEROS4VGIOZ2MIDVV7C7W4DFKWE76P4KBG455KO26RPKD2W3TC6MM
NEXT_PUBLIC_ESCROW_CONTRACT_ID=CD734V7PATOR7NW7APYQLUNEON2GZ7EUBM27MFQO3WDQZGCPKIWB6NOT
NEXT_PUBLIC_AID_CONTRACT_ID=CBZKE67HDBTWIZLKZFJOMEMJSENJOUHJVBURYED5M7VYUQCPJH5VOVIC

# AI Smart Assist Configuration
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 🚀 Vercel Deployment

Deploy the Next.js frontend using the Vercel Dashboard or CLI:

### Option A: Vercel Dashboard (Recommended)
1. Push your repository code to GitHub.
2. Go to the [Vercel Dashboard](https://vercel.com).
3. Click **New Project** and import the `aethyr` repository.
4. Expand **Environment Variables** and paste the keys from your `.env.local` file.
5. Click **Deploy**. Vercel will automatically trigger preview deploys on every PR and production deploys on main branch commits.

### Option B: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Initialize project and deploy
vercel
```

---

## 🔒 GitHub Actions Secrets Setup

To verify CI/CD pipelines run green:
1. Navigate to your GitHub repository.
2. Click **Settings** -> **Secrets and variables** -> **Actions**.
3. Add the following secrets under **Repository secrets**:
   - `STELLAR_DEPLOYER_SECRET`: The private secret seed of your `dev` deploying account. (Used by CI to build/validate contract compilation).
