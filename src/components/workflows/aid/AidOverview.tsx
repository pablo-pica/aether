"use client";

import { ComponentProps, KeyboardEvent, useEffect, useState } from "react";
import { BookOpen, Info, ShieldCheck } from "lucide-react";

import AidTab from "@/components/AidTab";
import { AidRole, aidRoles } from "@/components/app-shell/appShellContent";
import AidRoleChooser from "./AidRoleChooser";

type AidOverviewProps = Omit<ComponentProps<typeof AidTab>, "activeRole"> & {
  initialRole?: AidRole | null;
};

const storageKey = "aethyr_aid_role";
const guideStorageKey = "aethyr_aid_guide_tab";
type GuideTab = "start" | "field" | "safety";

export default function AidOverview({ initialRole = null, ...aidProps }: AidOverviewProps) {
  const [role, setRole] = useState<AidRole | null>(initialRole);

  useEffect(() => {
    if (initialRole) {
      setRole(initialRole);
      return;
    }
    const saved = window.localStorage.getItem(storageKey) as AidRole | null;
    if (saved && saved in aidRoles) setRole(saved);
  }, [initialRole]);

  const chooseRole = (next: AidRole) => {
    setRole(next);
    window.localStorage.setItem(storageKey, next);
  };

  const selectedRole = role ? aidRoles[role] : null;
  const [guideTab, setGuideTab] = useState<GuideTab>("start");
  const guideTabs = [
    { id: "start" as const, label: "Start here" },
    { id: "field" as const, label: "Field guide" },
    { id: "safety" as const, label: "Signing & safety" },
  ];

  useEffect(() => {
    const saved = window.localStorage.getItem(guideStorageKey);
    if (saved === "start" || saved === "field" || saved === "safety") setGuideTab(saved);
  }, []);

  const selectGuideTab = (next: GuideTab) => {
    setGuideTab(next);
    window.localStorage.setItem(guideStorageKey, next);
  };

  const handleGuideTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const direction = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (direction === 0) return;
    event.preventDefault();
    const next = (index + direction + guideTabs.length) % guideTabs.length;
    selectGuideTab(guideTabs[next].id);
    document.getElementById(`aid-guide-tab-${guideTabs[next].id}`)?.focus();
  };

  return (
    <div className="space-y-8">
      <AidRoleChooser role={role} onRoleChange={chooseRole} />

      <section className="rounded-3xl border border-aid-ink/10 bg-white p-4 shadow-sm sm:p-6" aria-labelledby="beginner-onboarding-heading">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-aid-trust-blue">Beginner onboarding</p>
            <h2 id="beginner-onboarding-heading" className="mt-2 flex items-center gap-2 font-display text-2xl font-black"><BookOpen className="h-5 w-5 text-aid-coral" aria-hidden="true" />Before you sign</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-aid-slate">This guide explains Testnet fields and wallet prompts. Role selection is only a local preference and never grants contract permissions.</p>
          </div>
          <div role="tablist" aria-label="Aid onboarding guide" className="grid gap-2 sm:grid-cols-3">
            {guideTabs.map((tab, index) => (
              <button key={tab.id} id={`aid-guide-tab-${tab.id}`} type="button" role="tab" aria-selected={guideTab === tab.id} aria-controls={`aid-guide-panel-${tab.id}`} tabIndex={guideTab === tab.id ? 0 : -1} onKeyDown={(event) => handleGuideTabKeyDown(event, index)} onClick={() => selectGuideTab(tab.id)} className={`rounded-full border px-4 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-aid-gold/70 ${guideTab === tab.id ? "border-aid-ink bg-aid-ink text-white" : "border-aid-ink/10 bg-aid-paper text-aid-ink hover:border-aid-teal"}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-5 rounded-2xl bg-aid-paper p-4 text-sm leading-6 text-aid-slate">
          <div id="aid-guide-panel-start" role="tabpanel" aria-labelledby="aid-guide-tab-start" hidden={guideTab !== "start"}><p><strong className="text-aid-ink">Start here:</strong> Campaign ID names the relief pool, token address is the Testnet asset contract, merchant address is the wallet redeeming approved goods, and amount/category describe the voucher purpose.</p></div>
          <div id="aid-guide-panel-field" role="tabpanel" aria-labelledby="aid-guide-tab-field" hidden={guideTab !== "field"}><p><strong className="text-aid-ink">Field guide:</strong> Case ID and voucher ID are opaque references, not beneficiary names. Evidence digest, record ID, and reason digest point to off-chain records without publishing private relief details.</p></div>
          <div id="aid-guide-panel-safety" role="tabpanel" aria-labelledby="aid-guide-tab-safety" hidden={guideTab !== "safety"}><p><strong className="text-aid-ink">Signing & safety:</strong> Wallet prompts are the authority boundary on Testnet. Check the operation, address, and amount before signing. Choosing Donor, Coordinator, Merchant, or Verifier changes guidance only; the contract and wallet decide authority.</p></div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[230px_minmax(0,1fr)]">
        <aside className="space-y-7 lg:sticky lg:top-28 lg:self-start" aria-label="Workflow guidance">
          <section>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-aid-trust-blue">
              Recommended next
            </p>
            <h2 className="mt-2 font-display text-xl font-bold">
              {selectedRole ? selectedRole.eyebrow : "Choose a role to focus the guide"}
            </h2>
            <p className="mt-3 text-sm leading-6 text-aid-slate">
              {selectedRole
                ? selectedRole.nextAction
                : "All supported Aid actions remain visible below. Your selected role only changes this guidance."}
            </p>
          </section>

          {selectedRole && (
            <ol className="border-y border-aid-ink/10" aria-label={`${selectedRole.label} workflow`}>
              {selectedRole.responsibilities.map((step, index) => (
                <li key={step} className="flex gap-3 border-b border-aid-ink/10 py-3 last:border-b-0">
                  <span className="font-mono text-[10px] font-bold text-aid-trust-blue">0{index + 1}</span>
                  <span className="text-xs font-semibold leading-5 text-aid-slate">{step}</span>
                </li>
              ))}
            </ol>
          )}

          <section className="border-l-4 border-aid-gold pl-4">
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <ShieldCheck aria-hidden="true" className="h-4 w-4 text-aid-success-strong" />
              Signing boundary
            </h2>
            <p className="mt-2 text-xs leading-5 text-aid-slate">
              Role selection is stored only in this browser. Live Testnet actions still require wallet confirmation and contract authority.
            </p>
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-sm font-bold">
              <Info aria-hidden="true" className="h-4 w-4 text-aid-trust-blue" />
              Quick glossary
            </h2>
            <dl className="mt-3 space-y-3 text-xs leading-5">
              <div><dt className="font-bold">Case ID</dt><dd className="text-aid-slate">An opaque reference—not a family name.</dd></div>
              <div><dt className="font-bold">Evidence digest</dt><dd className="text-aid-slate">A hash of an off-chain delivery record.</dd></div>
              <div><dt className="font-bold">Reserved</dt><dd className="text-aid-slate">Campaign value committed to an issued voucher.</dd></div>
            </dl>
          </section>
        </aside>

        <div className="min-w-0">
          <AidTab {...aidProps} activeRole={role} />
        </div>
      </div>
    </div>
  );
}
