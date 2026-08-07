"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, HandHeart } from "lucide-react";

import { AppView, primaryRoutes, protocolRoutes } from "./appShellContent";

interface AppShellProps {
  activeView: AppView;
  walletSlot: ReactNode;
  children: ReactNode;
}

export default function AppShell({ activeView, walletSlot, children }: AppShellProps) {
  const navLink = (item: { id: AppView; href: string; label: string; description: string }) => {
    const active = activeView === item.id;

    return (
      <Link
        key={item.id}
        href={item.href}
        data-testid={`app-nav-${item.id}`}
        aria-current={active ? "page" : undefined}
        className={`group rounded-xl border px-4 py-3 text-left transition active:translate-y-px focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-aid-gold/70 ${
          active
            ? "border-aid-ink bg-aid-ink text-white"
            : "border-transparent text-aid-ink hover:border-aid-ink/10 hover:bg-white"
        }`}
      >
        <span className="block text-sm font-bold">{item.label}</span>
        <span className={`mt-1 block text-xs leading-5 ${active ? "text-white/65" : "text-aid-slate"}`}>
          {item.description}
        </span>
      </Link>
    );
  };

  return (
    <div
      className="aethyr-app min-h-[100dvh] bg-aid-paper text-aid-ink md:grid md:grid-cols-[220px_1fr] xl:grid-cols-[280px_1fr]"
      data-testid="app-shell"
    >
      <a
        href="#main-content"
        className="fixed left-4 top-3 z-50 -translate-y-24 rounded-full bg-aid-ink px-4 py-2 text-sm font-bold text-white focus:translate-y-0"
      >
        Skip to workspace
      </a>

      <aside
        className="hidden min-h-[100dvh] border-r border-aid-ink/10 bg-aid-paper px-4 py-6 md:flex md:flex-col"
        aria-label="App sidebar"
      >
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-2 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-aid-gold/70"
        >
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-aid-ink font-black text-aid-gold">Æ</span>
          <span>
            <strong className="block font-display text-lg">Aethyr Aid</strong>
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-aid-slate">Testnet workspace</span>
          </span>
        </Link>

        <div className="mt-9 flex flex-1 flex-col gap-8">
          <nav className="flex flex-col gap-1" aria-label="Primary app sections">
            <p className="mb-2 px-4 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-aid-slate">
              Relief operations
            </p>
            {primaryRoutes.map(navLink)}
          </nav>

          <nav className="flex flex-col gap-1" aria-label="Protocol tools">
            <p className="mb-2 px-4 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-aid-slate">
              Protocol tools
            </p>
            {protocolRoutes.map(navLink)}
          </nav>
        </div>

        <Link
          href="/preview"
          className="mt-8 flex items-center justify-between rounded-xl border border-aid-ink/10 bg-white px-4 py-3 text-sm font-bold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-aid-gold/70"
        >
          Judge preview
          <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-aid-trust-blue" />
        </Link>
        <p className="mt-4 px-2 text-xs leading-5 text-aid-slate">
          Roles change guidance only. Wallet and contract permissions remain authoritative.
        </p>
      </aside>

      <div className="flex min-h-[100dvh] min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-3 border-b border-aid-ink/10 bg-aid-paper/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-aid-ink text-aid-gold md:hidden">
              <HandHeart aria-hidden="true" className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-aid-trust-blue">Stellar Testnet</p>
              <p className="truncate font-display text-base font-bold sm:text-lg">Aethyr Aid command center</p>
            </div>
          </div>
          <div className="shrink-0">{walletSlot}</div>
        </header>

        <main id="main-content" className="mx-auto w-full min-w-0 max-w-[1180px] flex-1 px-4 py-6 pb-28 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </main>

        <nav
          className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 gap-1 border-t border-aid-ink/10 bg-aid-paper/95 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur md:hidden"
          aria-label="Mobile app navigation"
        >
          {[...primaryRoutes, ...protocolRoutes].map((item) => {
            const active = activeView === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                data-testid={`bottom-nav-tab-${item.id}`}
                aria-current={active ? "page" : undefined}
                className={`min-w-0 rounded-lg px-1 py-2 text-center text-[10px] font-bold leading-tight focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-aid-gold/70 ${
                  active ? "bg-aid-ink text-white" : "text-aid-slate"
                }`}
              >
                {item.mobileLabel}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
