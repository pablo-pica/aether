"use client";

import React, { useMemo, useState } from "react";
import { CheckCircle2, ClipboardCheck, HandHeart, ShieldAlert, Store, WalletCards } from "lucide-react";
import { ClaimDecision } from "@/hooks/useStellarWallet";
import { applyDemoAction, bootstrapIssuedDemo, emptyDemoState } from "./aidDemoState";
import type { DemoState, DemoStatus } from "./aidDemoState";
import type { AidRole } from "./app-shell/appShellContent";
import SegmentedControl from "./ui/SegmentedControl";

export type AidMode = "demo" | "live";
export type VoucherCategory = "Food" | "Medicine" | "Shelter" | "Other";

interface AidTabProps {
  isConnected: boolean;
  isMockWallet: boolean;
  address: string | null;
  isLoading: boolean;
  createCampaign: (input: { campaignId: string; token: string }) => Promise<any>;
  fundCampaign: (input: { campaignId: string; amount: string }) => Promise<any>;
  approveMerchant: (input: { merchant: string; profileHash: string }) => Promise<any>;
  createCase: (input: { campaignId: string; caseId: string; caseRecordHash: string }) => Promise<any>;
  issueVoucher: (input: { voucherId: string; campaignId: string; caseId: string; merchant: string; amount: string; category: VoucherCategory; purposeHash: string; expiresAt: number }) => Promise<any>;
  redeemVoucher: (input: { voucherId: string; contentDigest: string; evidenceRecordId: string }) => Promise<any>;
  appendEvidenceRevision: (input: { voucherId: string; contentDigest: string; evidenceRecordId: string }) => Promise<any>;
  freezeClaim: (input: { voucherId: string; reasonHash: string }) => Promise<any>;
  decideClaim: (input: { voucherId: string; decision: ClaimDecision; reasonHash: string }) => Promise<any>;
  addAidTrustline: () => Promise<any>;
  activeRole?: AidRole | null;
}

const DEMO_CAMPAIGN_ID = "a".repeat(64);
const DEMO_CASE_ID = "b".repeat(64);
const DEMO_VOUCHER_ID = "c".repeat(64);
const DEMO_MERCHANT = "GDEMOAIDMERCHANT000000000000000000000000000000000000000000";

const inputClassName = "h-12 w-full rounded-2xl border border-aid-ink/10 bg-aid-paper/55 px-4 text-sm text-aid-ink outline-none transition-[border-color,background-color,box-shadow] duration-300 placeholder:text-aid-slate/55 hover:bg-white focus:border-aid-trust-blue focus:bg-white focus-ring";
const secondaryButtonClassName = "ml-auto h-9 w-fit rounded-full border border-aid-ink/10 bg-white px-4 text-[10px] font-bold text-aid-slate transition-[transform,background-color,border-color] duration-300 hover:border-aid-trust-blue/35 hover:bg-aid-paper active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-ring";
const primaryButtonClassName = "ml-auto h-9 w-fit rounded-full bg-aid-trust-blue px-4 text-[10px] font-bold text-white transition-[transform,background-color] duration-300 hover:bg-aid-ink active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-ring";
const amberActionButtonClassName = "ml-auto h-9 w-fit rounded-full bg-aid-gold px-4 text-[10px] font-bold text-aid-ink transition-[transform,filter] duration-300 hover:brightness-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-ring";
const cyanActionButtonClassName = "ml-auto h-9 w-fit rounded-full bg-aid-trust-blue px-4 text-[10px] font-bold text-white transition-[transform,background-color] duration-300 hover:bg-aid-ink active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-ring";
const redActionButtonClassName = "ml-auto h-9 w-fit rounded-full border border-aid-urgent-strong/25 bg-aid-urgent/10 px-4 text-[10px] font-bold text-aid-urgent-strong transition-[transform,background-color] duration-300 hover:bg-aid-urgent/15 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-ring";
const formActionButtonClassName = "h-11 w-full rounded-full bg-aid-ink px-5 text-xs font-bold text-white transition-[transform,background-color] duration-300 hover:bg-aid-trust-blue active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-45 focus-ring";
const formSecondaryButtonClassName = "h-11 w-full rounded-full border border-aid-ink/10 bg-white px-5 text-xs font-bold text-aid-ink transition-[transform,background-color,border-color] duration-300 hover:border-aid-trust-blue/35 hover:bg-aid-paper active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-45 focus-ring";
const formCyanActionButtonClassName = "h-11 w-full rounded-full bg-aid-trust-blue px-5 text-xs font-bold text-white transition-[transform,background-color] duration-300 hover:bg-aid-ink active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-45 focus-ring";
const surfaceCardClassName = "relative space-y-4 overflow-hidden rounded-[1.5rem] border border-aid-ink/10 bg-white p-5 text-left shadow-[0_18px_45px_-38px_rgba(23,33,43,0.4)] sm:p-6";
const formAmberActionButtonClassName = "h-11 w-full rounded-full bg-aid-gold px-5 text-xs font-bold text-aid-ink transition-[transform,filter] duration-300 hover:brightness-95 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-45 focus-ring";

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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="block px-1 text-xs font-bold text-aid-ink">{label}</span>
      <span className="block px-1 text-[11px] leading-5 text-aid-slate">{fieldHints[label]}</span>
      {children}
    </label>
  );
}

function WorkspaceHeading({ icon: Icon, title, description, tone }: { icon: typeof Store; title: string; description: React.ReactNode; tone: "teal" | "emerald" | "amber" | "purple" }) {
  const tones = {
    teal: "border-aid-teal/30 bg-aid-teal/10 text-aid-trust-blue",
    emerald: "border-aid-success/45 bg-aid-success/15 text-aid-success-strong",
    amber: "border-aid-gold/55 bg-aid-gold/20 text-aid-ink",
    purple: "border-aid-trust-blue/25 bg-aid-trust-blue/10 text-aid-trust-blue",
  };
  return <div className="flex gap-3"><div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${tones[tone]}`}><Icon className="h-4 w-4" /></div><div className="space-y-1"><h3 className="font-display text-lg font-bold text-aid-ink">{title}</h3><p className="text-xs leading-5 text-aid-slate">{description}</p></div></div>;
}

export default function AidTab(props: AidTabProps) {
  const { isConnected, isMockWallet, address, isLoading, createCampaign, fundCampaign, approveMerchant, createCase, issueVoucher, redeemVoucher, appendEvidenceRevision, freezeClaim, decideClaim, addAidTrustline, activeRole } = props;
  const [mode, setMode] = useState<AidMode>("demo");
  const [available, setAvailable] = useState(0);
  const [reserved, setReserved] = useState(0);
  const [paid, setPaid] = useState(0);
  const [status, setStatus] = useState<DemoStatus>("empty");
  const [history, setHistory] = useState<string[]>([]);
  const [message, setMessage] = useState("Demo starts empty: fund/issue, redeem evidence[0], then approve or dispute.");
  const [error, setError] = useState("");
  const [pending, setPending] = useState("");
  const [fundAmount, setFundAmount] = useState("100");
  const [campaignId, setCampaignId] = useState("");
  const [token, setToken] = useState("");
  const [merchant, setMerchant] = useState("");
  const [merchantProfileHash, setMerchantProfileHash] = useState("");
  const [caseId, setCaseId] = useState("");
  const [caseRecordHash, setCaseRecordHash] = useState("");
  const [voucherId, setVoucherId] = useState("");
  const [purposeHash, setPurposeHash] = useState("");
  const [voucherAmount, setVoucherAmount] = useState("25");
  const [category, setCategory] = useState<VoucherCategory>("Food");
  const [contentDigest, setContentDigest] = useState("");
  const [evidenceRecordId, setEvidenceRecordId] = useState("");
  const [revisionDigest, setRevisionDigest] = useState("");
  const [revisionRecordId, setRevisionRecordId] = useState("");
  const [reasonHash, setReasonHash] = useState("");
  const [decisionReasonHash, setDecisionReasonHash] = useState("");
  const [hasRevision, setHasRevision] = useState(false);
  const [walkthrough, setWalkthrough] = useState<{ name: "clean" | "disputed"; step: number } | null>(null);
  const total = useMemo(() => available + reserved + paid, [available, reserved, paid]);
  const liveDisabled = mode === "live" && (!isConnected || isLoading || isMockWallet);
  const demoState = (): DemoState => ({ available, reserved, paid, status, hasRevision, history });
  const setDemoState = (state: DemoState) => { setAvailable(state.available); setReserved(state.reserved); setPaid(state.paid); setStatus(state.status); setHasRevision(state.hasRevision); setHistory(state.history); };
  const applyLocalDemoAction = (action: Parameters<typeof applyDemoAction>[1]) => setDemoState(applyDemoAction(demoState(), action));
  const run = async (label: string, fn: () => Promise<void>) => { setError(""); setPending(label); try { await fn(); } catch (e: any) { setError(e.message || String(e)); } finally { setPending(""); } };
  const resetDemo = () => { setDemoState(emptyDemoState()); setWalkthrough(null); setMessage("Local demo reset. No on-chain transaction was sent."); };
  const fund = () => run("Funding campaign", async () => { const amount = Number(fundAmount); if (mode === "demo") { setWalkthrough(null); applyLocalDemoAction({ type: "fund", amount }); setMessage(`Local demo funded ${amount.toFixed(2)} units. Never on-chain.`); return; } if (!Number.isFinite(amount) || amount <= 0) throw new Error("Enter a positive funding amount."); if (!campaignId) throw new Error("Live mode requires the existing campaign ID to fund."); const res = await fundCampaign({ campaignId, amount: fundAmount }); setMessage(`Live Testnet campaign funding submitted: ${res?.hash || "pending hash"}. Await wallet/RPC confirmation; local accounting is not live state.`); });
  const addTrustline = () => run("Adding AIDT trustline", async () => { const res = await addAidTrustline(); setMessage(`AIDT Testnet trustline submitted: ${res?.hash || "pending hash"}.`); });
  const createLiveCampaign = () => run("Creating campaign", async () => { if (!campaignId || !token) throw new Error("Live mode requires campaign ID and token contract address from the operator."); const res = await createCampaign({ campaignId, token }); setMessage(`Live Testnet campaign creation submitted: ${res?.hash || "pending hash"}.`); });
  const approve = () => run("Approving merchant", async () => { if (mode === "demo") { setMerchant(DEMO_MERCHANT); setMessage("Local demo merchant approved using a demo address. Never on-chain."); return; } if (!merchant || !merchantProfileHash) throw new Error("Live mode requires merchant address and merchant profile hash."); const res = await approveMerchant({ merchant, profileHash: merchantProfileHash }); setMessage(`Live Testnet merchant approval submitted: ${res?.hash || "pending hash"}`); });
  const createAidCase = () => run("Creating beneficiary case", async () => { if (mode === "demo") { setMessage("Local demo case created with opaque IDs only. No personal data and never on-chain."); return; } if (!campaignId || !caseId || !caseRecordHash) throw new Error("Live mode requires campaign ID, case ID, and case record hash."); const res = await createCase({ campaignId, caseId, caseRecordHash }); setMessage(`Live Testnet case creation submitted: ${res?.hash || "pending hash"}`); });
  const issue = () => run("Issuing voucher", async () => { const amount = Number(voucherAmount); if (mode === "demo") { setWalkthrough(null); applyLocalDemoAction({ type: "issue", amount, category }); setMessage(`Local demo voucher reserved ${amount.toFixed(2)} units for ${category}. Never on-chain.`); return; } if (!Number.isFinite(amount) || amount <= 0) throw new Error("Enter a positive voucher amount."); if (!voucherId || !campaignId || !caseId || !merchant || !purposeHash) throw new Error("Live mode requires voucher ID, campaign ID, case ID, merchant address, and purpose hash."); const res = await issueVoucher({ voucherId, campaignId, caseId, merchant, amount: voucherAmount, category, purposeHash, expiresAt: Math.floor(Date.now() / 1000) + 604800 }); setMessage(`Live Testnet voucher issuance submitted: ${res?.hash || "pending hash"}.`); });
  const redeem = () => run("Redeeming voucher", async () => { if (mode === "demo") { setWalkthrough(null); applyLocalDemoAction({ type: "redeem" }); setMessage("Local demo merchant redemption recorded with evidence[0] digest and opaque record ID. Never on-chain."); return; } if (!voucherId || !contentDigest || !evidenceRecordId) throw new Error("Live mode requires voucher ID, initial evidence digest, and opaque evidence record ID."); const res = await redeemVoucher({ voucherId, contentDigest, evidenceRecordId }); setMessage(`Live Testnet redemption submitted: ${res?.hash || "pending hash"}.`); });
  const freeze = () => run("Freezing claim", async () => { if (mode === "demo") { setWalkthrough(null); applyLocalDemoAction({ type: "freeze" }); setMessage("Local demo admin freeze recorded with reason digest only. Never on-chain."); return; } if (!voucherId || !reasonHash) throw new Error("Live mode requires voucher ID and admin freeze reason digest."); const res = await freezeClaim({ voucherId, reasonHash }); setMessage(`Live Testnet freeze submitted: ${res?.hash || "pending hash"}.`); });
  const appendRevision = () => run("Appending evidence revision", async () => { if (mode === "demo") { setWalkthrough(null); applyLocalDemoAction({ type: "appendRevision" }); setMessage("Local demo merchant evidence[1] appended after freeze. Never on-chain."); return; } if (!voucherId || !revisionDigest || !revisionRecordId) throw new Error("Live mode requires voucher ID, revision digest, and opaque revision record ID."); const res = await appendEvidenceRevision({ voucherId, contentDigest: revisionDigest, evidenceRecordId: revisionRecordId }); setMessage(`Live Testnet evidence revision submitted: ${res?.hash || "pending hash"}.`); });
  const decide = (decision: ClaimDecision) => run(decision === ClaimDecision.Approve ? "Approving claim" : "Rejecting claim", async () => { if (mode === "demo") { setWalkthrough(null); applyLocalDemoAction({ type: "decide", decision: decision === ClaimDecision.Approve ? "Approve" : "Reject" }); setMessage(decision === ClaimDecision.Approve ? "Clean local demo paid: verifier approved atomic payout. Never on-chain." : "Disputed local demo rejected: reservation released to available, no payout. Never on-chain."); return; } if (!voucherId || !decisionReasonHash) throw new Error("Live mode requires voucher ID and verifier decision reason digest."); const res = await decideClaim({ voucherId, decision, reasonHash: decisionReasonHash }); setMessage(`Live Testnet verifier ${decision.toLowerCase()} submitted: ${res?.hash || "pending hash"}.`); });
  const startWalkthrough = (name: "clean" | "disputed") => run(`Starting ${name} walkthrough`, async () => { setDemoState(bootstrapIssuedDemo(25)); setWalkthrough({ name, step: 0 }); setMessage(`${name === "clean" ? "Clean" : "Disputed"} walkthrough started at Issued with 25 reserved. Use Advance walkthrough to execute each validated transition.`); });
  const advanceWalkthrough = () => run("Advancing walkthrough", async () => { if (!walkthrough) throw new Error("Start a clean or disputed walkthrough first."); const steps = walkthrough.name === "clean" ? [{ type: "redeem" as const }, { type: "decide" as const, decision: "Approve" as const }] : [{ type: "redeem" as const }, { type: "freeze" as const }, { type: "appendRevision" as const }, { type: "decide" as const, decision: "Reject" as const }]; const action = steps[walkthrough.step]; if (!action) throw new Error("Walkthrough is already complete. Reset or start another walkthrough."); setDemoState(applyDemoAction(demoState(), action)); const nextStep = walkthrough.step + 1; setWalkthrough(nextStep >= steps.length ? null : { ...walkthrough, step: nextStep }); setMessage(nextStep >= steps.length ? `${walkthrough.name === "clean" ? "Clean" : "Disputed"} walkthrough complete.` : `Advanced step ${nextStep}; next: ${walkthrough.name === "clean" ? "Paid (verifier approval)" : ["Frozen (admin)", "evidence[1]", "Rejected (verifier)"][nextStep - 1]}.`); });
  const walkthroughCurrent = walkthrough ? (walkthrough.step === 0 ? "Issued" : walkthrough.name === "clean" ? "Redeemed/evidence[0]" : ["Redeemed/evidence[0]", "Frozen (admin)", "evidence[1]"][walkthrough.step - 1]) : "None";
  const walkthroughNext = walkthrough ? (walkthrough.name === "clean" ? ["Redeemed/evidence[0]", "Paid (verifier approval)"][walkthrough.step] : ["Redeemed/evidence[0]", "Frozen (admin)", "evidence[1]", "Rejected (verifier)"][walkthrough.step]) : "Start a walkthrough";
  const workspaceOrder = activeRole === "merchant"
    ? { admin: "xl:order-2", merchant: "xl:order-1", freeze: "xl:order-3", verifier: "xl:order-4" }
    : activeRole === "verifier"
      ? { admin: "xl:order-3", merchant: "xl:order-2", freeze: "xl:order-4", verifier: "xl:order-1" }
      : { admin: "xl:order-1", merchant: "xl:order-2", freeze: "xl:order-3", verifier: "xl:order-4" };

  return (
    <section className="space-y-6" data-testid="aid-tab-root" data-active-role={activeRole || "unselected"}>
      <header className="space-y-2 border-b border-aid-ink/10 px-1 pb-5">
        <div className="flex items-center gap-2"><HandHeart className="h-5 w-5 text-aid-trust-blue" /><h2 className="text-2xl font-bold font-display text-aid-ink">Aid operations</h2></div>
        <p className="text-sm leading-6 text-aid-slate">Fund campaigns, administer private vouchers, and review verified delivery without exposing beneficiary data. {activeRole ? `The ${activeRole} guide is active; every supported tool remains visible.` : "Choose a role above for contextual guidance."}</p>
      </header>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <div className={surfaceCardClassName}>
        <div className="flex items-start justify-between gap-4"><div className="space-y-1"><p className="text-base font-bold text-aid-ink">Aid workspace mode</p><p className="text-xs text-aid-slate">Use deterministic demo data or submit with an authorized Testnet role wallet.</p></div><span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold ${mode === "demo" ? "border-aid-teal/30 bg-aid-teal/10 text-aid-ink" : "border-aid-gold/40 bg-aid-gold/20 text-aid-ink"}`}>{mode === "demo" ? "Demo" : "Testnet"}</span></div>
        <SegmentedControl value={mode} onChange={setMode} options={[{ label: "Local demo", value: "demo", color: "bg-aid-teal", activeTextClassName: "text-aid-ink" }, { label: "Live Testnet", value: "live", color: "bg-aid-trust-blue", activeTextClassName: "text-white" }]} idPrefix="aid-mode" />
        <div className="rounded-xl border border-aid-teal/30 bg-aid-teal/10 px-3 py-2.5 text-xs leading-relaxed text-aid-ink">Live Testnet requires authorized role wallets: admin and verifier authorities must be separate, and a verifier cannot approve their own merchant claim.</div>
      </div>

      {(isLoading || pending || (mode === "live" && (!isConnected || isMockWallet))) && <div aria-live="polite" className={`rounded-xl border px-4 py-3 text-xs xl:col-span-2 ${mode === "live" && (!isConnected || isMockWallet) ? "border-aid-gold/40 bg-aid-gold/20 text-aid-ink" : "border-aid-teal/30 bg-aid-teal/10 text-aid-ink"}`}>{isLoading ? "Loading wallet state…" : pending ? `Pending submission: ${pending}…` : "Connect a real Testnet role wallet before submitting."}</div>}

      <div className={surfaceCardClassName}>
        <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-aid-slate">Demo-only accounting</p><p className="mt-1 text-xs text-aid-slate">Local state is never on-chain.</p></div><WalletCards className="h-5 w-5 text-aid-trust-blue" /></div>
        <div className="grid grid-cols-4 divide-x divide-aid-ink/10 text-center"><div><b className="font-mono text-sm text-aid-ink">{total.toFixed(2)}</b><p className="mt-1 text-[9px] text-aid-slate">Total</p></div><div><b className="font-mono text-sm text-aid-success-strong">{available.toFixed(2)}</b><p className="mt-1 text-[9px] text-aid-slate">Available</p></div><div><b className="font-mono text-sm text-aid-ink">{reserved.toFixed(2)}</b><p className="mt-1 text-[9px] text-aid-slate">Reserved</p></div><div><b className="font-mono text-sm text-aid-trust-blue">{paid.toFixed(2)}</b><p className="mt-1 text-[9px] text-aid-slate">Paid</p></div></div>
        <p className="rounded-lg bg-aid-paper px-3 py-2 text-xs text-aid-slate">Status: <span className="font-semibold text-aid-slate">{status}</span>. {total === 0 ? "Empty state: no demo funds yet." : "History and accounting are local demo state only."}</p>
      </div>
      </div>

      <div className={surfaceCardClassName}>
        <WorkspaceHeading icon={ClipboardCheck} title="Guided walkthrough" description={<>Current: {walkthroughCurrent}. Next: {walkthroughNext}. History below records every validated transition.</>} tone="teal" />
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2"><button type="button" onClick={() => startWalkthrough("clean")} disabled={!!pending} className={formActionButtonClassName}>Start clean walkthrough</button><button type="button" onClick={() => startWalkthrough("disputed")} disabled={!!pending} className={formAmberActionButtonClassName}>Start disputed walkthrough</button><button type="button" onClick={advanceWalkthrough} disabled={!!pending || !walkthrough} className={formSecondaryButtonClassName}>Advance walkthrough</button><button type="button" onClick={resetDemo} disabled={!!pending} className={formSecondaryButtonClassName}>Reset demo</button></div>
      </div>

      <p className="px-1 text-xs leading-relaxed text-aid-slate">Privacy: enter only 32-byte digests and opaque IDs. No raw evidence or beneficiary personal data.</p>

      {mode === "live" && <div className={surfaceCardClassName}><WorkspaceHeading icon={ShieldAlert} title="Live campaign setup" description="Add the AIDT Testnet trustline, then enter operator-only identifiers before submitting campaign administration actions." tone="teal" /><div className="space-y-3"><button type="button" disabled={!!pending || liveDisabled} onClick={addTrustline} className={formSecondaryButtonClassName}>Add AIDT Testnet trustline</button><Field label="Campaign ID"><input aria-label="Campaign ID" placeholder="32-byte campaign ID hex" value={campaignId} onChange={(e) => setCampaignId(e.target.value)} className={inputClassName} /></Field><Field label="Token address"><input aria-label="Token address" placeholder="Token contract address" value={token} onChange={(e) => setToken(e.target.value)} className={inputClassName} /></Field><button type="button" disabled={!!pending || liveDisabled} onClick={createLiveCampaign} className={formSecondaryButtonClassName}>Create live campaign</button></div></div>}

      <div className="grid gap-5 xl:grid-cols-12 xl:items-start">
      <section className={`${surfaceCardClassName} xl:col-span-7 ${workspaceOrder.admin}`}><WorkspaceHeading icon={ShieldAlert} title="Admin bootstrap workspace" description="Fund a campaign, register operations, and reserve a category-limited voucher." tone="teal" /><div className="space-y-3"><Field label="Funding amount"><input aria-label="Funding amount" inputMode="decimal" value={fundAmount} onChange={(e) => setFundAmount(e.target.value)} className={inputClassName} /></Field><button type="button" disabled={!!pending || liveDisabled} onClick={fund} className={formActionButtonClassName}>Fund campaign</button>{mode === "live" && <><Field label="Merchant address"><input aria-label="Merchant address" placeholder="Merchant address" value={merchant} onChange={(e) => setMerchant(e.target.value)} className={inputClassName} /></Field><Field label="Merchant profile hash"><input aria-label="Merchant profile hash" placeholder="32-byte merchant profile hash hex" value={merchantProfileHash} onChange={(e) => setMerchantProfileHash(e.target.value)} className={inputClassName} /></Field><Field label="Case ID"><input aria-label="Case ID" placeholder="32-byte case ID hex" value={caseId} onChange={(e) => setCaseId(e.target.value)} className={inputClassName} /></Field><Field label="Case record hash"><input aria-label="Case record hash" placeholder="32-byte case record hash hex" value={caseRecordHash} onChange={(e) => setCaseRecordHash(e.target.value)} className={inputClassName} /></Field><Field label="Voucher ID"><input aria-label="Voucher ID" placeholder="32-byte voucher ID hex" value={voucherId} onChange={(e) => setVoucherId(e.target.value)} className={inputClassName} /></Field><Field label="Purpose hash"><input aria-label="Purpose hash" placeholder="32-byte voucher purpose hash hex" value={purposeHash} onChange={(e) => setPurposeHash(e.target.value)} className={inputClassName} /></Field></>}<button type="button" disabled={!!pending || liveDisabled} onClick={approve} className={formSecondaryButtonClassName}>Approve merchant</button><button type="button" disabled={!!pending || liveDisabled} onClick={createAidCase} className={formSecondaryButtonClassName}>Create beneficiary case</button><Field label="Voucher amount"><input aria-label="Voucher amount" inputMode="decimal" value={voucherAmount} onChange={(e) => setVoucherAmount(e.target.value)} className={inputClassName} /></Field><Field label="Voucher category"><select aria-label="Voucher category" value={category} onChange={(e) => setCategory(e.target.value as VoucherCategory)} className={inputClassName}><option>Food</option><option>Medicine</option><option>Shelter</option><option>Other</option></select></Field><button type="button" disabled={!!pending || liveDisabled} onClick={issue} className={formActionButtonClassName}>Issue voucher</button></div></section>

      <section className={`${surfaceCardClassName} xl:col-span-5 ${workspaceOrder.merchant}`}><WorkspaceHeading icon={Store} title="Merchant redemption workspace" description="Submit opaque delivery evidence; one revision is permitted only after an admin freeze." tone="emerald" /><div className="space-y-3"><Field label="Initial evidence digest"><input aria-label="Initial evidence digest" placeholder="32-byte evidence[0] content digest" value={contentDigest} onChange={(e) => setContentDigest(e.target.value)} className={inputClassName} /></Field><Field label="Evidence record ID"><input aria-label="Evidence record ID" placeholder="32-byte opaque evidence record ID" value={evidenceRecordId} onChange={(e) => setEvidenceRecordId(e.target.value)} className={inputClassName} /></Field><button type="button" disabled={!!pending || liveDisabled} onClick={redeem} className={formCyanActionButtonClassName}>Redeem voucher with evidence[0]</button><Field label="Evidence revision digest"><input aria-label="Evidence revision digest" placeholder="32-byte evidence[1] digest after freeze" value={revisionDigest} onChange={(e) => setRevisionDigest(e.target.value)} className={inputClassName} /></Field><Field label="Evidence revision record ID"><input aria-label="Evidence revision record ID" placeholder="32-byte opaque revision record ID" value={revisionRecordId} onChange={(e) => setRevisionRecordId(e.target.value)} className={inputClassName} /></Field><button type="button" disabled={!!pending || liveDisabled || (mode === "demo" && (status !== "frozen" || hasRevision))} onClick={appendRevision} className={formSecondaryButtonClassName}>Append exactly one evidence[1] after freeze</button></div></section>

      <section className={`${surfaceCardClassName} xl:col-span-5 ${workspaceOrder.freeze}`}><WorkspaceHeading icon={ShieldAlert} title="Admin emergency-freeze control" description="Pause a disputed claim using only an opaque reason digest." tone="amber" /><div className="space-y-3"><Field label="Freeze reason digest"><input aria-label="Freeze reason digest" placeholder="32-byte reason digest only" value={reasonHash} onChange={(e) => setReasonHash(e.target.value)} className={inputClassName} /></Field><button type="button" disabled={!!pending || liveDisabled} onClick={freeze} className={formAmberActionButtonClassName}>Admin freeze claim</button></div></section>

      <section className={`${surfaceCardClassName} xl:col-span-7 ${workspaceOrder.verifier}`}><WorkspaceHeading icon={CheckCircle2} title="Verifier-only review panel" description="Verifier decisions expose only Approve or Reject. Freeze is an admin control, not a verifier decision." tone="purple" /><div className="space-y-3"><Field label="Verifier decision reason digest"><input aria-label="Verifier decision reason digest" placeholder="32-byte verifier reason digest" value={decisionReasonHash} onChange={(e) => setDecisionReasonHash(e.target.value)} className={inputClassName} /></Field><div className="grid grid-cols-1 gap-2 sm:grid-cols-2"><button type="button" disabled={!!pending || liveDisabled} onClick={() => decide(ClaimDecision.Approve)} className={primaryButtonClassName}>Verifier approve / atomic payout</button><button type="button" disabled={!!pending || liveDisabled} onClick={() => decide(ClaimDecision.Reject)} className={redActionButtonClassName}>Verifier reject / release reservation</button></div></div></section>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
      <div aria-live="polite" className="space-y-3">{message && <div className="rounded-xl border border-aid-success-strong/20 bg-aid-success/20 px-4 py-3 text-xs leading-relaxed text-aid-success-strong">{message}</div>}{error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs leading-relaxed text-red-700">Recoverable error: {error}</div>}</div>
      <div className={surfaceCardClassName}><p className="text-xs font-bold uppercase tracking-wider text-aid-slate">Visible state/history</p>{history.length === 0 ? <p className="text-sm text-aid-slate">No local demo activity yet.</p> : <ul className="space-y-1.5 text-sm text-aid-slate">{history.map((entry) => <li key={entry} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-aid-teal" />{entry}</li>)}</ul>}</div>
      </div>
      <p className="px-1 text-[11px] leading-relaxed text-aid-slate">Mode: {mode === "demo" ? "deterministic local demo — never on-chain" : `Live Testnet using ${address || "no wallet"}`}. Demo IDs: {DEMO_CAMPAIGN_ID.slice(0, 4)}/{DEMO_CASE_ID.slice(0, 4)}/{DEMO_VOUCHER_ID.slice(0, 4)}.</p>
    </section>
  );
}
