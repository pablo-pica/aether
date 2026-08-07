"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navigation = ["Journey", "Roles", "Stellar", "FAQ"] as const;

interface LandingHeaderProps {
  ctaClassName: string;
}

export default function LandingHeader({ ctaClassName }: LandingHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-aid-ink/10 bg-aid-paper/95 backdrop-blur supports-[backdrop-filter]:bg-aid-paper/85">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-aid-gold/70"
        >
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-aid-ink text-lg font-black text-aid-gold">
            Æ
          </span>
          <span>
            <strong className="block font-display text-lg">Aethyr Aid</strong>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-aid-slate">
              Verified relief payments
            </span>
          </span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-6 md:flex">
          {navigation.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="rounded-md text-sm font-semibold text-aid-slate hover:text-aid-ink focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-aid-gold/70"
            >
              {item}
            </a>
          ))}
          <Link href="/app" className={ctaClassName}>
            Launch workspace
          </Link>
        </nav>

        <button
          type="button"
          aria-controls="mobile-menu"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setMenuOpen((open) => !open)}
          className="grid h-11 w-11 place-items-center rounded-full border border-aid-ink/20 text-aid-ink md:hidden focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-aid-gold/70"
        >
          {menuOpen ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile navigation"
          className="border-t border-aid-ink/10 bg-aid-paper px-4 py-4 md:hidden"
        >
          {navigation.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={closeMenu}
              className="block rounded-lg px-2 py-3 font-semibold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-aid-gold/70"
            >
              {item}
            </a>
          ))}
          <Link href="/app" onClick={closeMenu} className={`${ctaClassName} mt-2 w-full`}>
            Launch workspace
          </Link>
        </nav>
      )}
    </header>
  );
}
