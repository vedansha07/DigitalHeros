"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, Database, Cpu, HeartHandshake, CreditCard, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import PublicNavbar from "@/components/layout/PublicNavbar";

const FAQs = [
  { q: "Is this a lottery or gambling?", a: "No. Digital Heros uses deterministic logic. Users generate entry parameters through verified physical effort (submitting golf Stableford scores). Payouts are fractional distributions of a pre-determined subscription pool based on score correlation — no probabilistic gambling loops." },
  { q: "How do I qualify for the draw?", a: "Two conditions: 1) Maintain an active Stripe subscription at the time of the draw. 2) Log exactly five (5) Stableford score entries between 1–45 through your Dashboard before the monthly deadline." },
  { q: "What happens if I log more than 5 scores?", a: "A database trigger handles overflow automatically. Adding a 6th score drops your oldest entry, keeping your rolling set at exactly 5 data points — always." },
  { q: "Where does the charity contribution go?", a: "Between 10% and 100% of your net subscription amount is dedicated to your chosen charity. You control the percentage and recipient inside your Dashboard. If unconfigured, it defaults to the Featured Charity." },
  { q: "Who runs the monthly draws?", a: "All draws are processed via Next.js serverless functions. Administrators initialise monthly sweeps. The algorithm either draws randomly or clusters by frequency. Data is immutable once published." },
  { q: "How does rollover work?", a: "If no user matches all 5 numbers (Tier 1), the 40% allocation rolls into the next month's Tier 1 pot as a progressive jackpot. Tiers 2 and 3 distribute to whoever qualifies each month." },
  { q: "How do I claim my prize?", a: "Winners are notified via the Dashboard. Upload a certified scorecard photograph as proof. Admins review and approve, then issue payment directly via Stripe." },
  { q: "Can I cancel my membership?", a: "Yes. Cancellation stops billing immediately. You retain access until the end of the current billing period. After that, your scores are excluded from future draws." },
];

const steps = [
  { num: "01", icon: CreditCard, label: "Subscribe", color: "text-lime bg-lime/10 border-lime/20", body: "Choose Monthly or Yearly. Your subscription funds the prize pool and routes your selected % directly to your charity on every renewal." },
  { num: "02", icon: Database, label: "Log Scores", color: "text-violet-light bg-violet/10 border-violet/20", body: "Play golf. Log exactly five Stableford scores (1–45) through your dashboard each month to earn your draw entry." },
  { num: "03", icon: Cpu, label: "Draw Runs", color: "text-coral bg-coral/10 border-coral/20", body: "On the 1st of each month, our algorithm draws 5 numbers from 1–45. Matches are checked against all eligible entries automatically." },
  { num: "04", icon: HeartHandshake, label: "Win & Give", color: "text-lime bg-lime/10 border-lime/20", body: "Match 3, 4, or 5 numbers and receive your tier's % of the pool. Meanwhile your charity receives its share every single month." },
];

function Marquee({ text, dark = false }: { text: string; dark?: boolean }) {
  const items = Array(14).fill(text);
  return (
    <div className={`overflow-hidden py-3.5 border-y ${dark ? "border-onyx-border bg-onyx" : "border-cream-border bg-cream-dim"}`}>
      <div className="flex animate-marquee whitespace-nowrap select-none">
        {items.map((t, i) => (
          <span key={i} className={`text-xs font-black uppercase tracking-[0.25em] px-7 ${dark ? "text-onyx-muted" : "text-ink-faint"}`}>
            {t} ◆
          </span>
        ))}
      </div>
    </div>
  );
}

function Reveal({ children, delay = 0, className = "" }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8%" }} transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}>
      {children}
    </motion.div>
  );
}

export default function HowItWorksClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="bg-cream text-ink min-h-screen">
      <PublicNavbar />

      {/* ── HERO ── */}
      <section className="pt-28 pb-16 px-6 lg:px-12 border-b border-cream-border max-w-[1400px] mx-auto">
        <Reveal>
          <p className="text-xs font-black uppercase tracking-[0.35em] text-ink-faint mb-4 flex items-center gap-2">
            <span className="w-8 h-px bg-ink-faint" /> Documentation
          </p>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-none">
              How it<br /><span className="text-violet">works.</span>
            </h1>
            <p className="text-base text-ink-muted font-medium max-w-sm leading-relaxed">
              A transparent, subscription-based platform that turns your golf scores into prize draw entries — while automatically supporting charity.
            </p>
          </div>
        </Reveal>
      </section>

      <Marquee text="Stableford scoring · Monthly draws · Charity distribution · Prize tiers · Transparent algorithm" />

      {/* ── 4 STEPS GRID ── */}
      <section className="border-b border-cream-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
          <Reveal className="mb-14">
            <p className="text-xs font-black uppercase tracking-[0.35em] text-ink-faint mb-3 flex items-center gap-2">
              <span className="w-8 h-px bg-ink-faint" /> Phase Loops
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Four phases.</h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-cream-border divide-y md:divide-y-0 md:divide-x divide-cream-border">
            {steps.map(({ num, icon: Icon, label, color, body }, i) => (
              <Reveal key={num} delay={i * 0.07} className={`p-8 md:p-10 bg-cream hover:bg-cream-dim transition-colors flex flex-col justify-between gap-8`}>
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 border flex items-center justify-center ${color}`}>
                    <Icon size={20} />
                  </div>
                  <span className="text-5xl font-black font-mono text-cream-border leading-none">{num}</span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-ink mb-2">{label}</h3>
                  <p className="text-sm text-ink-muted leading-relaxed">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── DISTRIBUTION MATRIX — dark section ── */}
      <section className="bg-onyx text-cream border-b border-onyx-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
          <Reveal className="mb-14">
            <p className="text-xs font-black uppercase tracking-[0.35em] text-onyx-muted mb-3 flex items-center gap-2">
              <span className="w-8 h-px bg-onyx-muted" /> Prize Physics
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-cream">Distribution matrix.</h2>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-onyx-border divide-y lg:divide-y-0 lg:divide-x divide-onyx-border">
            {/* Explanation */}
            <Reveal className="p-10 md:p-14 flex flex-col gap-6">
              <p className="text-onyx-muted text-base leading-relaxed font-medium">
                The platform relies on determinative validation logic instead of probability loops. When you subscribe, your fee is split between the global prize pool and your selected charity.
              </p>
              <p className="text-onyx-muted text-base leading-relaxed font-medium">
                The <span className="text-cream font-bold">Global Pool</span> is divided into three tiers the moment the draw executes. Tier 1 (5 matches) rolls over to next month if unclaimed — building a progressive jackpot.
              </p>
              <div className="border border-onyx-border p-6 mt-4">
                <p className="text-2xs font-black uppercase tracking-widest text-onyx-muted mb-2">Score Range</p>
                <p className="text-2xl font-black font-mono text-cream">1 — 45</p>
                <p className="text-xs text-onyx-muted mt-1">Stableford points per round</p>
              </div>
            </Reveal>

            {/* Tier breakdown */}
            <div className="divide-y divide-onyx-border">
              {[
                { pct: "40%", label: "Tier 1 — 5 Matches", desc: "Full house. Rolls over if no winner that month.", bg: "bg-lime text-ink" },
                { pct: "35%", label: "Tier 2 — 4 Matches", desc: "Split equally among all 4-match winners.", bg: "bg-violet text-cream" },
                { pct: "25%", label: "Tier 3 — 3 Matches", desc: "Base tier. Split among all 3-match qualifiers.", bg: "bg-coral text-cream" },
              ].map(({ pct, label, desc, bg }) => (
                <Reveal key={label} className="p-8 md:p-10 flex items-center gap-6 bg-onyx hover:bg-onyx-card transition-colors">
                  <div className={`w-16 h-16 shrink-0 font-black text-2xl font-mono flex items-center justify-center ${bg}`}>
                    {pct}
                  </div>
                  <div>
                    <p className="font-black text-cream text-sm mb-1">{label}</p>
                    <p className="text-xs text-onyx-muted">{desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Marquee text="Rollover jackpot · Tier distribution · Score verification · Admin approval · Stripe payouts" dark />

      {/* ── FAQ ── */}
      <section className="border-b border-cream-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
          <Reveal className="mb-14">
            <p className="text-xs font-black uppercase tracking-[0.35em] text-ink-faint mb-3 flex items-center gap-2">
              <span className="w-8 h-px bg-ink-faint" /> FAQs
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Common questions.</h2>
          </Reveal>

          <div className="border border-cream-border divide-y divide-cream-border">
            {FAQs.map((faq, i) => (
              <div key={i}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 md:px-8 py-6 flex items-center justify-between text-left hover:bg-cream-dim transition-colors group">
                  <span className="font-black text-base text-ink pr-6">{faq.q}</span>
                  <div className={`w-8 h-8 border flex items-center justify-center shrink-0 transition-colors ${openFaq === i ? "border-violet bg-violet text-cream" : "border-cream-border text-ink-faint group-hover:border-ink-faint"}`}>
                    <ChevronDown size={15} className={`transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }} className="overflow-hidden">
                      <div className="px-6 md:px-8 py-6 text-sm text-ink-muted leading-relaxed border-t border-cream-border bg-cream-dim font-medium">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-violet">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.35em] text-white/40 mb-4 flex items-center gap-2">
                <span className="w-8 h-px bg-white/30" /> Get Started
              </p>
              <h2 className="text-5xl md:text-6xl font-black text-cream leading-none">Ready to play?</h2>
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/subscribe"
                className="inline-flex items-center gap-2 bg-lime text-ink font-black px-8 py-4 text-xs uppercase tracking-widest hover:bg-lime/80 transition-colors">
                Subscribe Now <ArrowUpRight size={14} />
              </Link>
              <p className="text-xs text-white/30 font-medium">Cancel anytime · No hidden fees</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink border-t border-onyx-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-6 flex items-center justify-between gap-4">
          <span className="font-black text-lg tracking-tighter text-cream">digital<span className="text-lime">heros</span></span>
          <p className="text-xs text-onyx-muted">© {new Date().getFullYear()} Digital Heros</p>
        </div>
      </footer>
    </div>
  );
}
