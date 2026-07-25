"use client";

import React, { useMemo, useState } from "react";

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
}

const DEMO_CAMPAIGN_ID = "demo-campaign-001";
const DEMO_MERCHANT = "GDEMOAIDMERCHANT000000000000000000000000000000000000000000";

export default function AidTab({ isConnected, address, isLoading, createCampaign, fundCampaign, approveMerchant, createCase, issueVoucher }: AidTabProps) {
  const [mode, setMode] = useState<AidMode>("demo");
  const [available, setAvailable] = useState(0);
  const [reserved, setReserved] = useState(0);
  const [message, setMessage] = useState("Demo starts empty: fund the campaign, create a case, then issue a voucher.");
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

  const total = useMemo(() => available + reserved, [available, reserved]);
  const liveDisabled = mode === "live" && (!isConnected || isLoading);

  const run = async (label: string, fn: () => Promise<void>) => {
    setError(""); setPending(label);
    try { await fn(); } catch (e: any) { setError(e.message || String(e)); }
    finally { setPending(""); }
  };

  const createLiveCampaign = () => run("Creating campaign", async () => {
    if (!campaignId || !token) throw new Error("Live mode requires campaign ID and token contract address from the operator.");
    const res = await createCampaign({ campaignId, token });
    setMessage(`Live Testnet campaign creation submitted: ${res?.hash || "pending hash"}. On-chain campaign state is not shown until read APIs are added.`);
  });

  const fund = () => run("Funding campaign", async () => {
    const amount = Number(fundAmount);
    if (!Number.isFinite(amount) || amount <= 0) throw new Error("Enter a positive funding amount.");
    if (mode === "demo") { setAvailable((v) => v + amount); setMessage(`Local demo funded ${amount.toFixed(2)} units. No on-chain transaction was sent.`); return; }
    if (!campaignId) throw new Error("Live mode requires the existing campaign ID to fund.");
    const funded = await fundCampaign({ campaignId, amount: fundAmount });
    setMessage(`Live Testnet campaign funding submitted: ${funded?.hash || "pending hash"}. Local demo accounting is not live on-chain accounting.`);
  });

  const approve = () => run("Approving merchant", async () => {
    if (mode === "demo") { setMerchant(DEMO_MERCHANT); setMessage("Local demo merchant approved using a demo merchant address only. No on-chain transaction was sent."); return; }
    if (!merchant || !merchantProfileHash) throw new Error("Live mode requires merchant address and merchant profile hash.");
    const res = await approveMerchant({ merchant, profileHash: merchantProfileHash });
    setMessage(`Live Testnet merchant approval submitted: ${res?.hash || "pending hash"}`);
  });

  const createAidCase = () => run("Creating beneficiary case", async () => {
    if (mode === "demo") { setMessage(`Local demo case ${DEMO_CAMPAIGN_ID} created. No personal data stored and no on-chain transaction was sent.`); return; }
    if (!campaignId || !caseId || !caseRecordHash) throw new Error("Live mode requires campaign ID, case ID, and case record hash.");
    const res = await createCase({ campaignId, caseId, caseRecordHash });
    setMessage(`Live Testnet case creation submitted: ${res?.hash || "pending hash"}`);
  });

  const issue = () => run("Issuing voucher", async () => {
    const amount = Number(voucherAmount);
    if (!Number.isFinite(amount) || amount <= 0) throw new Error("Enter a positive voucher amount.");
    if (mode === "demo") {
      if (amount > available) throw new Error("Voucher amount exceeds available demo funds; reserved demo funds cannot be re-issued.");
      setAvailable((v) => v - amount); setReserved((v) => v + amount); setMessage(`Local demo voucher reserved ${amount.toFixed(2)} units for ${category}. This is not on-chain.`); return;
    }
    if (!voucherId || !campaignId || !caseId || !merchant || !purposeHash) throw new Error("Live mode requires voucher ID, campaign ID, case ID, merchant address, and purpose hash.");
    const res = await issueVoucher({ voucherId, campaignId, caseId, merchant, amount: voucherAmount, category, purposeHash, expiresAt: Math.floor(Date.now() / 1000) + 604800 });
    setMessage(`Live Testnet voucher issuance submitted: ${res?.hash || "pending hash"}. Contract validation determines live availability/state until read APIs are added.`);
  });

  return <section className="space-y-4 pb-24" data-testid="aid-workspace">
    <div className="p-4 rounded-2xl border border-teal-500/20 bg-space-900/70"><h2 className="text-xl font-bold text-white">Aethyr Aid</h2><p className="text-sm text-slate-300">Campaign funding and voucher administration only. Admins can approve merchants, create beneficiary cases, and issue vouchers; verifier payout review, reject, freeze, and redemption controls are intentionally not included.</p></div>
    <div className="grid grid-cols-2 gap-2"><button onClick={() => setMode("demo")} className={`rounded-xl p-3 ${mode === "demo" ? "bg-teal-500 text-space-950" : "bg-space-800 text-slate-300"}`}>Local demo</button><button onClick={() => setMode("live")} className={`rounded-xl p-3 ${mode === "live" ? "bg-teal-500 text-space-950" : "bg-space-800 text-slate-300"}`}>Live Testnet</button></div>
    {isLoading && <div className="text-slate-300">Loading wallet state…</div>}
    {mode === "live" && !isConnected && <div className="rounded-xl border border-amber-500/30 p-3 text-amber-200">Disconnected: connect a Testnet wallet before submitting Aethyr Aid transactions.</div>}
    <div className="rounded-2xl bg-space-900 p-4 border border-space-700"><p className="text-xs uppercase text-slate-400">Demo-only accounting</p><div className="mt-2 grid grid-cols-3 gap-2 text-center"><div><b className="text-white">{total.toFixed(2)}</b><p className="text-xs text-slate-400">Total demo funded</p></div><div><b className="text-emerald-300">{available.toFixed(2)}</b><p className="text-xs text-slate-400">Available demo</p></div><div><b className="text-amber-300">{reserved.toFixed(2)}</b><p className="text-xs text-slate-400">Reserved vouchers (demo)</p></div></div>{total === 0 && <p className="mt-3 text-sm text-slate-400">Empty state: no demo funds yet. Live on-chain accounting is not displayed until read APIs are added.</p>}</div>
    <p className="text-xs text-slate-400">Privacy: use case IDs, evidence record IDs, and content digests only. Do not enter beneficiary personal data or raw evidence.</p>
    {mode === "live" && <div className="space-y-2"><input aria-label="Campaign ID" placeholder="32-byte campaign ID hex" value={campaignId} onChange={(e) => setCampaignId(e.target.value)} className="w-full rounded-xl bg-space-800 p-3 text-white"/><input aria-label="Token address" placeholder="Token contract address" value={token} onChange={(e) => setToken(e.target.value)} className="w-full rounded-xl bg-space-800 p-3 text-white"/><button disabled={!!pending || liveDisabled} onClick={createLiveCampaign} className="w-full rounded-xl bg-space-800 p-3 text-white disabled:opacity-50">Create live campaign</button><p className="text-xs text-slate-400">Create only when the campaign does not already exist; use fund below for an existing campaign.</p></div>}
    <div className="space-y-2"><input aria-label="Funding amount" value={fundAmount} onChange={(e) => setFundAmount(e.target.value)} className="w-full rounded-xl bg-space-800 p-3 text-white"/><button disabled={!!pending || liveDisabled} onClick={fund} className="w-full rounded-xl bg-teal-500 p-3 font-bold text-space-950 disabled:opacity-50">Fund campaign</button></div>
    {mode === "live" && <div className="space-y-2"><input aria-label="Merchant address" placeholder="Merchant address" value={merchant} onChange={(e) => setMerchant(e.target.value)} className="w-full rounded-xl bg-space-800 p-3 text-white"/><input aria-label="Merchant profile hash" placeholder="32-byte merchant profile hash hex" value={merchantProfileHash} onChange={(e) => setMerchantProfileHash(e.target.value)} className="w-full rounded-xl bg-space-800 p-3 text-white"/><input aria-label="Case ID" placeholder="32-byte case ID hex" value={caseId} onChange={(e) => setCaseId(e.target.value)} className="w-full rounded-xl bg-space-800 p-3 text-white"/><input aria-label="Case record hash" placeholder="32-byte case record hash hex" value={caseRecordHash} onChange={(e) => setCaseRecordHash(e.target.value)} className="w-full rounded-xl bg-space-800 p-3 text-white"/><input aria-label="Voucher ID" placeholder="32-byte voucher ID hex" value={voucherId} onChange={(e) => setVoucherId(e.target.value)} className="w-full rounded-xl bg-space-800 p-3 text-white"/><input aria-label="Purpose hash" placeholder="32-byte voucher purpose hash hex" value={purposeHash} onChange={(e) => setPurposeHash(e.target.value)} className="w-full rounded-xl bg-space-800 p-3 text-white"/></div>}
    <div className="grid grid-cols-1 gap-2"><button disabled={!!pending || liveDisabled} onClick={approve} className="rounded-xl bg-space-800 p-3 text-white disabled:opacity-50">Approve merchant</button><button disabled={!!pending || liveDisabled} onClick={createAidCase} className="rounded-xl bg-space-800 p-3 text-white disabled:opacity-50">Create beneficiary case</button><input aria-label="Voucher amount" value={voucherAmount} onChange={(e) => setVoucherAmount(e.target.value)} className="rounded-xl bg-space-800 p-3 text-white"/><select aria-label="Voucher category" value={category} onChange={(e) => setCategory(e.target.value as VoucherCategory)} className="rounded-xl bg-space-800 p-3 text-white"><option>Food</option><option>Medicine</option><option>Shelter</option><option>Other</option></select><button disabled={!!pending || liveDisabled} onClick={issue} className="rounded-xl bg-teal-500 p-3 font-bold text-space-950 disabled:opacity-50">Issue voucher</button></div>
    {pending && <div className="text-slate-300">{pending}…</div>}{message && <div className="rounded-xl border border-emerald-500/30 p-3 text-emerald-200">{message}</div>}{error && <div className="rounded-xl border border-red-500/30 p-3 text-red-200">Recoverable error: {error}</div>}
    <p className="text-[11px] text-slate-500">Mode: {mode === "demo" ? "deterministic local demo — never on-chain" : `Live Testnet using ${address || "no wallet"}`}.</p>
  </section>;
}
