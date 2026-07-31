"use client";

import React, { useMemo, useState } from "react";
import { CheckCircle2, ClipboardCheck, HandHeart, ShieldAlert, Store, WalletCards } from "lucide-react";
import { ClaimDecision } from "@/hooks/useStellarWallet";
import { applyDemoAction, bootstrapIssuedDemo, emptyDemoState } from "./aidDemoState";
import type { DemoState, DemoStatus } from "./aidDemoState";
import SegmentedControl from "./ui/SegmentedControl";

export type AidMode = "demo" | "live";
export type VoucherCategory = "Food" | "Medicine" | "Shelter" | "Other";

interface AidTabProps {
  isConnected: boolean;
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
}

const DEMO_CAMPAIGN_ID = "a".repeat(64);
const DEMO_CASE_ID = "b".repeat(64);
const DEMO_VOUCHER_ID = "c".repeat(64);
const DEMO_MERCHANT = "GDEMOAIDMERCHANT000000000000000000000000000000000000000000";

const inputClassName = "w-full h-12 px-4 rounded-xl bg-space-900/50 border border-space-700/40 focus:border-teal-500/35 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition-colors focus-ring";
const secondaryButtonClassName = "w-fit ml-auto h-8 px-3 rounded-lg bg-slate-500/10 hover:bg-slate-500/20 border border-slate-500/30 text-[10px] font-bold text-slate-400 cursor-pointer transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-ring";
const primaryButtonClassName = "w-fit ml-auto h-8 px-3 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-[10px] font-bold text-teal-400 cursor-pointer transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-ring";
const amberActionButtonClassName = "w-fit ml-auto h-8 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-[10px] font-bold text-amber-400 cursor-pointer transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-ring";
const cyanActionButtonClassName = "w-fit ml-auto h-8 px-3 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-[10px] font-bold text-cyan-400 cursor-pointer transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-ring";
const redActionButtonClassName = "w-fit ml-auto h-8 px-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-[10px] font-bold text-red-400 cursor-pointer transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-ring";
const formActionButtonClassName = "w-full h-11 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-xs font-bold text-teal-400 cursor-pointer transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-ring";
const formSecondaryButtonClassName = "w-full h-11 rounded-xl bg-slate-500/10 hover:bg-slate-500/20 border border-slate-500/30 text-xs font-bold text-slate-300 cursor-pointer transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-ring";
const formCyanActionButtonClassName = "w-full h-11 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-bold text-cyan-400 cursor-pointer transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-ring";
const formAmberActionButtonClassName = "w-full h-11 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-bold text-amber-400 cursor-pointer transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 focus-ring";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block space-y-2"><span className="px-1 text-xs font-bold text-slate-300">{label}</span>{children}</label>;
}

function WorkspaceHeading({ icon: Icon, title, description, tone }: { icon: typeof Store; title: string; description: React.ReactNode; tone: "teal" | "emerald" | "amber" | "purple" }) {
  const tones = {
    teal: "bg-teal-500/10 border-teal-500/20 text-teal-400",
    emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    amber: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    purple: "bg-purple-500/10 border-purple-500/20 text-purple-400",
  };
  return <div className="flex gap-3"><div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${tones[tone]}`}><Icon className="h-4 w-4" /></div><div className="space-y-0.5"><h3 className="text-base font-bold text-slate-200">{title}</h3><p className="text-xs leading-relaxed text-slate-400">{description}</p></div></div>;
}

export default function AidTab(props: AidTabProps) {
  const { isConnected, address, isLoading, createCampaign, fundCampaign, approveMerchant, createCase, issueVoucher, redeemVoucher, appendEvidenceRevision, freezeClaim, decideClaim } = props;
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
  const liveDisabled = mode === "live" && (!isConnected || isLoading);
  const demoState = (): DemoState => ({ available, reserved, paid, status, hasRevision, history });
  const setDemoState = (state: DemoState) => { setAvailable(state.available); setReserved(state.reserved); setPaid(state.paid); setStatus(state.status); setHasRevision(state.hasRevision); setHistory(state.history); };
  const applyLocalDemoAction = (action: Parameters<typeof applyDemoAction>[1]) => setDemoState(applyDemoAction(demoState(), action));
  const run = async (label: string, fn: () => Promise<void>) => { setError(""); setPending(label); try { await fn(); } catch (e: any) { setError(e.message || String(e)); } finally { setPending(""); } };
  const resetDemo = () => { setDemoState(emptyDemoState()); setWalkthrough(null); setMessage("Local demo reset. No on-chain transaction was sent."); };
  const fund = () => run("Funding campaign", async () => { const amount = Number(fundAmount); if (mode === "demo") { setWalkthrough(null); applyLocalDemoAction({ type: "fund", amount }); setMessage(`Local demo funded ${amount.toFixed(2)} units. Never on-chain.`); return; } if (!Number.isFinite(amount) || amount <= 0) throw new Error("Enter a positive funding amount."); if (!campaignId) throw new Error("Live mode requires the existing campaign ID to fund."); const res = await fundCampaign({ campaignId, amount: fundAmount }); setMessage(`Live Testnet campaign funding submitted: ${res?.hash || "pending hash"}. Await wallet/RPC confirmation; local accounting is not live state.`); });
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

  return (
    <section className="space-y-6" data-testid="aid-tab-root">
      <header className="space-y-2 px-1">
        <div className="flex items-center gap-2"><HandHeart className="h-5 w-5 text-teal-400" /><h3 className="text-xl font-semibold font-display text-slate-100">Aethyr Aid</h3></div>
        <p className="text-xs leading-relaxed text-slate-400">Fund campaigns, administer private vouchers, and review verified delivery without exposing beneficiary data.</p>
      </header>

      <div className="p-5 rounded-2xl glass-card text-left space-y-4">
        <div className="flex items-start justify-between gap-4"><div className="space-y-1"><h4 className="text-base font-bold text-slate-200">Aid workspace mode</h4><p className="text-xs text-slate-400">Use deterministic demo data or submit with an authorized Testnet role wallet.</p></div><span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold ${mode === "demo" ? "border-teal-500/20 bg-teal-500/10 text-teal-400" : "border-amber-500/20 bg-amber-500/10 text-amber-400"}`}>{mode === "demo" ? "Demo" : "Testnet"}</span></div>
        <SegmentedControl value={mode} onChange={setMode} options={[{ label: "Local demo", value: "demo", color: "bg-teal-500" }, { label: "Live Testnet", value: "live", color: "bg-primary-indigo" }]} idPrefix="aid-mode" />
        <div className="rounded-xl border border-teal-500/15 bg-teal-950/10 px-3 py-2.5 text-xs leading-relaxed text-slate-400">Live Testnet requires role-disjoint wallets: admin cannot act as verifier, and merchant submits merchant-only evidence actions.</div>
      </div>

      {(isLoading || pending || (mode === "live" && !isConnected)) && <div aria-live="polite" className={`rounded-xl border px-4 py-3 text-xs ${mode === "live" && !isConnected ? "border-amber-500/25 bg-amber-500/5 text-amber-200" : "border-teal-500/20 bg-teal-500/5 text-teal-200"}`}>{isLoading ? "Loading wallet state…" : pending ? `Pending submission: ${pending}…` : "Disconnected: connect the correct Testnet role wallet before submitting."}</div>}

      <div className="p-5 rounded-2xl glass-card text-left space-y-4">
        <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Demo-only accounting</p><p className="mt-1 text-xs text-slate-500">Local state is never on-chain.</p></div><WalletCards className="h-5 w-5 text-teal-400" /></div>
        <div className="grid grid-cols-4 divide-x divide-space-700/50 text-center"><div><b className="font-mono text-sm text-slate-100">{total.toFixed(2)}</b><p className="mt-1 text-[9px] text-slate-500">Total</p></div><div><b className="font-mono text-sm text-emerald-300">{available.toFixed(2)}</b><p className="mt-1 text-[9px] text-slate-500">Available</p></div><div><b className="font-mono text-sm text-amber-300">{reserved.toFixed(2)}</b><p className="mt-1 text-[9px] text-slate-500">Reserved</p></div><div><b className="font-mono text-sm text-sky-300">{paid.toFixed(2)}</b><p className="mt-1 text-[9px] text-slate-500">Paid</p></div></div>
        <p className="rounded-lg bg-space-950/40 px-3 py-2 text-xs text-slate-400">Status: <span className="font-semibold text-slate-300">{status}</span>. {total === 0 ? "Empty state: no demo funds yet." : "History and accounting are local demo state only."}</p>
      </div>

      <div className="p-5 rounded-2xl glass-card text-left space-y-4">
        <WorkspaceHeading icon={ClipboardCheck} title="Guided walkthrough" description={<>Current: {walkthroughCurrent}. Next: {walkthroughNext}. History below records every validated transition.</>} tone="teal" />
        <div className="flex flex-wrap justify-end gap-2"><button type="button" onClick={() => startWalkthrough("clean")} disabled={!!pending} className={primaryButtonClassName}>Start clean walkthrough</button><button type="button" onClick={() => startWalkthrough("disputed")} disabled={!!pending} className={amberActionButtonClassName}>Start disputed walkthrough</button><button type="button" onClick={advanceWalkthrough} disabled={!!pending || !walkthrough} className={secondaryButtonClassName}>Advance walkthrough</button><button type="button" onClick={resetDemo} disabled={!!pending} className={secondaryButtonClassName}>Reset demo</button></div>
      </div>

      <p className="px-1 text-xs leading-relaxed text-slate-500">Privacy: enter only 32-byte digests and opaque IDs. No raw evidence or beneficiary personal data.</p>

      {mode === "live" && <div className="p-5 rounded-2xl glass-card text-left space-y-4"><WorkspaceHeading icon={ShieldAlert} title="Live campaign setup" description="Operator-only identifiers required before submitting campaign administration actions." tone="teal" /><div className="space-y-3"><Field label="Campaign ID"><input aria-label="Campaign ID" placeholder="32-byte campaign ID hex" value={campaignId} onChange={(e) => setCampaignId(e.target.value)} className={inputClassName} /></Field><Field label="Token address"><input aria-label="Token address" placeholder="Token contract address" value={token} onChange={(e) => setToken(e.target.value)} className={inputClassName} /></Field><button type="button" disabled={!!pending || liveDisabled} onClick={createLiveCampaign} className={formSecondaryButtonClassName}>Create live campaign</button></div></div>}

      <section className="p-5 rounded-2xl glass-card text-left space-y-4"><WorkspaceHeading icon={ShieldAlert} title="Admin bootstrap workspace" description="Fund a campaign, register operations, and reserve a category-limited voucher." tone="teal" /><div className="space-y-3"><Field label="Funding amount"><input aria-label="Funding amount" inputMode="decimal" value={fundAmount} onChange={(e) => setFundAmount(e.target.value)} className={inputClassName} /></Field><button type="button" disabled={!!pending || liveDisabled} onClick={fund} className={formActionButtonClassName}>Fund campaign</button>{mode === "live" && <><Field label="Merchant address"><input aria-label="Merchant address" placeholder="Merchant address" value={merchant} onChange={(e) => setMerchant(e.target.value)} className={inputClassName} /></Field><Field label="Merchant profile hash"><input aria-label="Merchant profile hash" placeholder="32-byte merchant profile hash hex" value={merchantProfileHash} onChange={(e) => setMerchantProfileHash(e.target.value)} className={inputClassName} /></Field><Field label="Case ID"><input aria-label="Case ID" placeholder="32-byte case ID hex" value={caseId} onChange={(e) => setCaseId(e.target.value)} className={inputClassName} /></Field><Field label="Case record hash"><input aria-label="Case record hash" placeholder="32-byte case record hash hex" value={caseRecordHash} onChange={(e) => setCaseRecordHash(e.target.value)} className={inputClassName} /></Field><Field label="Voucher ID"><input aria-label="Voucher ID" placeholder="32-byte voucher ID hex" value={voucherId} onChange={(e) => setVoucherId(e.target.value)} className={inputClassName} /></Field><Field label="Purpose hash"><input aria-label="Purpose hash" placeholder="32-byte voucher purpose hash hex" value={purposeHash} onChange={(e) => setPurposeHash(e.target.value)} className={inputClassName} /></Field></>}<button type="button" disabled={!!pending || liveDisabled} onClick={approve} className={formSecondaryButtonClassName}>Approve merchant</button><button type="button" disabled={!!pending || liveDisabled} onClick={createAidCase} className={formSecondaryButtonClassName}>Create beneficiary case</button><Field label="Voucher amount"><input aria-label="Voucher amount" inputMode="decimal" value={voucherAmount} onChange={(e) => setVoucherAmount(e.target.value)} className={inputClassName} /></Field><Field label="Voucher category"><select aria-label="Voucher category" value={category} onChange={(e) => setCategory(e.target.value as VoucherCategory)} className={inputClassName}><option>Food</option><option>Medicine</option><option>Shelter</option><option>Other</option></select></Field><button type="button" disabled={!!pending || liveDisabled} onClick={issue} className={formActionButtonClassName}>Issue voucher</button></div></section>

      <section className="p-5 rounded-2xl glass-card text-left space-y-4"><WorkspaceHeading icon={Store} title="Merchant redemption workspace" description="Submit opaque delivery evidence; one revision is permitted only after an admin freeze." tone="emerald" /><div className="space-y-3"><Field label="Initial evidence digest"><input aria-label="Initial evidence digest" placeholder="32-byte evidence[0] content digest" value={contentDigest} onChange={(e) => setContentDigest(e.target.value)} className={inputClassName} /></Field><Field label="Evidence record ID"><input aria-label="Evidence record ID" placeholder="32-byte opaque evidence record ID" value={evidenceRecordId} onChange={(e) => setEvidenceRecordId(e.target.value)} className={inputClassName} /></Field><button type="button" disabled={!!pending || liveDisabled} onClick={redeem} className={formCyanActionButtonClassName}>Redeem voucher with evidence[0]</button><Field label="Evidence revision digest"><input aria-label="Evidence revision digest" placeholder="32-byte evidence[1] digest after freeze" value={revisionDigest} onChange={(e) => setRevisionDigest(e.target.value)} className={inputClassName} /></Field><Field label="Evidence revision record ID"><input aria-label="Evidence revision record ID" placeholder="32-byte opaque revision record ID" value={revisionRecordId} onChange={(e) => setRevisionRecordId(e.target.value)} className={inputClassName} /></Field><button type="button" disabled={!!pending || liveDisabled || (mode === "demo" && (status !== "frozen" || hasRevision))} onClick={appendRevision} className={formSecondaryButtonClassName}>Append exactly one evidence[1] after freeze</button></div></section>

      <section className="p-5 rounded-2xl glass-card text-left space-y-4"><WorkspaceHeading icon={ShieldAlert} title="Admin emergency-freeze control" description="Pause a disputed claim using only an opaque reason digest." tone="amber" /><div className="space-y-3"><Field label="Freeze reason digest"><input aria-label="Freeze reason digest" placeholder="32-byte reason digest only" value={reasonHash} onChange={(e) => setReasonHash(e.target.value)} className={inputClassName} /></Field><button type="button" disabled={!!pending || liveDisabled} onClick={freeze} className={formAmberActionButtonClassName}>Admin freeze claim</button></div></section>

      <section className="p-5 rounded-2xl glass-card text-left space-y-4"><WorkspaceHeading icon={CheckCircle2} title="Verifier-only review panel" description="Verifier decisions expose only Approve or Reject. Freeze is an admin control, not a verifier decision." tone="purple" /><div className="space-y-3"><Field label="Verifier decision reason digest"><input aria-label="Verifier decision reason digest" placeholder="32-byte verifier reason digest" value={decisionReasonHash} onChange={(e) => setDecisionReasonHash(e.target.value)} className={inputClassName} /></Field><div className="grid grid-cols-2 gap-2"><button type="button" disabled={!!pending || liveDisabled} onClick={() => decide(ClaimDecision.Approve)} className={primaryButtonClassName}>Verifier approve / atomic payout</button><button type="button" disabled={!!pending || liveDisabled} onClick={() => decide(ClaimDecision.Reject)} className={redActionButtonClassName}>Verifier reject / release reservation</button></div></div></section>

      <div aria-live="polite" className="space-y-3">{message && <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-xs leading-relaxed text-emerald-200">{message}</div>}{error && <div className="rounded-xl border border-red-500/25 bg-red-500/5 px-4 py-3 text-xs leading-relaxed text-red-200">Recoverable error: {error}</div>}</div>
      <div className="p-5 rounded-2xl glass-card text-left space-y-3"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">Visible state/history</p>{history.length === 0 ? <p className="text-sm text-slate-400">No local demo activity yet.</p> : <ul className="space-y-1.5 text-sm text-slate-300">{history.map((entry) => <li key={entry} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />{entry}</li>)}</ul>}</div>
      <p className="px-1 text-[11px] leading-relaxed text-slate-500">Mode: {mode === "demo" ? "deterministic local demo — never on-chain" : `Live Testnet using ${address || "no wallet"}`}. Demo IDs: {DEMO_CAMPAIGN_ID.slice(0, 4)}/{DEMO_CASE_ID.slice(0, 4)}/{DEMO_VOUCHER_ID.slice(0, 4)}.</p>
    </section>
  );
}
