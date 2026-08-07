"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { AidRole, aidRoles } from "@/components/app-shell/appShellContent";

interface AidRoleChooserProps {
  role: AidRole | null;
  onRoleChange: (role: AidRole) => void;
}

export default function AidRoleChooser({ role, onRoleChange }: AidRoleChooserProps) {
  return (
    <section className="border-y border-aid-ink/10 py-6" aria-labelledby="aid-role-heading">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-aid-trust-blue">
            Role-guided workspace
          </p>
          <h1 id="aid-role-heading" className="mt-2 font-display text-3xl font-black tracking-tight sm:text-4xl">
            {role ? `${aidRoles[role].label} view` : "How are you helping?"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-aid-slate">
            Choose the work you need now. This preference changes guidance—not wallet or contract permissions.
          </p>
        </div>
        {role && (
          <p className="w-fit rounded-full border border-aid-ink/10 bg-white px-3 py-1.5 text-xs font-bold text-aid-slate">
            Current role: <span className="text-aid-ink">{aidRoles[role].label}</span>
          </p>
        )}
      </div>

      <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-aid-ink/10 bg-aid-ink/10 sm:grid-cols-2 xl:grid-cols-4" aria-label="Aid role chooser">
        {(Object.keys(aidRoles) as AidRole[]).map((key) => {
          const item = aidRoles[key];
          const active = role === key;

          return (
            <Link
              key={key}
              href={item.href}
              onClick={() => onRoleChange(key)}
              aria-current={active ? "page" : undefined}
              className={`group min-h-48 p-5 text-left transition active:translate-y-px focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-aid-gold/70 ${
                active
                  ? "bg-aid-ink text-white shadow-inner"
                  : "bg-white text-aid-ink hover:bg-aid-paper"
              }`}
            >
              <span className={`font-mono text-[10px] font-bold uppercase tracking-[0.18em] ${active ? "text-aid-gold" : "text-aid-trust-blue"}`}>
                {item.label}
              </span>
              <span className="mt-5 block font-display text-lg font-bold">{item.eyebrow}</span>
              <span className={`mt-3 block text-sm leading-6 ${active ? "text-white/70" : "text-aid-slate"}`}>
                {item.nextAction}
              </span>
              <span className={`mt-5 flex items-center gap-2 text-xs font-bold ${active ? "text-aid-gold" : "text-aid-trust-blue"}`}>
                Open role view
                <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
