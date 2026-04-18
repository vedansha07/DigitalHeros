"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, HeartHandshake, Target, Users, TrendingUp, Layers, Cpu } from "lucide-react";
import PublicNavbar from "@/components/layout/PublicNavbar";

/* ── Animated counter ── */
function Counter({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView || target <= 0) return;
    let start = 0;
    const step = target / 60;
    const t = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(t); }
      else setVal(Math.floor(start));
    }, 20);
    return () => clearInterval(t);
  }, [inView, target]);
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

/* ── Fade-in-up on scroll ── */
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

/* ── Marquee strip ── */
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

/* ══ MAIN COMPONENT ══════════════════════════════════════════ */
export default function PublicHomeClient({ featuredCharity, pendingDraw, usersCount, totalDonated }: any) {
  const displayPool = pendingDraw?.total_prize_pool ?? 0;

  return (
    <div className="bg-cream text-ink selection:bg-lime/40">
      <PublicNavbar />

      {/* ════ HERO — Editorial split ════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col pt-16 overflow-hidden bg-cream">
        {/* Subtle dot bg */}
        <div className="absolute inset-0 bg-dot opacity-100 pointer-events-none" />

        {/* Big heading block */}
        <div className="relative z-10 flex-1 flex flex-col justify-center max-w-[1400px] mx-auto w-full px-6 lg:px-12">

          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-black uppercase tracking-[0.35em] text-violet mb-6 flex items-center gap-2"
          >
            <span className="w-8 h-px bg-violet inline-block" /> Golf · Charity · Monthly Prizes
          </motion.p>

          {/* Massive editorial headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(3.5rem,10vw,9rem)] font-black leading-[0.92] tracking-tight text-balance mb-8"
          >
            Play Golf.<br />
            <span className="italic font-black text-violet">Give Back.</span><br />
            <span className="relative inline-block">
              Win Monthly.
              <span className="absolute -bottom-2 left-0 right-0 h-1.5 bg-lime rounded-full" />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.18 }}
            className="text-base md:text-lg text-ink-muted font-medium max-w-xl mb-10 leading-relaxed"
          >
            Log your Stableford scores each month, support a charity you love,
            and automatically enter a transparent algorithmic prize draw.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="flex flex-wrap gap-3 items-center"
          >
            <Link href="/subscribe"
              className="inline-flex items-center gap-2 bg-ink text-cream font-black px-8 py-4 text-sm uppercase tracking-widest hover:bg-violet transition-colors hover:shadow-violet-glow"
            >
              Get Started <ArrowUpRight size={16} />
            </Link>
            <Link href="/how-it-works"
              className="inline-flex items-center gap-2 border border-cream-border text-ink font-bold px-8 py-4 text-sm uppercase tracking-widest hover:bg-cream-dim transition-colors"
            >
              How It Works <ArrowUpRight size={14} className="text-ink-faint" />
            </Link>
          </motion.div>

          {/* Live prize pool pill */}
          {displayPool > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="mt-10 inline-flex items-center gap-3 border border-lime bg-lime/10 px-5 py-2.5 w-fit text-sm font-bold text-ink"
            >
              <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
              <span>Live prize pool: <span className="font-black display-num">£{displayPool.toFixed(2)}</span></span>
            </motion.div>
          )}
        </div>

        {/* Bottom border */}
        <div className="border-t border-cream-border" />
      </section>

      {/* ════ MARQUEE ════════════════════════════════════════════ */}
      <Marquee text="Monthly prize draw · Stableford scoring · Charity impact · Algorithmic distribution · Transparent results" />

      {/* ════ STATS — Insider "nowadays" style grid ═════════════ */}
      <section className="border-b border-cream-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
          <Reveal className="mb-16">
            <p className="text-xs font-black uppercase tracking-[0.35em] text-ink-faint mb-3 flex items-center gap-2">
              <span className="w-8 h-px bg-ink-faint" /> Impact Numbers
            </p>
            <h2 className="text-5xl md:text-6xl font-black tracking-tight">By the numbers.</h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-cream-border border border-cream-border">
            {[
              { icon: Users, val: usersCount, prefix: "", suffix: "+", label: "Active Members", sub: "And growing monthly", color: "text-violet" },
              { icon: HeartHandshake, val: Math.floor(totalDonated), prefix: "£", suffix: "", label: "Donated to Charity", sub: "Across all partner organisations", color: "text-coral" },
              { icon: TrendingUp, val: Math.floor(displayPool), prefix: "£", suffix: "", label: "Current Prize Pool", sub: "Draws on the 1st of each month", color: "text-lime bg-lime/10 px-1 py-0.5" },
            ].map(({ icon: Icon, val, prefix, suffix, label, sub, color }) => (
              <Reveal key={label} className="p-10 md:p-14 flex flex-col justify-between bg-cream hover:bg-cream-dim transition-colors group">
                <Icon size={28} className={`${color} mb-10`} />
                <div>
                  <p className="text-6xl font-black font-mono tracking-tight text-ink display-num mb-2">
                    <Counter target={val} prefix={prefix} suffix={suffix} />
                  </p>
                  <p className="text-sm font-black uppercase tracking-widest text-ink mb-1">{label}</p>
                  <p className="text-xs text-ink-muted">{sub}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════ HOW IT WORKS — Insider "services" style ═══════════ */}
      <section className="bg-onyx text-cream border-b border-onyx-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">

          {/* Section label + header */}
          <Reveal className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.35em] text-onyx-muted mb-3 flex items-center gap-2">
                <span className="w-8 h-px bg-onyx-muted" /> The System
              </p>
              <h2 className="text-5xl md:text-7xl font-black tracking-tight text-cream leading-none">
                Three steps.
              </h2>
            </div>
            <p className="text-base text-onyx-muted font-medium max-w-xs leading-relaxed">
              The entire platform runs on a transparent, automated algorithm. Zero complexity.
            </p>
          </Reveal>

          {/* 3-col grid like Insider's services */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-onyx-border border border-onyx-border">
            {[
              { num: "01", icon: Layers, label: "Subscribe", color: "text-lime", body: "Choose your monthly or yearly plan. Your subscription funds the prize pool and auto-donates your chosen % to a charity on every renewal." },
              { num: "02", icon: Target, label: "Log Scores", color: "text-violet-light", body: "Enter up to 5 Stableford scores each month. A completed set automatically qualifies you for that month's algorithmic draw." },
              { num: "03", icon: Cpu, label: "Win Prizes", color: "text-coral", body: "The algorithm draws 5 numbers from 1–45. Match 3, 4, or all 5 and receive your tier's percentage of the total pool — automatically." },
            ].map(({ num, icon: Icon, label, color, body }, i) => (
              <Reveal key={num} delay={i * 0.08}
                className="p-10 md:p-14 bg-onyx hover:bg-onyx-card transition-colors group flex flex-col justify-between gap-10"
              >
                <div className="flex items-start justify-between">
                  <Icon size={28} className={color} />
                  <span className="text-6xl font-black text-onyx-border font-mono leading-none">{num}</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-cream mb-3">{label}</h3>
                  <p className="text-sm text-onyx-muted leading-relaxed mb-6">{body}</p>
                  <Link href="/how-it-works" className="arrow-link text-onyx-muted hover:text-cream">
                    Learn more <ArrowUpRight size={13} />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════ MARQUEE 2 — dark ════════════════════════════════════ */}
      <Marquee text="Prize pool · Charity donations · Score matching · Draw algorithm · Transparent payouts" dark />

      {/* ════ PRIZE TIERS — "Success Cases" style ══════════════ */}
      <section className="border-b border-cream-border bg-cream">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
          <Reveal className="mb-16">
            <p className="text-xs font-black uppercase tracking-[0.35em] text-ink-faint mb-3 flex items-center gap-2">
              <span className="w-8 h-px bg-ink-faint" /> Prize Structure
            </p>
            <h2 className="text-5xl md:text-6xl font-black tracking-tight">Prize tiers.</h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-cream-border border border-cream-border">
            {[
              { pct: "40%", label: "5 Matches", desc: "Full house — includes any rollover from previous months.", accent: "bg-lime text-ink" },
              { pct: "35%", label: "4 Matches", desc: "Split equally among all 4-match winners that month.", accent: "bg-violet text-cream" },
              { pct: "25%", label: "3 Matches", desc: "Base tier — split equally among all 3-match qualifiers.", accent: "bg-coral text-cream" },
            ].map(({ pct, label, desc, accent }, i) => (
              <Reveal key={label} delay={i * 0.07} className="bg-cream hover:bg-cream-dim transition-colors p-10 md:p-14 flex flex-col gap-8">
                <div className={`inline-flex items-center justify-center w-20 h-20 font-black text-3xl font-mono ${accent}`}>
                  {pct}
                </div>
                <div>
                  <h3 className="text-xl font-black text-ink mb-2">{label}</h3>
                  <p className="text-sm text-ink-muted leading-relaxed">{desc}</p>
                </div>
                <Link href="/how-it-works" className="arrow-link text-ink-faint hover:text-ink mt-auto">
                  Rules <ArrowUpRight size={13} />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════ CHARITY SPOTLIGHT ══════════════════════════════════ */}
      {featuredCharity && (
        <section className="bg-onyx border-b border-onyx-border">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
            <Reveal>
              <div className="grid grid-cols-1 lg:grid-cols-2 border border-onyx-border">
                {/* Text */}
                <div className="p-10 md:p-16 lg:border-r border-onyx-border">
                  <p className="text-xs font-black uppercase tracking-[0.35em] text-onyx-muted mb-6 flex items-center gap-2">
                    <span className="w-8 h-px bg-onyx-muted" /> Featured Charity
                  </p>
                  <h2 className="text-4xl md:text-5xl font-black text-cream mb-5 leading-tight">{featuredCharity.name}</h2>
                  <p className="text-onyx-muted text-base leading-relaxed mb-10 max-w-md">{featuredCharity.description}</p>
                  <div className="flex flex-wrap gap-3">
                    <Link href={`/charities/${featuredCharity.id}`}
                      className="inline-flex items-center gap-2 bg-lime text-ink font-black px-7 py-3.5 text-sm uppercase tracking-widest hover:bg-lime/80 transition-colors">
                      View Profile <ArrowUpRight size={14} />
                    </Link>
                    <Link href="/charities"
                      className="inline-flex items-center gap-2 border border-onyx-border text-onyx-muted font-bold px-7 py-3.5 text-sm uppercase tracking-widest hover:text-cream hover:border-cream/20 transition-colors">
                      All Charities <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </div>

                {/* Logo / visual */}
                <div className="p-10 md:p-16 flex items-center justify-center bg-onyx-card">
                  {featuredCharity.logo_url ? (
                    <div className="h-40 w-40 bg-cream/5 border border-onyx-border p-6 flex items-center justify-center">
                      <img src={featuredCharity.logo_url} alt={featuredCharity.name} className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="h-40 w-40 bg-lime/10 border border-lime/20 flex items-center justify-center">
                      <HeartHandshake size={48} className="text-lime" />
                    </div>
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ════ FINAL CTA ══════════════════════════════════════════ */}
      <section className="bg-violet relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-onyx opacity-40" />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <p className="text-xs font-black uppercase tracking-[0.35em] text-white/40 mb-5 flex items-center gap-2">
                <span className="w-8 h-px bg-white/30" />
                {pendingDraw ? `Next draw: ${pendingDraw.draw_month}` : "Join the platform"}
              </p>
              <h2 className="text-6xl md:text-8xl font-black leading-none tracking-tighter text-cream">
                Ready to<br />
                <span className="text-lime">play?</span>
              </h2>
            </Reveal>
            <Reveal delay={0.12} className="flex flex-col gap-6">
              <p className="text-white/60 text-lg leading-relaxed font-medium max-w-md">
                Subscribe today, log your monthly Stableford scores, and automatically support a cause
                you believe in — while competing for cash prizes.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/subscribe"
                  className="inline-flex items-center gap-2 bg-lime text-ink font-black px-8 py-4 text-sm uppercase tracking-widest hover:bg-lime/80 transition-colors shadow-glow-sm">
                  Get Started <ArrowUpRight size={16} />
                </Link>
                <Link href="/charities"
                  className="inline-flex items-center gap-2 border border-white/20 text-white/70 font-bold px-8 py-4 text-sm uppercase tracking-widest hover:text-cream hover:border-white/40 transition-colors">
                  Browse Charities <ArrowUpRight size={14} />
                </Link>
              </div>
              <p className="text-xs text-white/30 font-medium">Cancel anytime · No hidden fees · Secure via Stripe</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════ FOOTER — Insider multi-column style ═══════════════ */}
      <footer className="bg-ink text-cream border-t border-onyx-border">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          {/* Top row */}
          <div className="py-14 grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-onyx-border">
            {/* Brand */}
            <div className="md:col-span-1">
              <span className="text-xl font-black tracking-tighter text-cream block mb-3">
                DIGITAL<span className="text-lime">HEROS</span>
              </span>
              <p className="text-xs text-onyx-muted leading-relaxed">
                Golf, charity, and monthly prizes — fully automated.
              </p>
            </div>

            {/* Nav columns */}
            {[
              {
                label: "platform ↗",
                links: [{ href: "/how-it-works", label: "How It Works" }, { href: "/subscribe", label: "Pricing" }],
              },
              {
                label: "community ↗",
                links: [{ href: "/charities", label: "Charities" }, { href: "/charities", label: "Our Partners" }],
              },
              {
                label: "account ↗",
                links: [{ href: "/login", label: "Sign In" }, { href: "/signup", label: "Create Account" }, { href: "/dashboard", label: "Dashboard" }],
              },
            ].map(col => (
              <div key={col.label}>
                <p className="text-2xs font-black uppercase tracking-[0.3em] text-onyx-muted mb-5">{col.label}</p>
                <ul className="space-y-3">
                  {col.links.map(l => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm text-onyx-muted hover:text-cream transition-colors underline-anim">{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom row */}
          <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-onyx-muted">© {new Date().getFullYear()} Digital Heros. All rights reserved.</p>
            <p className="text-xs text-onyx-muted">Secure payments by <span className="text-cream font-semibold">Stripe</span></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
