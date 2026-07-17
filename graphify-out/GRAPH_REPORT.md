# Graph Report - /home/pablo-pica/Documents/programming/aethyr  (2026-08-04)

## Corpus Check
- 83 files · ~173,017 words
- Verdict: corpus is large enough that graph structure adds value.

## Scope Exclusions
- `docs/assets/video_demo.mp4` intentionally excluded per user request.
- `**/test_snapshots/**` excluded because generated ledger fixtures distorted communities.
- Dependency, build, Playwright, and agent artifacts excluded via `.graphifyignore`.

## Summary
- 283 nodes · 360 edges · 28 communities (22 shown, 6 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 31 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output (semantic chunks reused from the prior local extraction; no new external LLM calls)

## Community Hubs (Navigation)
- [[_COMMUNITY_Package Dependencies & Tooling|Package Dependencies & Tooling]]
- [[_COMMUNITY_Escrow UI Components|Escrow UI Components]]
- [[_COMMUNITY_Payment Router & Sponsorship|Payment Router & Sponsorship]]
- [[_COMMUNITY_App Shell & Payment UX|App Shell & Payment UX]]
- [[_COMMUNITY_Escrow Contract & Tests|Escrow Contract & Tests]]
- [[_COMMUNITY_Send & Wallet Logic|Send & Wallet Logic]]
- [[_COMMUNITY_Project Documentation & Aid Strategy|Project Documentation & Aid Strategy]]
- [[_COMMUNITY_Wallet Sheets & Profile|Wallet Sheets & Profile]]
- [[_COMMUNITY_End-to-End UI Tests|End-to-End UI Tests]]
- [[_COMMUNITY_Settings & AI Assist|Settings & AI Assist]]
- [[_COMMUNITY_PWA Manifest|PWA Manifest]]
- [[_COMMUNITY_UI Interaction Audits|UI Interaction Audits]]
- [[_COMMUNITY_Escrow Screens|Escrow Screens]]
- [[_COMMUNITY_Confirmation UI|Confirmation UI]]
- [[_COMMUNITY_App Layout|App Layout]]
- [[_COMMUNITY_Design System & Redesign|Design System & Redesign]]
- [[_COMMUNITY_Freighter Wallet Hook|Freighter Wallet Hook]]
- [[_COMMUNITY_CI Test Evidence|CI Test Evidence]]
- [[_COMMUNITY_Deployment & Testnet|Deployment & Testnet]]
- [[_COMMUNITY_Wallet Connection|Wallet Connection]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_Pre-commit Workflow|Pre-commit Workflow]]
- [[_COMMUNITY_Routing Topology|Routing Topology]]

## God Nodes (most connected - your core abstractions)
1. `AethyrEscrow` - 12 edges
2. `Aethyr Root README Document` - 10 edges
3. `Milestone` - 8 edges
4. `Escrow` - 8 edges
5. `System Architecture Specification` - 8 edges
6. `validateStellarAddress()` - 7 edges
7. `Approved Idea Submission Markdown` - 7 edges
8. `Living Progress Tracker Document` - 7 edges
9. `scripts` - 6 edges
10. `POST()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Gasless Fee Sponsorship Relayer` --references--> `POST()`  [INFERRED]
  README.md → src/app/api/sponsor/route.ts
- `Aethyr Router Soroban Smart Contract` --references--> `AethyrRouter`  [INFERRED]
  README.md → contracts/aethyr-router/contracts/aethyr-router/src/lib.rs
- `Aethyr Escrow Soroban Smart Contract` --references--> `AethyrEscrow`  [INFERRED]
  README.md → contracts/aethyr-router/contracts/aethyr-escrow/src/lib.rs
- `Active Escrows UI Layout` --conceptually_related_to--> `EscrowTab()`  [INFERRED]
  docs/assets/activeescrows.png → src/components/EscrowTab.tsx
- `Create Escrow Lock Form UI` --conceptually_related_to--> `EscrowTab()`  [INFERRED]
  docs/assets/createescrow.png → src/components/EscrowTab.tsx

## Hyperedges (group relationships)
- **Aethyr Aid Typhoon Relief Verification & Voucher Flow** — aethyr_readme_aethyr_aid_mvp, docs_architecture_voucher_flow, docs_idea_submission_bicol_problem, docs_masterplan_product_strategy [EXTRACTED 1.00]
- **Stellar JTM Program Governance & Belt Verification System** — docs_masterplan_jtm_program, docs_belt_requirements_belt_checklists, docs_levels_4_7_requirements_doc, docs_progress_active_task [EXTRACTED 1.00]
- **Antigravity Multi-Agent Autonomous Development & Quality Loop** — docs_agents_three_agent_system, docs_progress_doc, docs_belt_requirements_doc, workflows_ci_pipeline [EXTRACTED 1.00]
- **End-to-End Cross-Border Payment Flow** — assets_screen2_send_ui, assets_screen6_route_path_visualizer, assets_screen3_broadcasting_state, assets_screen4_payment_success_ui, assets_screen7_activity_history_ui [EXTRACTED 1.00]
- **Milestone-Based Escrow Lifecycle** — assets_createescrow_form_ui, assets_configuremilestones_modal_ui, assets_configuremilestones_weight_validation, assets_activeescrows_ui_layout, assets_activeescrows_milestone_card [EXTRACTED 1.00]
- **Continuous Integration & Test Audit Pipeline** — assets_screen8_dev_test_suite, assets_screen8_cicd_pipeline, assets_screen9_terminal_test_log [EXTRACTED 1.00]

## Communities (28 total, 6 thin omitted)

### Community 0 - "Package Dependencies & Tooling"
Cohesion: 0.06
Nodes (32): dependencies, clsx, @creit.tech/stellar-wallets-kit, framer-motion, lucide-react, next, react, react-dom (+24 more)

### Community 1 - "Escrow UI Components"
Cohesion: 0.09
Nodes (13): TransactionItem, ActivityTabProps, containerVariants, itemVariants, TransactionItem, EscrowTabProps, TransactionItem, Milestone (+5 more)

### Community 2 - "Payment Router & Sponsorship"
Cohesion: 0.09
Nodes (20): Gasless Fee Sponsorship Relayer, Aethyr Router Soroban Smart Contract, handleSend(), Client-Side DEX Pathfinder Engine, routePayment(), routeToEscrow(), submitTransaction(), horizonServer (+12 more)

### Community 3 - "App Shell & Payment UX"
Cohesion: 0.10
Nodes (20): Dashboard(), MOCK_TRANSACTIONS, WalletConnect, Aethyr Hero Protocol Banner, Multi-Token Balances List, Wallet Account Drawer, Transfer Assets Send Form UI, Broadcasting Transaction Loading Modal (+12 more)

### Community 4 - "Escrow Contract & Tests"
Cohesion: 0.18
Nodes (13): Aethyr Escrow Soroban Smart Contract, AethyrEscrow, AethyrEscrowTrait, DataKey, Escrow, Milestone, test_auto_release_fails_before_time(), test_auto_release_fails_if_disputed() (+5 more)

### Community 5 - "Send & Wallet Logic"
Cohesion: 0.12
Nodes (12): SendTab(), SendTabProps, horizonServer, rpcServer, WalletState, parseAiIntent(), ParsedIntent, ParsedMilestone (+4 more)

### Community 6 - "Project Documentation & Aid Strategy"
Cohesion: 0.15
Nodes (21): Aethyr Aid Level 4 Typhoon Relief Scope, Aethyr Root README Document, Soroban Router Contract README, Agentic Workflow Configuration Document, 3-Agent System Architecture, System Architecture Specification, Voucher & Attestation Verification Architecture, Belt Audit Verification Checklists (+13 more)

### Community 7 - "Wallet Sheets & Profile"
Cohesion: 0.15
Nodes (4): ProfileDrawerProps, WalletOption, WalletPickerBottomSheetProps, BottomSheetProps

### Community 8 - "End-to-End UI Tests"
Cohesion: 0.17
Nodes (11): activityTabBtn, backdrop, bottomNav, connectBtn, customSlippageBtn, customSlippageInput, escrowTabBtn, fromDetail (+3 more)

### Community 9 - "Settings & AI Assist"
Cohesion: 0.18
Nodes (6): AI Assist Intent Prompt Banner, Send Tab AI Intent Prompt Bar, App Settings Tab UI, SettingsTab(), SettingsTabProps, InfoTooltipProps

### Community 10 - "PWA Manifest"
Cohesion: 0.20
Nodes (9): background_color, description, display, icons, name, orientation, short_name, start_url (+1 more)

### Community 11 - "UI Interaction Audits"
Cohesion: 0.22
Nodes (8): aiStrip, connectBtn, distinctHeights, expandBtn, parseBtn, sandboxBtn, toggleSpan, transitionHeights

### Community 12 - "Escrow Screens"
Cohesion: 0.33
Nodes (7): Active Escrow Milestone Card, Escrow Role Selector, Active Escrows UI Layout, Configure Milestones Sheet UI, Milestone Basis Points Weight Validation, Create Escrow Lock Form UI, EscrowTab()

### Community 13 - "Confirmation UI"
Cohesion: 0.43
Nodes (5): cn(), ConfirmationDialog(), ConfirmationDialogProps, InlineConfirmationButton(), InlineConfirmationButtonProps

### Community 14 - "App Layout"
Cohesion: 0.40
Nodes (3): inter, metadata, outfit

### Community 15 - "Design System & Redesign"
Cohesion: 0.50
Nodes (4): Frontend Redesign Plan Specification, Redesigned Shared UI Primitives & Navigation, Space-Themed Mobile Design System, Code & Style Guide Document

### Community 17 - "CI Test Evidence"
Cohesion: 0.67
Nodes (3): GitHub Actions CI/CD Pipeline Dashboard, Rust & Vitest Test Execution Results, Terminal Test Log Verification

### Community 18 - "Deployment & Testnet"
Cohesion: 0.67
Nodes (3): Deployment & Setup Guide Document, Freighter & Dev Key Testnet Configuration, Mock Asset Liquidity Setup

## Knowledge Gaps
- **123 isolated node(s):** `nextConfig`, `config`, `name`, `version`, `private` (+118 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `POST()` connect `Payment Router & Sponsorship` to `Escrow Contract & Tests`?**
  _High betweenness centrality (0.001) - this node is a cross-community bridge._
- **Why does `Aethyr Root README Document` connect `Project Documentation & Aid Strategy` to `Payment Router & Sponsorship`, `Escrow Contract & Tests`?**
  _High betweenness centrality (0.000) - this node is a cross-community bridge._
- **What connects `nextConfig`, `config`, `name` to the rest of the system?**
  _123 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Package Dependencies & Tooling` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._
- **Should `Escrow UI Components` be split into smaller, more focused modules?**
  _Cohesion score 0.08994708994708994 - nodes in this community are weakly interconnected._
- **Should `Payment Router & Sponsorship` be split into smaller, more focused modules?**
  _Cohesion score 0.09401709401709402 - nodes in this community are weakly interconnected._
- **Should `App Shell & Payment UX` be split into smaller, more focused modules?**
  _Cohesion score 0.09846153846153846 - nodes in this community are weakly interconnected._