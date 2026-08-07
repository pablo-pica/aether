"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, MotionConfig, useReducedMotion, useScroll } from "framer-motion";
import { ArrowRight, BadgeCheck, CircleCheck, LockKeyhole, ShieldCheck } from "lucide-react";
import LandingHeader from "./LandingHeader";
import {
  aidCapabilities,
  aidFaqs,
  aidJourney,
  aidRoles,
  aidScopeClaims,
} from "./landingContent";

const primaryCta =
  "group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-aid-ink px-5 py-3 text-sm font-bold text-white shadow-sm transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:bg-aid-trust-blue active:translate-y-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-aid-gold/70";

const secondaryCta =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-aid-ink/20 bg-white px-5 py-3 text-sm font-bold text-aid-ink transition-[transform,border-color,color] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:border-aid-trust-teal hover:text-aid-trust-blue active:translate-y-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-aid-gold/70";

const journeyDetails = [
  "A relief program opens a dedicated pool with a specific Testnet asset.",
  "A coordinator creates an opaque family reference without publishing a name.",
  "Campaign value becomes reserved for food, medicine, shelter, or another approved purpose.",
  "The merchant records a digest of private delivery evidence—not the evidence itself.",
  "An independent verifier makes an attributable approval or rejection decision.",
  "Clean delivery releases payment; a rejected claim returns reserved value to the campaign.",
] as const;

const journeyTones = ["bg-aid-urgent", "bg-aid-coral", "bg-aid-orange", "bg-aid-gold", "bg-aid-teal", "bg-aid-trust-blue"] as const;

function useMotionReady() {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Media-query state is browser-only; wait until hydration before changing motion props.
    setMounted(true);
  }, []);

  const supportsViewportObserver = typeof window !== "undefined" && "IntersectionObserver" in window;
  return mounted && !reduceMotion && supportsViewportObserver;
}

function HeroSection() {
  const canAnimate = useMotionReady();
  const [activeStep, setActiveStep] = useState(0);
  const reveal = canAnimate ? { initial: { opacity: 0, y: 18 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: "-80px" } } : {};

  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-aid-gradient-journey" />
      <div aria-hidden="true" className="absolute -left-24 top-24 h-56 w-56 rounded-full bg-aid-gold/15 blur-3xl" />
      <div aria-hidden="true" className="absolute -right-20 bottom-6 h-72 w-72 rounded-full bg-aid-teal/10 blur-3xl" />

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[0.94fr_1.06fr] lg:items-center lg:px-8 lg:py-28">
        <motion.div {...reveal} className="relative z-10 space-y-7 motion-safe-reveal">
          <p className="text-sm font-bold uppercase tracking-[0.24em] text-aid-urgent-strong">
            Bicol typhoon relief on Stellar
          </p>
          <h1 className="max-w-3xl font-display text-5xl font-black tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            Relief should arrive with proof.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-aid-slate">
            Follow a donation from campaign escrow to beneficiary voucher, merchant evidence,
            verification, and payout—or a transparent dispute. {aidScopeClaims.wallets}{" "}
            {aidScopeClaims.privacy}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/app" className={primaryCta}>
              Open Aid workspace
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10 transition-transform duration-500 group-hover:translate-x-0.5">
                <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
              </span>
            </Link>
            <a href="#journey" className={secondaryCta}>See the accountability trail</a>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-aid-ink/10 pt-5 text-xs font-semibold text-aid-slate">
            <span>No beneficiary wallet</span><span>Opaque IDs only</span><span>Testnet-ready</span>
          </div>
        </motion.div>

        <motion.div {...reveal} className="relative motion-safe-reveal">
          <div aria-hidden="true" className="absolute -inset-3 rotate-2 rounded-[2.25rem] bg-aid-gradient-journey opacity-20" />
          <div className="relative rounded-[2rem] bg-aid-ink p-2 shadow-[0_32px_80px_-45px_rgba(23,33,43,0.7)]">
            <div className="rounded-[calc(2rem-0.5rem)] border border-white/10 bg-[#1c2a35] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div><p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-aid-gold">Interactive accountability trail</p><p className="mt-2 text-sm text-white/60">Focus or select a stage to inspect it.</p></div>
                <span className="rounded-full border border-white/15 px-3 py-1 text-[10px] font-bold text-white/70">0{activeStep + 1} / 06</span>
              </div>

              <ol className="mt-5 grid gap-1" aria-label="Interactive Aid accountability trail">
                {aidJourney.map((step, index) => {
                  const active = activeStep === index;
                  return (
                    <li key={step}>
                      <motion.button
                        type="button"
                        aria-pressed={active}
                        onClick={() => setActiveStep(index)}
                        onFocus={() => setActiveStep(index)}
                        onHoverStart={() => setActiveStep(index)}
                        whileHover={canAnimate ? { x: 4 } : undefined}
                        whileTap={canAnimate ? { scale: 0.985 } : undefined}
                        className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-aid-gold/70 ${active ? "bg-white text-aid-ink" : "text-white/72 hover:bg-white/10"}`}
                      >
                        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[10px] font-black ${journeyTones[index]} ${index === 3 ? "text-aid-ink" : "text-white"}`}>{index + 1}</span>
                        <span className="font-display text-base font-bold">{step}</span>
                        <ArrowRight aria-hidden="true" className={`ml-auto h-3.5 w-3.5 ${active ? "text-aid-trust-blue" : "text-white/30"}`} />
                      </motion.button>
                    </li>
                  );
                })}
              </ol>

              <motion.div key={activeStep} initial={canAnimate ? { opacity: 0, y: 6 } : false} animate={{ opacity: 1, y: 0 }} className="mt-4 min-h-24 rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-aid-gold">Why this stage matters</p>
                <p className="mt-2 text-sm leading-6 text-white/72">{journeyDetails[activeStep]}</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function JourneySection() {
  const canAnimate = useMotionReady();
  return (
    <section className="border-y border-aid-ink/10 bg-white" id="journey">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-aid-trust-blue">
              The accountability trail
            </p>
            <h2 className="mt-3 font-display text-3xl font-black sm:text-4xl">
              How Aethyr Aid works
            </h2>
            <p className="mt-4 max-w-md leading-7 text-aid-slate">
              Each state change answers a practical relief question without exposing a family&apos;s
              identity on-chain.
            </p>
          </div>

          <ol className="divide-y divide-aid-ink/10 border-y border-aid-ink/10">
            {aidJourney.map((step, index) => (
              <motion.li key={step} initial={canAnimate ? { opacity: 1, y: 12 } : false} whileInView={canAnimate ? { opacity: 1, y: 0 } : undefined} viewport={{ once: true }} whileHover={canAnimate ? { backgroundColor: "rgba(249,199,79,0.10)" } : undefined} className="grid gap-2 py-5 sm:grid-cols-[3rem_11rem_1fr] sm:items-baseline">
                <span className="font-mono text-xs font-bold text-aid-slate">
                  0{index + 1}
                </span>
                <h3 className="font-display text-lg font-bold">{step}</h3>
                <p className="text-sm leading-6 text-aid-slate">
                  {step === "Payout or Dispute"
                    ? "A clean approval releases merchant payout. A rejection returns reserved value to the campaign and records no merchant payout."
                    : `The ${step.toLowerCase()} step adds an attributable record to the relief trail.`}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function OriginAndCapabilities() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr]">
        <article className="border-t-4 border-aid-urgent-strong pt-6">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-aid-slate">
            Origin
          </p>
          <h2 className="mt-3 font-display text-3xl font-black">Built from Bato, Camarines Sur</h2>
          <p className="mt-4 leading-7 text-aid-slate">
            After Typhoon Kristine, Bicol families waited for recovery support while relief groups
            still had to answer who received what, from whom, and when. Aethyr Aid focuses on that
            last-mile accountability gap—not on forcing victims to learn crypto.
          </p>
        </article>

        <div>
          <h2 className="font-display text-3xl font-black">Core MVP capabilities</h2>
          <div className="mt-6 divide-y divide-aid-ink/10 border-y border-aid-ink/10">
            {aidCapabilities.map(({ title, body }) => (
              <article key={title} className="grid gap-2 py-5 sm:grid-cols-[12rem_1fr]">
                <h3 className="font-bold">{title}</h3>
                <p className="text-sm leading-6 text-aid-slate">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RolesSection() {
  return (
    <section id="roles" className="bg-aid-ink text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-aid-gold">
            Four operational views
          </p>
          <h2 className="mt-3 font-display text-3xl font-black sm:text-4xl">Choose the work in front of you</h2>
          <p className="mt-4 leading-7 text-white/75">
            Roles organize the experience. Wallet addresses and the contract still determine actual
            authority.
          </p>
        </div>

        <div className="mt-10 grid border-y border-white/15 md:grid-cols-2 lg:grid-cols-4">
          {aidRoles.map(({ label, title, detail, body }, index) => (
            <article
              key={label}
              className={`py-6 md:px-6 lg:min-h-64 ${index > 0 ? "border-t border-white/15 md:border-t-0 md:border-l" : ""} ${index === 2 ? "md:border-l-0 md:border-t lg:border-l lg:border-t-0" : ""}`}
            >
              <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-aid-gold">
                {label}
              </span>
              <h3 className="mt-5 font-display text-xl font-bold">{title}</h3>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-white/55">{detail}</p>
              <p className="mt-5 text-sm leading-6 text-white/75">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ScenarioSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-px overflow-hidden rounded-3xl border border-aid-ink/10 bg-aid-ink/10 lg:grid-cols-2">
        <article className="bg-white p-7 sm:p-9">
          <CircleCheck aria-hidden="true" className="h-8 w-8 text-aid-success-strong" />
          <h2 className="mt-8 font-display text-2xl font-black">Clean delivery demo</h2>
          <p className="mt-3 leading-7 text-aid-slate">
            A merchant redeems a voucher with evidence[0]. An independent verifier approves the
            redeemed claim, and the reserved value is released as merchant payout.
          </p>
        </article>
        <article className="bg-white p-7 sm:p-9">
          <ShieldCheck aria-hidden="true" className="h-8 w-8 text-aid-urgent-strong" />
          <h2 className="mt-8 font-display text-2xl font-black">Disputed delivery demo</h2>
          <p className="mt-3 leading-7 text-aid-slate">
            An admin freezes the redeemed claim. The merchant may append one evidence revision; an
            independent verifier can reject the claim, returning reserved value to the campaign with
            no merchant payout.
          </p>
        </article>
      </div>
    </section>
  );
}

function StellarSection() {
  return (
    <section id="stellar" className="border-y border-aid-ink/10 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <BadgeCheck aria-hidden="true" className="h-8 w-8 text-aid-trust-blue" />
          <h2 className="mt-5 font-display text-3xl font-black">Why Stellar</h2>
        </div>
        <div>
          <p className="text-lg leading-8 text-aid-slate">
            Stellar supports low-cost settlement and real-world payment rails. Soroban enforces
            campaign, voucher, evidence, verification, payout, and dispute states while the product
            remains focused on relief operations.
          </p>
          <div className="mt-8 border-l-4 border-aid-gold bg-aid-paper p-6">
            <h3 className="flex items-center gap-2 font-bold">
              <LockKeyhole aria-hidden="true" className="h-4 w-4" />
              Realistic scope
            </h3>
            <p className="mt-2 text-aid-slate">
              {aidScopeClaims.wallets} {aidScopeClaims.privacy}{" "}
              {aidScopeClaims.truth}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section id="faq" className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h2 className="font-display text-3xl font-black">FAQ</h2>
      <div className="mt-6 border-t border-aid-ink/10">
        {aidFaqs.map(({ question, answer }) => (
          <details key={question} className="border-b border-aid-ink/10 py-5">
            <summary className="cursor-pointer rounded-md font-bold focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-aid-gold/70">
              {question}
            </summary>
            <p className="mt-3 max-w-2xl text-aid-slate">{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[2rem] bg-aid-ink p-8 text-white md:p-12">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-aid-gradient-journey" />
        <h2 className="max-w-2xl font-display text-3xl font-black">
          Follow one clean delivery. Then challenge one.
        </h2>
        <p className="mt-3 max-w-2xl text-white/75">
          Use the preserved Testnet workspace to demonstrate both accountable outcomes without
          exposing beneficiary data.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link href="/app" className={secondaryCta}>
            Open /app
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
          <Link href="/preview" className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/25 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-aid-gold/70">
            View safe preview
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  return (
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen bg-aid-paper text-aid-ink">
      <motion.div aria-hidden="true" className="fixed left-0 top-0 z-50 h-1 w-full origin-left bg-aid-gradient-journey" style={{ scaleX: scrollYProgress }} />
      <LandingHeader ctaClassName={primaryCta} />
      <main>
        <HeroSection />
        <JourneySection />
        <OriginAndCapabilities />
        <RolesSection />
        <ScenarioSection />
        <StellarSection />
        <FaqSection />
        <FinalCta />
      </main>
      <footer className="border-t border-aid-ink/10 px-4 py-8 text-center text-sm text-aid-slate">
        Aethyr Aid — verified typhoon relief payments on Stellar. {aidScopeClaims.wallets}{" "}
        {aidScopeClaims.privacy}
      </footer>
    </div>
    </MotionConfig>
  );
}
