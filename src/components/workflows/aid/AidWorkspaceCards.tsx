"use client";

import type { ReactNode } from "react";
import { CheckCircle2, ClipboardCheck, ShieldAlert, Store, WalletCards } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { ClaimDecision } from "@/hooks/useStellarWallet";
import type { DemoStatus } from "@/components/aidDemoState";
import SegmentedControl from "@/components/ui/SegmentedControl";

export type AidMode = "demo" | "live";
export type VoucherCategory = "Food" | "Medicine" | "Shelter" | "Other";
export type WalkthroughState = { name: "clean" | "disputed"; step: number } | null;

type WorkspaceAction = () => void | Promise<void>;
type ValueChange = (value: string) => void;

type WorkspaceTone = "teal" | "emerald" | "amber" | "purple";

export interface AidWorkspaceCardsProps {
  mode: AidMode;
  setMode: (mode: AidMode) => void;
  isConnected: boolean;
  isMockWallet: boolean;
  isLoading: boolean;
  pending: string;
  liveDisabled: boolean;
  available: number;
  reserved: number;
  paid: number;
  total: number;
  status: DemoStatus;
  hasRevision: boolean;
  history: string[];
  message: string;
  error: string;
  fundAmount: string;
  setFundAmount: ValueChange;
  campaignId: string;
  setCampaignId: ValueChange;
  token: string;
  setToken: ValueChange;
  merchant: string;
  setMerchant: ValueChange;
  merchantProfileHash: string;
  setMerchantProfileHash: ValueChange;
  caseId: string;
  setCaseId: ValueChange;
  caseRecordHash: string;
  setCaseRecordHash: ValueChange;
  voucherId: string;
  setVoucherId: ValueChange;
  purposeHash: string;
  setPurposeHash: ValueChange;
  voucherAmount: string;
  setVoucherAmount: ValueChange;
  category: VoucherCategory;
  setCategory: (category: VoucherCategory) => void;
  contentDigest: string;
  setContentDigest: ValueChange;
  evidenceRecordId: string;
  setEvidenceRecordId: ValueChange;
  revisionDigest: string;
  setRevisionDigest: ValueChange;
  revisionRecordId: string;
  setRevisionRecordId: ValueChange;
  reasonHash: string;
  setReasonHash: ValueChange;
  decisionReasonHash: string;
  setDecisionReasonHash: ValueChange;
  walkthrough: WalkthroughState;
  walkthroughCurrent: string;
  walkthroughNext: string;
  startWalkthrough: (name: "clean" | "disputed") => Promise<void>;
  advanceWalkthrough: WorkspaceAction;
  resetDemo: WorkspaceAction;
  addTrustline: WorkspaceAction;
  createLiveCampaign: WorkspaceAction;
  fund: WorkspaceAction;
  approve: WorkspaceAction;
  createAidCase: WorkspaceAction;
  issue: WorkspaceAction;
  redeem: WorkspaceAction;
  appendRevision: WorkspaceAction;
  freeze: WorkspaceAction;
  decide: (decision: ClaimDecision) => void | Promise<void>;
}

const inputClassName = "h-12 w-full rounded-2xl border border-aid-ink/10 bg-aid-paper/55 px-4 text-sm text-aid-ink outline-none transition-[border-color,background-color,box-shadow] duration-300 placeholder:text-aid-slate/55 hover:bg-white focus:border-aid-trust-blue focus:bg-white focus-ring";
const primaryButtonClassName = "ml-auto h-9 w-fit rounded-full bg-aid-trust-blue px-4 text-[10px] font-bold text-white transition-[transform,background-color] duration-300 hover:bg-aid-ink active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-ring";
const formActionButtonClassName = "h-11 w-full rounded-full bg-aid-ink px-5 text-xs font-bold text-white transition-[transform,background-color] duration-300 hover:bg-aid-trust-blue active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-45 focus-ring";
const formSecondaryButtonClassName = "h-11 w-full rounded-full border border-aid-ink/10 bg-white px-5 text-xs font-bold text-aid-ink transition-[transform,background-color,border-color] duration-300 hover:border-aid-trust-blue/35 hover:bg-aid-paper active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-45 focus-ring";
const formCyanActionButtonClassName = "h-11 w-full rounded-full bg-aid-trust-blue px-5 text-xs font-bold text-white transition-[transform,background-color] duration-300 hover:bg-aid-ink active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-45 focus-ring";
const formAmberActionButtonClassName = "h-11 w-full rounded-full bg-aid-gold px-5 text-xs font-bold text-aid-ink transition-[transform,filter] duration-300 hover:brightness-95 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-45 focus-ring";
const redActionButtonClassName = "ml-auto h-9 w-fit rounded-full border border-aid-urgent-strong/25 bg-aid-urgent/10 px-4 text-[10px] font-bold text-aid-urgent-strong transition-[transform,background-color] duration-300 hover:bg-aid-urgent/15 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-ring";
const surfaceCardClassName = "relative space-y-4 overflow-hidden rounded-[1.5rem] border border-aid-ink/10 bg-white p-5 text-left shadow-[0_18px_45px_-38px_rgba(23,33,43,0.4)] sm:p-6";

const fieldHints: Record<string, string> = {
  "Campaign ID": "A random 64-character reference for one relief pool—never a beneficiary name.",
  "Token address": "The Stellar Testnet contract address for the asset funding this campaign.",
  "Funding amount": "How many campaign tokens to add. Confirm the amount again in your wallet.",
  "Merchant address": "The approved merchant's public Stellar wallet address beginning with G.",
  "Merchant profile hash": "A 64-character digest pointing to an off-chain merchant profile.",
  "Case ID": "An opaque case reference. Do not enter a family name, phone number, or document number.",
  "Case record hash": "A digest of the private off-chain case record; the record itself stays private.",
  "Voucher ID": "A unique 64-character reference used for issue, redemption, freeze, and decision steps.",
  "Purpose hash": "A digest describing the approved purpose without publishing private details.",
  "Voucher amount": "The token value reserved from the campaign for this voucher.",
  "Voucher category": "The allowed spending purpose: food, medicine, shelter, or another approved need.",
  "Initial evidence digest": "A digest of delivery evidence stored off-chain; never paste the receipt or photo itself.",
  "Evidence record ID": "An opaque pointer that authorized reviewers can match to the private evidence record.",
  "Evidence revision digest": "The one revised evidence digest allowed only after an admin freeze.",
  "Evidence revision record ID": "The opaque pointer for that single revised off-chain evidence record.",
  "Freeze reason digest": "A digest of the admin's off-chain dispute reason—not the reason text itself.",
  "Verifier decision reason digest": "A digest recording why the verifier approved or rejected the claim.",
};

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="block px-1 text-xs font-bold text-aid-ink">{label}</span>
      <span className="block px-1 text-[11px] leading-5 text-aid-slate">{fieldHints[label]}</span>
      {children}
    </label>
  );
}

function WorkspaceHeading({ icon: Icon, title, description, tone }: { icon: LucideIcon; title: string; description: ReactNode; tone: WorkspaceTone }) {
  const tones: Record<WorkspaceTone, string> = {
    teal: "border-aid-teal/30 bg-aid-teal/10 text-aid-trust-blue",
    emerald: "border-aid-success/45 bg-aid-success/15 text-aid-success-strong",
    amber: "border-aid-gold/55 bg-aid-gold/20 text-aid-ink",
    purple: "border-aid-trust-blue/25 bg-aid-trust-blue/10 text-aid-trust-blue",
  };

  return (
    <div className="flex gap-3">
      <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${tones[tone]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="space-y-1">
        <h3 className="font-display text-lg font-bold text-aid-ink">{title}</h3>
        <p className="text-xs leading-5 text-aid-slate">{description}</p>
      </div>
    </div>
  );
}

function AidModeCard({ mode, setMode }: Pick<AidWorkspaceCardsProps, "mode" | "setMode">) {
  return (
    <div className={surfaceCardClassName} data-testid="aid-card-mode">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-base font-bold text-aid-ink">Aid workspace mode</p>
          <p className="text-xs text-aid-slate">Use deterministic demo data or submit with an authorized Testnet role wallet.</p>
        </div>
        <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold ${mode === "demo" ? "border-aid-teal/30 bg-aid-teal/10 text-aid-ink" : "border-aid-gold/40 bg-aid-gold/20 text-aid-ink"}`}>
          {mode === "demo" ? "Demo" : "Testnet"}
        </span>
      </div>
      <SegmentedControl
        value={mode}
        onChange={setMode}
        options={[
          { label: "Local demo", value: "demo", color: "bg-aid-teal", activeTextClassName: "text-aid-ink" },
          { label: "Live Testnet", value: "live", color: "bg-aid-trust-blue", activeTextClassName: "text-white" },
        ]}
        idPrefix="aid-mode"
      />
      <div className="rounded-xl border border-aid-teal/30 bg-aid-teal/10 px-3 py-2.5 text-xs leading-relaxed text-aid-ink">
        Live Testnet requires authorized role wallets: admin and verifier authorities must be separate, and a verifier cannot approve their own merchant claim.
      </div>
    </div>
  );
}

function WalletStatusNotice({ isConnected, isMockWallet, isLoading, mode, pending }: Pick<AidWorkspaceCardsProps, "isConnected" | "isMockWallet" | "isLoading" | "mode" | "pending">) {
  const shouldShow = isLoading || pending || (mode === "live" && (!isConnected || isMockWallet));
  if (!shouldShow) return null;

  const needsWallet = mode === "live" && (!isConnected || isMockWallet);
  return (
    <div aria-live="polite" className={`rounded-xl border px-4 py-3 text-xs 2xl:col-span-2 ${needsWallet ? "border-aid-gold/40 bg-aid-gold/20 text-aid-ink" : "border-aid-teal/30 bg-aid-teal/10 text-aid-ink"}`}>
      {isLoading ? "Loading wallet state…" : pending ? `Pending submission: ${pending}…` : "Connect a real Testnet role wallet before submitting."}
    </div>
  );
}

function DemoAccountingCard({ available, reserved, paid, status, total }: Pick<AidWorkspaceCardsProps, "available" | "reserved" | "paid" | "status" | "total">) {
  return (
    <div className={surfaceCardClassName} data-testid="aid-card-accounting">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-aid-slate">Demo-only accounting</p>
          <p className="mt-1 text-xs text-aid-slate">Local state is never on-chain.</p>
        </div>
        <WalletCards className="h-5 w-5 text-aid-trust-blue" />
      </div>
      <div className="grid grid-cols-4 divide-x divide-aid-ink/10 text-center">
        <div><b className="font-mono text-sm text-aid-ink">{total.toFixed(2)}</b><p className="mt-1 text-[9px] text-aid-slate">Total</p></div>
        <div><b className="font-mono text-sm text-aid-success-strong">{available.toFixed(2)}</b><p className="mt-1 text-[9px] text-aid-slate">Available</p></div>
        <div><b className="font-mono text-sm text-aid-ink">{reserved.toFixed(2)}</b><p className="mt-1 text-[9px] text-aid-slate">Reserved</p></div>
        <div><b className="font-mono text-sm text-aid-trust-blue">{paid.toFixed(2)}</b><p className="mt-1 text-[9px] text-aid-slate">Paid</p></div>
      </div>
      <p className="rounded-lg bg-aid-paper px-3 py-2 text-xs text-aid-slate">
        Status: <span className="font-semibold text-aid-slate">{status}</span>. {total === 0 ? "Empty state: no demo funds yet." : "History and accounting are local demo state only."}
      </p>
    </div>
  );
}

function GuidedWalkthroughCard({ walkthrough, walkthroughCurrent, walkthroughNext, pending, startWalkthrough, advanceWalkthrough, resetDemo }: Pick<AidWorkspaceCardsProps, "walkthrough" | "walkthroughCurrent" | "walkthroughNext" | "pending" | "startWalkthrough" | "advanceWalkthrough" | "resetDemo">) {
  return (
    <div className={surfaceCardClassName} data-testid="aid-card-walkthrough">
      <WorkspaceHeading icon={ClipboardCheck} title="Guided walkthrough" description={<>Current: {walkthroughCurrent}. Next: {walkthroughNext}. History below records every validated transition.</>} tone="teal" />
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <button type="button" onClick={() => startWalkthrough("clean")} disabled={!!pending} className={formActionButtonClassName}>Start clean walkthrough</button>
        <button type="button" onClick={() => startWalkthrough("disputed")} disabled={!!pending} className={formAmberActionButtonClassName}>Start disputed walkthrough</button>
        <button type="button" onClick={advanceWalkthrough} disabled={!!pending || !walkthrough} className={formSecondaryButtonClassName}>Advance walkthrough</button>
        <button type="button" onClick={resetDemo} disabled={!!pending} className={formSecondaryButtonClassName}>Reset demo</button>
      </div>
    </div>
  );
}

function LiveCampaignSetupCard({ pending, liveDisabled, addTrustline, campaignId, setCampaignId, token, setToken, createLiveCampaign }: Pick<AidWorkspaceCardsProps, "pending" | "liveDisabled" | "addTrustline" | "campaignId" | "setCampaignId" | "token" | "setToken" | "createLiveCampaign">) {
  return (
    <div className={surfaceCardClassName} data-testid="aid-card-live-setup">
      <WorkspaceHeading icon={ShieldAlert} title="Live campaign setup" description="Add the AIDT Testnet trustline, then enter operator-only identifiers before submitting campaign administration actions." tone="teal" />
      <div className="space-y-3">
        <button type="button" disabled={!!pending || liveDisabled} onClick={addTrustline} className={formSecondaryButtonClassName}>Add AIDT Testnet trustline</button>
        <Field label="Campaign ID"><input aria-label="Campaign ID" placeholder="32-byte campaign ID hex" value={campaignId} onChange={(event) => setCampaignId(event.target.value)} className={inputClassName} /></Field>
        <Field label="Token address"><input aria-label="Token address" placeholder="Token contract address" value={token} onChange={(event) => setToken(event.target.value)} className={inputClassName} /></Field>
        <button type="button" disabled={!!pending || liveDisabled} onClick={createLiveCampaign} className={formSecondaryButtonClassName}>Create live campaign</button>
      </div>
    </div>
  );
}

function AdminBootstrapCard({ mode, pending, liveDisabled, fundAmount, setFundAmount, fund, merchant, setMerchant, merchantProfileHash, setMerchantProfileHash, caseId, setCaseId, caseRecordHash, setCaseRecordHash, voucherId, setVoucherId, purposeHash, setPurposeHash, voucherAmount, setVoucherAmount, category, setCategory, approve, createAidCase, issue }: Pick<AidWorkspaceCardsProps, "mode" | "pending" | "liveDisabled" | "fundAmount" | "setFundAmount" | "fund" | "merchant" | "setMerchant" | "merchantProfileHash" | "setMerchantProfileHash" | "caseId" | "setCaseId" | "caseRecordHash" | "setCaseRecordHash" | "voucherId" | "setVoucherId" | "purposeHash" | "setPurposeHash" | "voucherAmount" | "setVoucherAmount" | "category" | "setCategory" | "approve" | "createAidCase" | "issue">) {
  return (
    <section className={surfaceCardClassName} data-testid="aid-card-admin">
      <WorkspaceHeading icon={ShieldAlert} title="Admin bootstrap workspace" description="Fund a campaign, register operations, and reserve a category-limited voucher." tone="teal" />
      <div className="space-y-3">
        <Field label="Funding amount"><input aria-label="Funding amount" inputMode="decimal" value={fundAmount} onChange={(event) => setFundAmount(event.target.value)} className={inputClassName} /></Field>
        <button type="button" disabled={!!pending || liveDisabled} onClick={fund} className={formActionButtonClassName}>Fund campaign</button>
        {mode === "live" && (
          <>
            <Field label="Merchant address"><input aria-label="Merchant address" placeholder="Merchant address" value={merchant} onChange={(event) => setMerchant(event.target.value)} className={inputClassName} /></Field>
            <Field label="Merchant profile hash"><input aria-label="Merchant profile hash" placeholder="32-byte merchant profile hash hex" value={merchantProfileHash} onChange={(event) => setMerchantProfileHash(event.target.value)} className={inputClassName} /></Field>
            <Field label="Case ID"><input aria-label="Case ID" placeholder="32-byte case ID hex" value={caseId} onChange={(event) => setCaseId(event.target.value)} className={inputClassName} /></Field>
            <Field label="Case record hash"><input aria-label="Case record hash" placeholder="32-byte case record hash hex" value={caseRecordHash} onChange={(event) => setCaseRecordHash(event.target.value)} className={inputClassName} /></Field>
            <Field label="Voucher ID"><input aria-label="Voucher ID" placeholder="32-byte voucher ID hex" value={voucherId} onChange={(event) => setVoucherId(event.target.value)} className={inputClassName} /></Field>
            <Field label="Purpose hash"><input aria-label="Purpose hash" placeholder="32-byte voucher purpose hash hex" value={purposeHash} onChange={(event) => setPurposeHash(event.target.value)} className={inputClassName} /></Field>
          </>
        )}
        <button type="button" disabled={!!pending || liveDisabled} onClick={approve} className={formSecondaryButtonClassName}>Approve merchant</button>
        <button type="button" disabled={!!pending || liveDisabled} onClick={createAidCase} className={formSecondaryButtonClassName}>Create beneficiary case</button>
        <Field label="Voucher amount"><input aria-label="Voucher amount" inputMode="decimal" value={voucherAmount} onChange={(event) => setVoucherAmount(event.target.value)} className={inputClassName} /></Field>
        <Field label="Voucher category"><select aria-label="Voucher category" value={category} onChange={(event) => setCategory(event.target.value as VoucherCategory)} className={inputClassName}><option>Food</option><option>Medicine</option><option>Shelter</option><option>Other</option></select></Field>
        <button type="button" disabled={!!pending || liveDisabled} onClick={issue} className={formActionButtonClassName}>Issue voucher</button>
      </div>
    </section>
  );
}

function MerchantRedemptionCard({ mode, status, hasRevision, pending, liveDisabled, contentDigest, setContentDigest, evidenceRecordId, setEvidenceRecordId, redeem, revisionDigest, setRevisionDigest, revisionRecordId, setRevisionRecordId, appendRevision }: Pick<AidWorkspaceCardsProps, "mode" | "status" | "hasRevision" | "pending" | "liveDisabled" | "contentDigest" | "setContentDigest" | "evidenceRecordId" | "setEvidenceRecordId" | "redeem" | "revisionDigest" | "setRevisionDigest" | "revisionRecordId" | "setRevisionRecordId" | "appendRevision">) {
  return (
    <section className={surfaceCardClassName} data-testid="aid-card-merchant">
      <WorkspaceHeading icon={Store} title="Merchant redemption workspace" description="Submit opaque delivery evidence; one revision is permitted only after an admin freeze." tone="emerald" />
      <div className="space-y-3">
        <Field label="Initial evidence digest"><input aria-label="Initial evidence digest" placeholder="32-byte evidence[0] content digest" value={contentDigest} onChange={(event) => setContentDigest(event.target.value)} className={inputClassName} /></Field>
        <Field label="Evidence record ID"><input aria-label="Evidence record ID" placeholder="32-byte opaque evidence record ID" value={evidenceRecordId} onChange={(event) => setEvidenceRecordId(event.target.value)} className={inputClassName} /></Field>
        <button type="button" disabled={!!pending || liveDisabled} onClick={redeem} className={formCyanActionButtonClassName}>Redeem voucher with evidence[0]</button>
        <Field label="Evidence revision digest"><input aria-label="Evidence revision digest" placeholder="32-byte evidence[1] digest after freeze" value={revisionDigest} onChange={(event) => setRevisionDigest(event.target.value)} className={inputClassName} /></Field>
        <Field label="Evidence revision record ID"><input aria-label="Evidence revision record ID" placeholder="32-byte opaque revision record ID" value={revisionRecordId} onChange={(event) => setRevisionRecordId(event.target.value)} className={inputClassName} /></Field>
        <button type="button" disabled={!!pending || liveDisabled || (mode === "demo" && (status !== "frozen" || hasRevision))} onClick={appendRevision} className={formSecondaryButtonClassName}>Append exactly one evidence[1] after freeze</button>
      </div>
    </section>
  );
}

function FreezeClaimCard({ pending, liveDisabled, reasonHash, setReasonHash, freeze }: Pick<AidWorkspaceCardsProps, "pending" | "liveDisabled" | "reasonHash" | "setReasonHash" | "freeze">) {
  return (
    <section className={surfaceCardClassName} data-testid="aid-card-freeze">
      <WorkspaceHeading icon={ShieldAlert} title="Admin emergency-freeze control" description="Pause a disputed claim using only an opaque reason digest." tone="amber" />
      <div className="space-y-3">
        <Field label="Freeze reason digest"><input aria-label="Freeze reason digest" placeholder="32-byte reason digest only" value={reasonHash} onChange={(event) => setReasonHash(event.target.value)} className={inputClassName} /></Field>
        <button type="button" disabled={!!pending || liveDisabled} onClick={freeze} className={formAmberActionButtonClassName}>Admin freeze claim</button>
      </div>
    </section>
  );
}

function VerifierReviewCard({ pending, liveDisabled, decisionReasonHash, setDecisionReasonHash, decide }: Pick<AidWorkspaceCardsProps, "pending" | "liveDisabled" | "decisionReasonHash" | "setDecisionReasonHash" | "decide">) {
  return (
    <section className={surfaceCardClassName} data-testid="aid-card-verifier">
      <WorkspaceHeading icon={CheckCircle2} title="Verifier-only review panel" description="Verifier decisions expose only Approve or Reject. Freeze is an admin control, not a verifier decision." tone="purple" />
      <div className="space-y-3">
        <Field label="Verifier decision reason digest"><input aria-label="Verifier decision reason digest" placeholder="32-byte verifier reason digest" value={decisionReasonHash} onChange={(event) => setDecisionReasonHash(event.target.value)} className={inputClassName} /></Field>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <button type="button" disabled={!!pending || liveDisabled} onClick={() => decide(ClaimDecision.Approve)} className={primaryButtonClassName}>Verifier approve / atomic payout</button>
          <button type="button" disabled={!!pending || liveDisabled} onClick={() => decide(ClaimDecision.Reject)} className={redActionButtonClassName}>Verifier reject / release reservation</button>
        </div>
      </div>
    </section>
  );
}

function FeedbackAndHistory({ message, error, history }: Pick<AidWorkspaceCardsProps, "message" | "error" | "history">) {
  return (
    <div className="grid gap-5 2xl:grid-cols-[0.8fr_1.2fr]">
      <div aria-live="polite" className="space-y-3">
        {message && <div className="rounded-xl border border-aid-success-strong/20 bg-aid-success/20 px-4 py-3 text-xs leading-relaxed text-aid-success-strong">{message}</div>}
        {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-relaxed text-red-700">Recoverable error: {error}</div>}
      </div>
      <div className={surfaceCardClassName} data-testid="aid-card-history">
        <p className="text-xs font-bold uppercase tracking-wider text-aid-slate">Visible state/history</p>
        {history.length === 0 ? <p className="text-sm text-aid-slate">No local demo activity yet.</p> : <ul className="space-y-1.5 text-sm text-aid-slate">{history.map((entry) => <li key={entry} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-aid-teal" />{entry}</li>)}</ul>}
      </div>
    </div>
  );
}

export default function AidWorkspaceCards(props: AidWorkspaceCardsProps) {
  const { mode, setMode, isConnected, isMockWallet, isLoading, pending, available, reserved, paid, total, status, hasRevision, walkthrough, walkthroughCurrent, walkthroughNext, startWalkthrough, advanceWalkthrough, resetDemo, fundAmount, setFundAmount, fund, campaignId, setCampaignId, token, setToken, addTrustline, createLiveCampaign, liveDisabled, merchant, setMerchant, merchantProfileHash, setMerchantProfileHash, caseId, setCaseId, caseRecordHash, setCaseRecordHash, voucherId, setVoucherId, purposeHash, setPurposeHash, approve, createAidCase, voucherAmount, setVoucherAmount, category, setCategory, issue, contentDigest, setContentDigest, evidenceRecordId, setEvidenceRecordId, redeem, revisionDigest, setRevisionDigest, revisionRecordId, setRevisionRecordId, appendRevision, reasonHash, setReasonHash, freeze, decisionReasonHash, setDecisionReasonHash, decide, message, error, history } = props;

  return (
    <>
      <div className="grid gap-5 2xl:grid-cols-2" data-testid="aid-workspace-cards">
        <AidModeCard mode={mode} setMode={setMode} />
        <WalletStatusNotice isConnected={isConnected} isMockWallet={isMockWallet} isLoading={isLoading} mode={mode} pending={pending} />
        <DemoAccountingCard available={available} reserved={reserved} paid={paid} status={status} total={total} />
      </div>

      <GuidedWalkthroughCard walkthrough={walkthrough} walkthroughCurrent={walkthroughCurrent} walkthroughNext={walkthroughNext} pending={pending} startWalkthrough={startWalkthrough} advanceWalkthrough={advanceWalkthrough} resetDemo={resetDemo} />
      <p className="px-1 text-xs leading-relaxed text-aid-slate">Privacy: enter only 32-byte digests and opaque IDs. No raw evidence or beneficiary personal data.</p>

      {mode === "live" && <LiveCampaignSetupCard pending={pending} liveDisabled={liveDisabled} addTrustline={addTrustline} campaignId={campaignId} setCampaignId={setCampaignId} token={token} setToken={setToken} createLiveCampaign={createLiveCampaign} />}

      <div className="grid gap-5 2xl:grid-cols-2 2xl:items-start">
        <AdminBootstrapCard mode={mode} pending={pending} liveDisabled={liveDisabled} fundAmount={fundAmount} setFundAmount={setFundAmount} fund={fund} merchant={merchant} setMerchant={setMerchant} merchantProfileHash={merchantProfileHash} setMerchantProfileHash={setMerchantProfileHash} caseId={caseId} setCaseId={setCaseId} caseRecordHash={caseRecordHash} setCaseRecordHash={setCaseRecordHash} voucherId={voucherId} setVoucherId={setVoucherId} purposeHash={purposeHash} setPurposeHash={setPurposeHash} voucherAmount={voucherAmount} setVoucherAmount={setVoucherAmount} category={category} setCategory={setCategory} approve={approve} createAidCase={createAidCase} issue={issue} />
        <MerchantRedemptionCard mode={mode} status={status} hasRevision={hasRevision} pending={pending} liveDisabled={liveDisabled} contentDigest={contentDigest} setContentDigest={setContentDigest} evidenceRecordId={evidenceRecordId} setEvidenceRecordId={setEvidenceRecordId} redeem={redeem} revisionDigest={revisionDigest} setRevisionDigest={setRevisionDigest} revisionRecordId={revisionRecordId} setRevisionRecordId={setRevisionRecordId} appendRevision={appendRevision} />
        <FreezeClaimCard pending={pending} liveDisabled={liveDisabled} reasonHash={reasonHash} setReasonHash={setReasonHash} freeze={freeze} />
        <VerifierReviewCard pending={pending} liveDisabled={liveDisabled} decisionReasonHash={decisionReasonHash} setDecisionReasonHash={setDecisionReasonHash} decide={decide} />
      </div>

      <FeedbackAndHistory message={message} error={error} history={history} />
    </>
  );
}
