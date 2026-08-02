# Graph Report - .  (2026-08-04)

## Corpus Check
- 25 files · ~185,690 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 437 nodes · 699 edges · 44 communities (38 shown, 6 thin omitted)
- Extraction: 90% EXTRACTED · 10% INFERRED · 0% AMBIGUOUS · INFERRED: 69 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Aid Contract Operations|Aid Contract Operations]]
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_Aid Wallet Integration|Aid Wallet Integration]]
- [[_COMMUNITY_Architecture Documentation|Architecture Documentation]]
- [[_COMMUNITY_Aid Demo State|Aid Demo State]]
- [[_COMMUNITY_Payment Router Logic|Payment Router Logic]]
- [[_COMMUNITY_Escrow Contract Tests|Escrow Contract Tests]]
- [[_COMMUNITY_Aid Voucher Specification|Aid Voucher Specification]]
- [[_COMMUNITY_Escrow UI Components|Escrow UI Components]]
- [[_COMMUNITY_Utility and UI Tests|Utility and UI Tests]]
- [[_COMMUNITY_Aid Contract Storage|Aid Contract Storage]]
- [[_COMMUNITY_Dashboard Navigation|Dashboard Navigation]]
- [[_COMMUNITY_Dashboard Page Tests|Dashboard Page Tests]]
- [[_COMMUNITY_Aid Contract Tests|Aid Contract Tests]]
- [[_COMMUNITY_Send and AI Logic|Send and AI Logic]]
- [[_COMMUNITY_PWA Manifest|PWA Manifest]]
- [[_COMMUNITY_App Shell and Payment UX|App Shell and Payment UX]]
- [[_COMMUNITY_Settings and AI Assist|Settings and AI Assist]]
- [[_COMMUNITY_End-to-End UI Tests|End-to-End UI Tests]]
- [[_COMMUNITY_UI Interaction Audits|UI Interaction Audits]]
- [[_COMMUNITY_Aid System Documentation|Aid System Documentation]]
- [[_COMMUNITY_Escrow Screens|Escrow Screens]]
- [[_COMMUNITY_Wallet Connection|Wallet Connection]]
- [[_COMMUNITY_Transaction Submission Tests|Transaction Submission Tests]]
- [[_COMMUNITY_App Layout|App Layout]]
- [[_COMMUNITY_Wallet Sheets and Profile|Wallet Sheets and Profile]]
- [[_COMMUNITY_Project Strategy|Project Strategy]]
- [[_COMMUNITY_Deployment and Testnet|Deployment and Testnet]]
- [[_COMMUNITY_Design System|Design System]]
- [[_COMMUNITY_CI Test Evidence|CI Test Evidence]]
- [[_COMMUNITY_Mock Asset Setup|Mock Asset Setup]]
- [[_COMMUNITY_Aid Campaign Invariants|Aid Campaign Invariants]]
- [[_COMMUNITY_Aid Tab Tests|Aid Tab Tests]]
- [[_COMMUNITY_Freighter Wallet Hook|Freighter Wallet Hook]]
- [[_COMMUNITY_Pre-commit Workflow|Pre-commit Workflow]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_Routing Topology|Routing Topology]]
- [[_COMMUNITY_Feature Progression|Feature Progression]]

## God Nodes (most connected - your core abstractions)
1. `AethyrAid` - 38 edges
2. `buildAidInvocationArgs()` - 18 edges
3. `require_admin()` - 16 edges
4. `AethyrEscrow` - 12 edges
5. `onCreateEscrow()` - 12 edges
6. `applyDemoAction()` - 12 edges
7. `approved_merchant()` - 12 edges
8. `touch()` - 12 edges
9. `Aethyr Root README Document` - 10 edges
10. `AidError` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Gasless Fee Sponsorship Relayer` --references--> `POST()`  [INFERRED]
  README.md → src/app/api/sponsor/route.ts
- `System Architecture Specification` --references--> `onCreateEscrow()`  [INFERRED]
  docs/ARCHITECTURE.md → src/app/page.tsx
- `Stellar Wallets Kit Connect Modal` --conceptually_related_to--> `WalletConnect`  [INFERRED]
  docs/assets/screen5.png → src/app/page.tsx
- `Broadcasting Transaction Loading Modal` --conceptually_related_to--> `Dashboard()`  [INFERRED]
  docs/assets/screen3.png → src/app/page.tsx
- `Payment Transmitted Confirmation Modal` --conceptually_related_to--> `Dashboard()`  [INFERRED]
  docs/assets/screen4.png → src/app/page.tsx

## Hyperedges (group relationships)
- **Level 4 Voucher Lifecycle** — level_4_implementation_spec_campaign, level_4_implementation_spec_merchant_registry, level_4_implementation_spec_beneficiary_case, level_4_implementation_spec_voucher, level_4_implementation_spec_evidence_submission, level_4_implementation_spec_decision_attestation [EXTRACTED 0.75]
- **Level 3 Contract Foundation** — aethyr_readme_aethyr_router_contract, aethyr_readme_aethyr_escrow_contract, aethyr_readme_gasless_fee_sponsorship_relayer [EXTRACTED 0.75]
- **Level 4 Submission Evidence** — deployment_deployment_level_4_deployment_evidence_gate, deployment_deployment_stellar_testnet, deployment_deployment_vercel, progress_progress_green_belt_contracts_and_test_coverage [INFERRED 0.75]

## Communities (44 total, 6 thin omitted)

### Community 0 - "Aid Contract Operations"
Cohesion: 0.14
Nodes (17): AidError, admin_member(), AethyrAid, approved_merchant(), checked_add(), checked_sub(), ensure_initialized(), require_admin() (+9 more)

### Community 1 - "Package Dependencies"
Cohesion: 0.06
Nodes (31): dependencies, clsx, @creit.tech/stellar-wallets-kit, framer-motion, lucide-react, next, react, react-dom (+23 more)

### Community 2 - "Aid Wallet Integration"
Cohesion: 0.11
Nodes (23): AidTabProps, Aid invocation serialization tests, args, category, decideArgs, id, aidAddressScVal(), aidAmountToI128ScVal() (+15 more)

### Community 3 - "Architecture Documentation"
Cohesion: 0.11
Nodes (27): Aethyr Aid Level 4 Typhoon Relief Scope, Aethyr Escrow Contract, Aethyr Router Contract, Aethyr Root README Document, Gasless Fee Sponsorship Relayer, Implemented Level 3 Foundation, Soroban Router Contract README, Hybrid Algorithm Design (+19 more)

### Community 4 - "Aid Demo State"
Cohesion: 0.12
Nodes (22): applyDemoAction(), bootstrapIssuedDemo(), DemoAction, DemoClaimDecision, DemoState, DemoStatus, emptyDemoState(), Aid demo state transition tests (+14 more)

### Community 5 - "Payment Router Logic"
Cohesion: 0.10
Nodes (20): Aethyr Router Soroban Smart Contract, handleSend(), MOCK_TRANSACTIONS, Client-Side DEX Pathfinder Engine, invokeAidContract, submitTransaction(), sponsorship fallback test, horizonServer (+12 more)

### Community 6 - "Escrow Contract Tests"
Cohesion: 0.19
Nodes (13): Aethyr Escrow Soroban Smart Contract, onCreateEscrow(), AethyrEscrow, DataKey, Escrow, Milestone, test_auto_release_fails_before_time(), test_auto_release_fails_if_disputed() (+5 more)

### Community 7 - "Aid Voucher Specification"
Cohesion: 0.11
Nodes (19): Typhoon Relief, Verified Typhoon Relief Payments on Stellar, Voucher MVP, Replay and State-Transition Protection, Voucher, BeneficiaryCase, Campaign, CampaignStatus (+11 more)

### Community 8 - "Escrow UI Components"
Cohesion: 0.15
Nodes (10): TransactionItem, ActivityTabProps, containerVariants, itemVariants, TransactionItem, EscrowTabProps, TransactionItem, Milestone (+2 more)

### Community 9 - "Utility and UI Tests"
Cohesion: 0.23
Nodes (8): cn(), sanitizeSymbol(), invalidAddresses, validAddresses, InlineConfirmationButton(), SegmentedControl(), SegmentedControlProps, SegmentedOption

### Community 10 - "Aid Contract Storage"
Cohesion: 0.28
Nodes (11): get_campaign(), get_case(), get_decision(), get_evidence(), get_merchant(), get_voucher(), set_campaign(), set_case() (+3 more)

### Community 11 - "Dashboard Navigation"
Cohesion: 0.27
Nodes (8): Dashboard layout tests, BottomNavProps, TabId, bottomNav, Toast, ToastContainer(), ToastContainerProps, ToastItem()

### Community 12 - "Dashboard Page Tests"
Cohesion: 0.18
Nodes (10): aidContent, aidPath, fileContent, filePath, navContent, navPath, pageContent, pagePath (+2 more)

### Community 13 - "Aid Contract Tests"
Cohesion: 0.36
Nodes (9): aggregate_token_balance_is_conserved_across_campaigns_sharing_a_token(), assert_campaign_identity(), authorization_roles_and_registry_are_strictly_separated(), cancellation_expiration_closure_and_proportional_refund_return_dust(), clean_delivery_pays_once_and_rejects_replay(), disputed_delivery_preserves_evidence_and_releases_rejected_reservation(), Fixture, frozen_claim_approval_after_revision_pays_once_and_attests_revision() (+1 more)

### Community 14 - "Send and AI Logic"
Cohesion: 0.27
Nodes (6): SendTab(), SendTabProps, parseAiIntent(), ParsedIntent, ParsedMilestone, validateStellarAddress()

### Community 15 - "PWA Manifest"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, orientation, short_name, start_url (+1 more)

### Community 16 - "App Shell and Payment UX"
Cohesion: 0.25
Nodes (9): Dashboard(), Aethyr Hero Protocol Banner, Transfer Assets Send Form UI, Broadcasting Transaction Loading Modal, Payment Transmitted Confirmation Modal, Aethyr vs Competitors Fee Comparison Card, Router Multi-Hop Route Visualizer, Transaction History Activity Screen (+1 more)

### Community 17 - "Settings and AI Assist"
Cohesion: 0.22
Nodes (7): AI Assist Intent Prompt Banner, Send Tab AI Intent Prompt Bar, App Settings Tab UI, SettingsTabProps, CustomNumberInput(), InfoTooltip(), InfoTooltipProps

### Community 18 - "End-to-End UI Tests"
Cohesion: 0.22
Nodes (8): activityTabBtn, backdrop, connectBtn, customSlippageBtn, customSlippageInput, fromDetail, mockOption, txCard

### Community 19 - "UI Interaction Audits"
Cohesion: 0.22
Nodes (8): aiStrip, connectBtn, distinctHeights, expandBtn, parseBtn, sandboxBtn, toggleSpan, transitionHeights

### Community 20 - "Aid System Documentation"
Cohesion: 0.29
Nodes (7): Aethyr Aid Contract, Aethyr Aid, Approved Contract Boundary, Privacy and Trust Boundary, Level 4 Implementation Specification, Development Progress Tracker, Green Belt Contracts & Test Coverage

### Community 21 - "Escrow Screens"
Cohesion: 0.33
Nodes (6): Active Escrow Milestone Card, Escrow Role Selector, Active Escrows UI Layout, Configure Milestones Sheet UI, Milestone Basis Points Weight Validation, Create Escrow Lock Form UI

### Community 22 - "Wallet Connection"
Cohesion: 0.33
Nodes (5): WalletConnect, Multi-Token Balances List, Wallet Account Drawer, Stellar Wallets Kit Connect Modal, WalletConnectProps

### Community 23 - "Transaction Submission Tests"
Cohesion: 0.33
Nodes (5): block, content, end, sponsorshipTry, start

### Community 24 - "App Layout"
Cohesion: 0.40
Nodes (3): inter, metadata, outfit

### Community 25 - "Wallet Sheets and Profile"
Cohesion: 0.40
Nodes (3): WalletOption, BottomSheet(), BottomSheetProps

### Community 26 - "Project Strategy"
Cohesion: 0.40
Nodes (5): Aethyr, Green Belt MVP Scope, Initial Pilot Boundary, JTM Master Plan, Level 4 Objective

### Community 27 - "Deployment and Testnet"
Cohesion: 0.50
Nodes (4): Freighter Wallet, Level 4 Deployment Evidence Gate, Stellar Testnet, Vercel Deployment

### Community 28 - "Design System"
Cohesion: 0.50
Nodes (4): Frontend Redesign Plan Specification, Redesigned Shared UI Primitives & Navigation, Space-Themed Mobile Design System, Code & Style Guide Document

### Community 29 - "CI Test Evidence"
Cohesion: 0.67
Nodes (3): GitHub Actions CI/CD Pipeline Dashboard, Rust & Vitest Test Execution Results, Terminal Test Log Verification

### Community 30 - "Mock Asset Setup"
Cohesion: 0.67
Nodes (3): Deployment & Setup Guide Document, Freighter & Dev Key Testnet Configuration, Mock Asset Liquidity Setup

### Community 31 - "Aid Campaign Invariants"
Cohesion: 0.67
Nodes (3): Campaign, Campaign Accounting and Payout Invariants, Merchant Registry

## Knowledge Gaps
- **174 isolated node(s):** `config`, `name`, `version`, `private`, `dev` (+169 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `buildAidInvocationArgs()` connect `Aid Wallet Integration` to `Aid Contract Operations`, `Payment Router Logic`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._
- **Why does `AethyrAid` connect `Aid Contract Operations` to `Aid Contract Storage`, `Aid Demo State`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **Why does `POST()` connect `Payment Router Logic` to `Architecture Documentation`, `Escrow Contract Tests`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Are the 9 inferred relationships involving `buildAidInvocationArgs()` (e.g. with `Aid invocation serialization tests` and `.append_evidence_revision()`) actually correct?**
  _`buildAidInvocationArgs()` has 9 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `AethyrEscrow` (e.g. with `Aethyr Escrow Soroban Smart Contract` and `POST()`) actually correct?**
  _`AethyrEscrow` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `config`, `name`, `version` to the rest of the system?**
  _180 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Aid Contract Operations` be split into smaller, more focused modules?**
  _Cohesion score 0.14030612244897958 - nodes in this community are weakly interconnected._