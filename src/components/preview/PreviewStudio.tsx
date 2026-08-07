import { CheckCircle2, HandHeart, ShieldCheck } from "lucide-react";

const previewSteps = [
  { id: "01", label: "Campaign funded", detail: "100 AIDT available" },
  { id: "02", label: "Voucher issued", detail: "25 AIDT reserved" },
  { id: "03", label: "Evidence recorded", detail: "Opaque digest only" },
  { id: "04", label: "Verifier decision", detail: "Payout or rejection" },
] as const;

const previewRoles = ["Donor", "Coordinator", "Merchant", "Verifier"] as const;

function AidTrail({ compact = false }: { compact?: boolean }) {
  return (
    <ol className={compact ? "mt-4 space-y-2" : "mt-6 grid gap-px overflow-hidden rounded-2xl border border-aid-ink/10 bg-aid-ink/10 sm:grid-cols-2"}>
      {previewSteps.map((step, index) => (
        <li key={step.id} className={compact ? "flex gap-3 rounded-xl bg-white p-3" : "bg-white p-4"}>
          <span className="font-mono text-[10px] font-bold text-aid-trust-blue">{step.id}</span>
          <div className={compact ? "" : "mt-3"}>
            <p className="text-xs font-bold text-aid-ink">{step.label}</p>
            <p className="mt-1 text-[10px] text-aid-slate">{step.detail}</p>
          </div>
          {index < 3 && !compact && <span aria-hidden="true" className="float-right text-aid-slate/35">→</span>}
        </li>
      ))}
    </ol>
  );
}

function DesktopFrame() {
  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-aid-ink/15 bg-white shadow-[0_24px_70px_-40px_rgba(23,33,43,0.35)]" aria-label="Desktop preview frame">
      <div className="grid min-h-[610px] grid-cols-[170px_1fr]">
        <aside className="border-r border-aid-ink/10 bg-aid-paper p-4">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-aid-ink text-xs font-black text-aid-gold">Æ</span>
            <div><p className="text-xs font-black">Aethyr Aid</p><p className="text-[8px] uppercase tracking-wider text-aid-slate">Testnet</p></div>
          </div>
          <p className="mt-8 font-mono text-[8px] font-bold uppercase tracking-wider text-aid-slate">Relief operations</p>
          <div className="mt-2 rounded-lg bg-aid-ink px-3 py-2 text-[10px] font-bold text-white">Aid overview</div>
          <div className="mt-1 px-3 py-2 text-[10px] font-bold text-aid-slate">Activity</div>
          <div className="px-3 py-2 text-[10px] font-bold text-aid-slate">Settings</div>
          <p className="mt-6 font-mono text-[8px] font-bold uppercase tracking-wider text-aid-slate">Protocol tools</p>
          <div className="mt-2 px-3 py-2 text-[10px] font-bold text-aid-slate">Send payment</div>
          <div className="px-3 py-2 text-[10px] font-bold text-aid-slate">Milestone escrow</div>
        </aside>

        <div className="min-w-0">
          <header className="flex items-center justify-between border-b border-aid-ink/10 px-5 py-3">
            <div><p className="font-mono text-[8px] font-bold uppercase tracking-wider text-aid-trust-blue">Stellar Testnet</p><p className="text-xs font-bold">Aethyr Aid command center</p></div>
            <span className="rounded-full border border-aid-ink/10 px-3 py-1 text-[9px] font-bold">Wallet disconnected</span>
          </header>
          <div className="p-6">
            <p className="font-mono text-[8px] font-bold uppercase tracking-wider text-aid-trust-blue">Role-guided workspace</p>
            <h2 className="mt-2 font-display text-2xl font-black">Coordinator view</h2>
            <div className="mt-5 grid grid-cols-4 gap-px overflow-hidden rounded-xl border border-aid-ink/10 bg-aid-ink/10">
              {previewRoles.map((role) => (
                <div key={role} className={`min-h-20 p-3 ${role === "Coordinator" ? "bg-aid-ink text-white" : "bg-white"}`}>
                  <p className={`font-mono text-[8px] font-bold uppercase ${role === "Coordinator" ? "text-aid-gold" : "text-aid-trust-blue"}`}>{role}</p>
                  <p className={`mt-3 text-[9px] leading-4 ${role === "Coordinator" ? "text-white/70" : "text-aid-slate"}`}>{role === "Coordinator" ? "Operate the relief program" : "Switch guidance"}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-[130px_1fr] gap-5">
              <div className="border-l-4 border-aid-gold pl-3">
                <p className="text-[9px] font-bold">Signing boundary</p>
                <p className="mt-2 text-[8px] leading-4 text-aid-slate">Role choice never grants contract authority.</p>
              </div>
              <div>
                <p className="text-sm font-bold">Aid accountability trail</p>
                <AidTrail />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PhoneFrame() {
  return (
    <section className="mx-auto w-[300px] rounded-[2.5rem] border-[10px] border-aid-ink bg-aid-paper p-3 shadow-[0_24px_70px_-40px_rgba(23,33,43,0.45)]" aria-label="Phone preview frame">
      <header className="flex items-center justify-between border-b border-aid-ink/10 pb-3">
        <div className="flex items-center gap-2"><HandHeart aria-hidden="true" className="h-4 w-4 text-aid-trust-blue" /><div><p className="text-[8px] font-bold uppercase tracking-wider text-aid-trust-blue">Testnet</p><p className="text-[10px] font-bold">Aethyr Aid</p></div></div>
        <span className="rounded-full border border-aid-ink/10 px-2 py-1 text-[8px] font-bold">Connect</span>
      </header>
      <div className="py-4">
        <p className="font-mono text-[8px] font-bold uppercase tracking-wider text-aid-trust-blue">Same preview state</p>
        <h2 className="mt-2 font-display text-xl font-black">Coordinator view</h2>
        <p className="mt-2 text-[10px] leading-4 text-aid-slate">Create cases, issue vouchers, and freeze suspicious claims.</p>
        <AidTrail compact />
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-aid-success/40 bg-white p-3">
          <CheckCircle2 aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-aid-success-strong" />
          <p className="text-[9px] leading-4 text-aid-slate"><strong className="text-aid-ink">Deterministic demo.</strong> No wallet prompt or transaction submission exists here.</p>
        </div>
      </div>
      <nav className="grid grid-cols-5 border-t border-aid-ink/10 pt-3 text-center text-[8px] font-bold text-aid-slate" aria-label="Preview mobile navigation">
        <span className="text-aid-ink">Aid</span><span>Activity</span><span>Settings</span><span>Send</span><span>Escrow</span>
      </nav>
    </section>
  );
}

export default function PreviewStudio() {
  return (
    <main className="min-h-[100dvh] bg-aid-paper px-4 py-8 text-aid-ink sm:px-6 lg:px-10" data-testid="preview-studio">
      <section className="mx-auto hidden max-w-[1320px] lg:block">
        <header className="mb-8 flex items-end justify-between gap-8 border-b border-aid-ink/10 pb-6">
          <div>
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-aid-urgent-strong">Preview only / no transactions</p>
            <h1 className="mt-3 font-display text-4xl font-black tracking-tight">Synchronized desktop and phone</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-aid-slate">One deterministic Coordinator scenario rendered at two viewports. Wallet, contract, sponsor API, Send, Escrow, and Aid submission controls are intentionally absent.</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-aid-success-strong"><ShieldCheck aria-hidden="true" className="h-4 w-4" />Safe visual studio</div>
        </header>
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px] xl:gap-12">
          <DesktopFrame />
          <PhoneFrame />
        </div>
      </section>

      <section className="mx-auto max-w-md border-y border-aid-ink/10 py-10 text-center lg:hidden">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-aid-urgent-strong">Preview only / no transactions</p>
        <h1 className="mt-3 font-display text-3xl font-black">Desktop-only preview</h1>
        <p className="mt-3 text-sm leading-6 text-aid-slate">Open this studio at 1024px or wider to compare synchronized desktop and phone frames. The operational app remains responsive on this device.</p>
      </section>
    </main>
  );
}
