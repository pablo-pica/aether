# Aethyr Frontend Revamp Plan

## Status

Approved and implemented through Milestones 3-6 for the frontend app shell. The revamp replaces the `/app` presentation layer while preserving wallet, Stellar, Soroban, sponsorship, observability, and contract behavior.

## Product direction

### Brand

Keep the **Aethyr** name but replace the current “neon routing protocol” identity.

Aethyr is positioned first as **Aethyr Aid — Verified Typhoon Relief Payments on Stellar**. Payment routing and general escrow remain available as supporting protocol tools, not as the landing-page story.

Proposed positioning:

- **Headline:** Relief should arrive with proof.
- **Supporting line:** Track a donation from campaign escrow to beneficiary voucher, merchant evidence, verification, and payout—or a transparent dispute.
- **Voice:** human, locally grounded, accountable, and beginner-friendly; explain the relief process before mentioning blockchain infrastructure.
- **Visual idea:** a warm path begins with donor intent and resolves into cool, verified settlement, showing exactly where accountability is added.
- **Story anchor:** Bato, Camarines Sur and the last-mile accountability gap after typhoons in Bicol.

The supplied Dribbble reference informs the clean editorial composition, bold display typography, large product demonstration, and selective gradient accents. No reference assets will be copied. `docs/IDEA-SUBMISSION.txt` is the source of truth for product story, target users, MVP boundaries, and roadmap language.

### Palette

Use the supplied colors as semantic tokens rather than a full rainbow on every surface:

- **Action / urgency:** `#F94144`, `#F3722C`
- **Energy / highlights:** `#F8961E`, `#F9844A`, `#F9C74F`
- **Success / humanitarian:** `#90BE6D`, `#43AA8B`
- **Trust / infrastructure:** `#4D908E`, `#577590`, `#277DA1`
- **Neutrals:** warm off-white surfaces and dark ink text added for readable contrast.

Primary gradients:

1. **Intent:** coral → orange → gold
2. **Trust:** green → teal → blue
3. **Journey:** a restrained warm-to-cool gradient used only for the hero demonstration, major calls to action, and progress paths

Flat semantic colors remain the default for text, forms, status, and accessibility.

## Information architecture

### Public site

`/`

1. Header with **Aethyr Aid** identity and launch action
2. Hero: “Relief should arrive with proof” plus the donation-to-payout trail
3. Personal origin: Bato, Camarines Sur and Bicol’s typhoon-recovery accountability gap
4. “How Aethyr Aid works” — Campaign → Case → Voucher → Evidence → Verification → Payout or Dispute
5. Core MVP capabilities — campaign escrow, lightweight beneficiary case IDs, approved merchants/cooperatives, evidence hashes, verifier attestations, and frozen disputes
6. Role map — donors/OFWs/NGOs, NGO or barangay coordinators, merchants/cooperatives, and independent verifiers
7. Clean delivery versus disputed delivery walkthrough
8. Why Stellar — low-cost settlement and Soroban-enforced states, presented as infrastructure rather than the headline
9. Realistic scope — families do not need wallets; sensitive data stays off-chain; no claims that blockchain validates real-world truth by itself
10. Judge-friendly guided demo callout
11. FAQ
12. Final launch call to action and footer

### Application

`/app`

- Aethyr Aid command center as the default operational experience
- First-run Aid role chooser: “How are you helping?”
- Role-aware overview with the next recommended Aid action
- Persistent, visible role switcher
- Wallet status and Testnet status
- Contextual guides and a relief-workflow glossary
- Desktop sidebar and mobile bottom navigation
- General routing and escrow retained under a clearly secondary **Protocol tools** section

Primary routes:

- `/app` — Aethyr Aid overview
- `/app/aid/donor`
- `/app/aid/coordinator`
- `/app/aid/merchant`
- `/app/aid/verifier`
- `/app/activity`
- `/app/settings`

Supporting routes:

- `/app/tools/send`
- `/app/tools/escrow`

The application may use route-backed views or route-compatible internal state depending on the least disruptive integration seam. URLs must remain shareable and browser navigation must work.

### Judge preview

`/preview`

A desktop-only preview studio shows synchronized desktop and phone frames side by side.

Safety rules:

- Preview uses deterministic demo data only.
- Live wallet and contract actions are disabled inside preview frames.
- The studio clearly says that it is a visual preview, not a transaction environment.
- Normal `/app` remains genuinely responsive and is the only operational surface.

This avoids duplicate wallet prompts or accidental submission from two synchronized views.

## Role model

Role selection customizes navigation and guidance; it never grants or claims on-chain authority. The contract remains authoritative.

| Primary Aid role | Real-world user | Current MVP tasks |
| --- | --- | --- |
| Donor | International donor, NGO funder, or OFW | Fund a campaign and follow the guided demonstration of where funds go |
| Coordinator | NGO admin, barangay official, or authorized volunteer | Create campaigns and beneficiary case IDs, approve merchants, issue vouchers, and freeze suspicious claims |
| Merchant | Registered local merchant or cooperative | Redeem a purpose-limited voucher with evidence and append the one permitted revision after a freeze |
| Verifier | Independent reviewer or authorized verifier | Approve or reject a frozen claim and make the payout outcome attributable |

A role switch is always available because one wallet may serve multiple legitimate roles. The UI will state: “This changes which tools you see. Your wallet and contract permissions still apply.”

Beneficiary families are central to the story but are intentionally **not** application operators in this MVP. The frontend will not invent a beneficiary wallet, document-upload flow, SMS system, QR/PIN flow, GCash/Maya integration, or identity platform. General Sender, Client, Freelancer, and Mediator views remain accessible only within Protocol tools.

## Beginner-friendly interaction model

Each workflow follows the same pattern:

1. **Purpose** — what this action accomplishes
2. **You need** — wallet, IDs, balances, hashes, or role prerequisites
3. **Enter details** — accessible form fields with examples and helper text
4. **Review before signing** — plain-language summary of the transaction
5. **Sign in wallet** — explicit boundary between Aethyr and Freighter
6. **Outcome** — success/failure receipt and suggested next step

Guidance components:

- First-run role chooser
- Optional “Judge tour” with a short route through the system
- “Why am I seeing this?” contextual notes
- Demo / Live Testnet badges with unambiguous boundaries
- Inline glossary for campaign, case, voucher, evidence digest, escrow, and verifier
- Progress steps for multi-action workflows
- Empty, loading, disconnected, permission, and error states
- Destructive or irreversible actions require confirmation and explain consequences

## Design system

### Visual language

- Light, editorial base rather than the current dark glassmorphism shell
- Bold but controlled display type; readable body type
- Purpose-driven layouts instead of uniform card grids
- Strong whitespace and thin structural rules
- Moderate radius hierarchy, not maximum rounding everywhere
- Gradients reserved for identity and progress—not form surfaces
- Minimal shadows; hierarchy comes from typography, spacing, border, and color
- Motion explains transitions and respects `prefers-reduced-motion`

### Responsive behavior

- Mobile-first implementation
- Verified at 320px, 768px, 1024px, and 1440px
- Desktop: persistent sidebar, contextual guide rail where useful
- Tablet: compact sidebar or top-level navigation
- Mobile: bottom navigation, stacked forms, sticky primary action only when it does not obscure content
- No horizontal overflow; long Stellar addresses and hashes remain copyable and readable

### Accessibility

Target WCAG 2.1 AA:

- Semantic landmarks and heading order
- Keyboard-accessible controls and visible focus states
- 4.5:1 normal-text contrast and 3:1 large-text/UI contrast
- Status is never communicated by color alone
- Accessible names and descriptions for wallet, role, preview, and transaction controls
- Focus management for dialogs, drawers, route changes, and transaction results
- Reduced-motion support

## Frontend architecture

### Preserve unchanged

- `src/hooks/useStellarWallet.ts` method names, input shapes, serialization, wallet behavior, and transaction submission
- `src/components/aidDemoState.ts` transition semantics
- Soroban contracts and all Rust code
- Sponsor API behavior
- PostHog/Sentry privacy boundaries
- Environment variable contracts

### Replace or reorganize

- Current 792-line root dashboard shell
- Root mobile-device mockup framing
- Current bottom-tab-first information architecture
- Current neon/glass visual tokens
- Presentation copy and navigation labels
- Monolithic Aid workspace presentation

### Proposed component boundaries

```text
src/app/
  page.tsx                    # public landing
  app/
    layout.tsx                # application shell
    page.tsx                  # role-aware overview
    send/page.tsx
    escrow/page.tsx
    aid/page.tsx
    activity/page.tsx
    settings/page.tsx
  preview/page.tsx            # non-operational judge studio

src/components/
  brand/
  landing/
  app-shell/
  guidance/
  preview/
  workflows/
    send/
    escrow/
    aid/
  ui/
```

The final structure may consolidate very small components, but no user-facing component should become another oversized page controller.

### State boundaries

- Wallet/transaction behavior stays in `useStellarWallet`.
- Role selection is frontend preference state, persisted locally and always changeable.
- Route state lives in the URL.
- Form state stays local to each workflow.
- Preview state is deterministic and isolated from live actions.
- Shared transaction status/receipt presentation becomes a reusable frontend component.

## Test-first implementation milestones

### Milestone 1 — route and design-system foundation

1. Add failing tests for `/`, `/app`, role selection, navigation, and preview safety.
2. Introduce new semantic tokens, typography, focus treatment, layout primitives, buttons, fields, status badges, and guide components.
3. Replace global dark/neon assumptions without changing wallet behavior.

### Milestone 2 — Aethyr Aid landing page

1. Build the complete Aid-first landing page and responsive header/menu.
2. Ground the story in Bicol, the last-mile accountability problem, and the approved MVP scope from `docs/IDEA-SUBMISSION.txt`.
3. Visualize the traceable path from donation to clean payout or disputed outcome.
4. Add clear paths to launch the Aid workspace and guided preview.

### Milestone 3 — Aid-first application shell and roles

Status: implemented. `/app` now defaults to Aethyr Aid, includes Donor/Coordinator/Merchant/Verifier local role selection, keeps wallet/Testnet controls visible, and moves Send/Escrow under Protocol tools.

1. Extract the operational dashboard from `/` into `/app` and make Aethyr Aid the default command center.
2. Add the Donor, Coordinator, Merchant, and Verifier chooser/switcher with role-aware next actions.
3. Add desktop, tablet, and mobile navigation.
4. Preserve wallet picker, profile, disconnect, and Testnet status behavior.
5. Move Send and Escrow into a secondary Protocol tools section without removing functionality.

### Milestone 4 — workflow rebuild

Status: implemented. Existing Aid, Send, Escrow, Activity, and Settings handlers are still passed through the dashboard controller; role guidance is presentation-only.

Rebuild presentation around existing handlers in this order:

1. Aid donor/coordinator/merchant/verifier views, including clean and disputed walkthroughs
2. Activity and settings in support of the Aid audit trail
3. Send and transaction result flow under Protocol tools
4. Escrow client/freelancer/mediator views under Protocol tools

Each migration preserves handler inputs and outputs and adds plain-language prerequisites, review, signing boundary, and result guidance.

### Milestone 5 — preview studio

Status: implemented. `/preview` is a deterministic desktop-only visual preview that imports no wallet hook and exposes no transaction submission controls.

1. Add synchronized desktop and phone visual frames.
2. Reuse presentation components with demo fixtures.
3. Prove that wallet/contract actions cannot execute in preview mode.

### Milestone 6 — hardening

Status: implemented. Validation evidence: `npm test` (96 tests), `npm run lint`, `npx tsc --noEmit`, `npm run build`, and nine Playwright checks pass locally. Playwright covers 320px, 768px, 1024px, and 1440px layouts, shareable routes, mounted form persistence, keyboard entry, preview safety, horizontal overflow, reduced motion, and automated WCAG 2.1 AA scans. Non-goals remain unchanged: no backend, contract, sponsor API, wallet serialization, or `aidDemoState` semantic changes.

1. Replace obsolete brittle tests with behavior contracts while retaining backend-facing unit coverage.
2. Run unit tests, ESLint, and production build.
3. Run Playwright flows at all target widths.
4. Add automated accessibility checks and manually tab through critical flows.
5. Validate no wallet address, evidence value, or transaction payload leaks into telemetry.
6. Update README, walkthrough, deployment, and progress documentation.

## Validation contract

The revamp is complete only when:

- `/` is a standalone polished landing page.
- `/app` presents Aethyr Aid—not general payments—as the primary product and exposes every currently supported frontend action.
- The landing page accurately reflects the approved Rise In idea: typhoon relief in Bicol, last-mile accountability, no beneficiary-wallet requirement, sensitive data off-chain, and a traceable clean/disputed delivery flow.
- All existing wallet and contract method signatures remain intact.
- Every Aid action is reachable through a Donor, Coordinator, Merchant, or Verifier guided workflow; general payment and escrow actions remain available as secondary Protocol tools.
- Users can switch roles without reconnecting their wallet.
- Preview studio shows desktop and phone simultaneously and cannot submit live transactions.
- The application works at 320px, 768px, 1024px, and 1440px.
- Keyboard navigation, focus states, labels, dialogs, and statuses meet WCAG 2.1 AA expectations.
- Unit tests, ESLint, production build, and Playwright checks pass.
- Contract/Rust files and backend functionality are unchanged.
- Production observability remains privacy-safe.

## Baseline evidence

Before implementation:

- Unit tests: **82 passed / 82**
- ESLint: **passed**
- Graphify: `Dashboard()` calls `useStellarWallet.ts` and composes the current tab views; `AidTab()` is the main Aid presentation boundary.
- Working tree was clean before this plan was added.

## Explicit non-goals

- No Soroban contract changes
- No sponsorship API changes
- No new on-chain roles or permissions
- No fabricated beneficiary wallet or recipient-operator workflow
- No SMS, QR/PIN, GCash/Maya, full identity platform, donor trace product, or multi-party verification threshold beyond what the current MVP implements
- No claim that blockchain alone verifies real-world truth
- No duplicate or automatic wallet prompts
- No copied Dribbble assets or branding
- No production deployment until the redesigned frontend passes validation and receives review
