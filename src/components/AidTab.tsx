"use client";

import { useMemo, useState } from "react";

import { HandHeart } from "lucide-react";
import { ClaimDecision } from "@/hooks/useStellarWallet";
import { applyDemoAction, bootstrapIssuedDemo, emptyDemoState } from "./aidDemoState";
import type { DemoState, DemoStatus } from "./aidDemoState";
import type { AidRole } from "./app-shell/appShellContent";
import AidWorkspaceCards from "./workflows/aid/AidWorkspaceCards";
import type { AidMode, VoucherCategory, WalkthroughState } from "./workflows/aid/AidWorkspaceCards";

export type { AidMode, VoucherCategory } from "./workflows/aid/AidWorkspaceCards";

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
  const [walkthrough, setWalkthrough] = useState<WalkthroughState>(null);
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

  return (
    <section className="space-y-6" data-testid="aid-tab-root" data-active-role={activeRole || "unselected"}>
      <header className="space-y-2 border-b border-aid-ink/10 px-1 pb-5">
        <div className="flex items-center gap-2"><HandHeart className="h-5 w-5 text-aid-trust-blue" /><h2 className="text-2xl font-bold font-display text-aid-ink">Aid operations</h2></div>
        <p className="text-sm leading-6 text-aid-slate">Fund campaigns, administer private vouchers, and review verified delivery without exposing beneficiary data. {activeRole ? `The ${activeRole} guide is active; every supported tool remains visible.` : "Choose a role above for contextual guidance."}</p>
      </header>

      <AidWorkspaceCards
        mode={mode}
        setMode={setMode}
        isConnected={isConnected}
        isMockWallet={isMockWallet}
        isLoading={isLoading}
        pending={pending}
        liveDisabled={liveDisabled}
        available={available}
        reserved={reserved}
        paid={paid}
        total={total}
        status={status}
        hasRevision={hasRevision}
        history={history}
        message={message}
        error={error}
        fundAmount={fundAmount}
        setFundAmount={setFundAmount}
        campaignId={campaignId}
        setCampaignId={setCampaignId}
        token={token}
        setToken={setToken}
        merchant={merchant}
        setMerchant={setMerchant}
        merchantProfileHash={merchantProfileHash}
        setMerchantProfileHash={setMerchantProfileHash}
        caseId={caseId}
        setCaseId={setCaseId}
        caseRecordHash={caseRecordHash}
        setCaseRecordHash={setCaseRecordHash}
        voucherId={voucherId}
        setVoucherId={setVoucherId}
        purposeHash={purposeHash}
        setPurposeHash={setPurposeHash}
        voucherAmount={voucherAmount}
        setVoucherAmount={setVoucherAmount}
        category={category}
        setCategory={setCategory}
        contentDigest={contentDigest}
        setContentDigest={setContentDigest}
        evidenceRecordId={evidenceRecordId}
        setEvidenceRecordId={setEvidenceRecordId}
        revisionDigest={revisionDigest}
        setRevisionDigest={setRevisionDigest}
        revisionRecordId={revisionRecordId}
        setRevisionRecordId={setRevisionRecordId}
        reasonHash={reasonHash}
        setReasonHash={setReasonHash}
        decisionReasonHash={decisionReasonHash}
        setDecisionReasonHash={setDecisionReasonHash}
        walkthrough={walkthrough}
        walkthroughCurrent={walkthroughCurrent}
        walkthroughNext={walkthroughNext}
        startWalkthrough={startWalkthrough}
        advanceWalkthrough={advanceWalkthrough}
        resetDemo={resetDemo}
        addTrustline={addTrustline}
        createLiveCampaign={createLiveCampaign}
        fund={fund}
        approve={approve}
        createAidCase={createAidCase}
        issue={issue}
        redeem={redeem}
        appendRevision={appendRevision}
        freeze={freeze}
        decide={decide}
      />

      <p className="px-1 text-[11px] leading-relaxed text-aid-slate">Mode: {mode === "demo" ? "deterministic local demo — never on-chain" : `Live Testnet using ${address || "no wallet"}`}. Demo IDs: {DEMO_CAMPAIGN_ID.slice(0, 4)}/{DEMO_CASE_ID.slice(0, 4)}/{DEMO_VOUCHER_ID.slice(0, 4)}.</p>
    </section>
  );
}
