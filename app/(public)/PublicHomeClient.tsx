"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  Target, Layers, HeartHandshake, ArrowRight,
  Cpu, Users, TrendingUp, ChevronRight, Shield, Zap,
} from "lucide-react";
import PublicNavbar from "@/components/layout/PublicNavbar";

/* ── Animation wrapper ─────────────────────────────────────── */
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Animated counter ──────────────────────────────────────── */
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

/* ══════════════════════════════════════════════════════════════ */

export default function PublicHomeClient({ featuredCharity, pendingDraw, usersCount, totalDonated }: any) {
  const displayPool = pendingDraw?.total_prize_pool ?? 0;

  return (
    <div className="bg-primary text-white selection:bg-accent/30">
      <PublicNavbar />

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Dot texture */}
        <div className="absolute inset-0 bg-dot opacity-100" />
        {/* Hero gradient glow */}
        <div className="absolute inset-0 bg-hero-gradient" />
        {/* Ambient orbs */}
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/8 rounded-full blur-[100px] pointer-events-none"
        />

        <div className="relative z-10 max-w-6xl mx-auto px-5 lg:px-8 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/6 border border-white/12 mb-10 backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase text-white/70">
              Live · Algorithmic Prize Distribution
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter leading-[1.04] mb-8 text-balance"
          >
            Golf. Charity.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-accent/80 to-white/70">
              Monthly Prizes.
            </span>
          </motion.h1>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-white/55 font-medium max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Log your Stableford scores, choose a charity to support,
            and enter the automated monthly prize draw — all in one platform.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/subscribe"
              className="group flex items-center gap-2 bg-accent text-primary font-black px-8 py-4 rounded-2xl text-base hover:bg-accent/90 transition-all hover:shadow-glow-md shadow-glow-sm"
            >
              Get Started
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/how-it-works"
              className="flex items-center gap-2 glass text-white/80 hover:text-white font-semibold px-8 py-4 rounded-2xl text-base hover:bg-white/10 transition-all"
            >
              How it works
              <ChevronRight size={16} className="text-white/40" />
            </Link>
          </motion.div>

          {/* Prize pool pill */}
          {displayPool > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-10 inline-flex items-center gap-3 glass px-5 py-3 rounded-xl"
            >
              <TrendingUp size={16} className="text-accent" />
              <span className="text-sm font-semibold text-white/70">
                Current prize pool:{" "}
                <span className="font-black text-white font-mono">£{displayPool.toFixed(2)}</span>
              </span>
            </motion.div>
          )}
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-primary to-transparent" />
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────── */}
      <section className="py-32 relative bg-primary-dark">
        <div className="absolute inset-0 bg-grid" />
        <div className="relative z-10 max-w-6xl mx-auto px-5 lg:px-8">
          <FadeUp>
            <p className="text-xs font-black tracking-widest text-accent uppercase mb-3">The System</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Three steps.<br />
              <span className="text-white/50">Zero complexity.</span>
            </h2>
            <p className="text-white/50 text-lg font-medium mb-20 max-w-xl">
              The entire platform runs on a transparent, automated algorithm. Here&apos;s exactly how it works.
            </p>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-[17%] right-[17%] h-px bg-gradient-to-r from-accent/40 via-accent/20 to-transparent" />

            {[
              {
                num: "01", icon: Layers, color: "text-accent", bg: "bg-accent/10 border-accent/20",
                title: "Subscribe",
                body: "Choose your plan. Your subscription funds the monthly prize pool and auto-donates your chosen percentage to your selected charity on every renewal.",
              },
              {
                num: "02", icon: Target, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20",
                title: "Log Scores",
                body: "Enter up to 5 Stableford scores each month. A completed set of 5 automatically qualifies you for that month&apos;s draw with a unique entry.",
              },
              {
                num: "03", icon: Cpu, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20",
                title: "Win Prizes",
                body: "The algorithm draws 5 numbers from 1–45. Match 3, 4, or 5 and you receive your tier percentage of the total prize pool — automatically.",
              },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <FadeUp key={step.num} delay={i * 0.1} className="relative z-10">
                  <div className={`flex flex-col bg-white/4 border border-white/8 rounded-3xl p-8 hover:bg-white/6 transition-colors h-full`}>
                    <div className={`h-14 w-14 rounded-2xl border ${step.bg} flex items-center justify-center mb-6 relative`}>
                      <Icon size={24} className={step.color} />
                      <span className="absolute -top-2.5 -right-2.5 h-6 w-6 bg-primary-dark border border-white/10 text-2xs font-black text-white/60 rounded-lg flex items-center justify-center">
                        {step.num}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-white mb-3">{step.title}</h3>
                    <p className="text-white/50 font-medium leading-relaxed text-sm">{step.body}</p>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PRIZE BREAKDOWN ────────────────────────────────────── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-dot" />
        <div className="relative z-10 max-w-6xl mx-auto px-5 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeUp>
              <p className="text-xs font-black tracking-widest text-accent uppercase mb-3">Prize Structure</p>
              <h2 className="text-4xl lg:text-5xl font-black tracking-tight mb-6">
                Transparent<br />distribution.
              </h2>
              <p className="text-white/50 text-lg font-medium mb-10 leading-relaxed">
                Every pound of the prize pool is accounted for. Three tiers, clear percentages, no hidden cuts.
              </p>
              <div className="flex items-center gap-4 glass px-6 py-4 rounded-2xl w-fit">
                <Shield size={20} className="text-accent shrink-0" />
                <div>
                  <p className="text-2xs font-bold text-white/40 uppercase tracking-widest">Current pool</p>
                  <p className="text-2xl font-black text-white font-mono">£{displayPool.toFixed(2)}</p>
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.15} className="space-y-4">
              {[
                { pct: "40%", label: "5 matches", desc: "Full house — includes any roll-overs from previous months.", color: "text-accent", bg: "bg-accent/10 border-accent/25" },
                { pct: "35%", label: "4 matches", desc: "Split equally among all 4-match winners that month.", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
                { pct: "25%", label: "3 matches", desc: "Base tier — split equally among all 3-match qualifiers.", color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
              ].map((tier) => (
                <div key={tier.label} className={`flex items-start gap-5 bg-white/4 border border-white/8 rounded-2xl p-6 hover:bg-white/6 transition-colors group`}>
                  <div className={`shrink-0 h-14 w-14 rounded-xl border ${tier.bg} flex items-center justify-center font-black text-xl ${tier.color} group-hover:scale-105 transition-transform font-mono`}>
                    {tier.pct}
                  </div>
                  <div>
                    <h3 className="font-black text-white mb-1">{tier.label}</h3>
                    <p className="text-sm text-white/45 font-medium leading-relaxed">{tier.desc}</p>
                  </div>
                </div>
              ))}
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── CHARITY SPOTLIGHT ──────────────────────────────────── */}
      {featuredCharity && (
        <section className="py-32 relative bg-primary-dark">
          <div className="absolute inset-0 bg-grid" />
          <div className="relative z-10 max-w-6xl mx-auto px-5 lg:px-8">
            <FadeUp>
              <div className="rounded-3xl overflow-hidden border border-white/8 bg-white/3 backdrop-blur-sm">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="p-10 md:p-14 flex flex-col justify-center">
                    <span className="inline-flex items-center gap-2 text-2xs font-black uppercase tracking-widest text-accent bg-accent/10 border border-accent/20 px-3 py-1.5 rounded-lg w-fit mb-6">
                      <Zap size={10} /> Featured Charity
                    </span>
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-5">{featuredCharity.name}</h2>
                    <p className="text-white/50 text-base font-medium leading-relaxed mb-8 max-w-md">
                      {featuredCharity.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        href={`/charities/${featuredCharity.id}`}
                        className="flex items-center justify-center gap-2 bg-accent text-primary font-black px-6 py-3 rounded-xl hover:bg-accent/90 transition-all text-sm"
                      >
                        View Profile <ArrowRight size={14} />
                      </Link>
                      <Link
                        href="/charities"
                        className="flex items-center justify-center gap-2 glass text-white/70 hover:text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all hover:bg-white/8"
                      >
                        All Charities <ChevronRight size={14} />
                      </Link>
                    </div>
                  </div>
                  {featuredCharity.logo_url && (
                    <div className="hidden lg:flex items-center justify-center p-14 bg-white/3 border-l border-white/8">
                      <div className="h-52 w-52 bg-white rounded-3xl p-8 shadow-2xl hover:rotate-3 transition-transform duration-500">
                        <img src={featuredCharity.logo_url} alt={featuredCharity.name} className="w-full h-full object-contain" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </FadeUp>
          </div>
        </section>
      )}

      {/* ── STATS ──────────────────────────────────────────────── */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-dot" />
        <div className="relative z-10 max-w-6xl mx-auto px-5 lg:px-8 text-center">
          <FadeUp>
            <p className="text-xs font-black tracking-widest text-accent uppercase mb-3">Impact</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-20">
              Numbers that matter.
            </h2>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Users, val: usersCount, prefix: "", suffix: "", label: "Active members", color: "text-accent" },
              { icon: HeartHandshake, val: totalDonated, prefix: "£", suffix: "", label: "Donated to charity", color: "text-rose-400" },
              { icon: TrendingUp, val: displayPool, prefix: "£", suffix: "", label: "Current prize pool", color: "text-indigo-400" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <FadeUp key={stat.label} className="bg-white/4 border border-white/8 rounded-3xl p-10 text-center hover:bg-white/6 transition-colors">
                  <Icon size={28} className={`${stat.color} mx-auto mb-5`} />
                  <p className="text-4xl lg:text-5xl font-black text-white font-mono mb-2 tabular-nums">
                    <Counter target={stat.val} prefix={stat.prefix} suffix={stat.suffix} />
                  </p>
                  <p className="text-sm font-bold text-white/40 uppercase tracking-widest">{stat.label}</p>
                </FadeUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────── */}
      <section className="py-32 relative overflow-hidden bg-primary-dark">
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-accent/6 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto px-5 lg:px-8 text-center">
          <FadeUp>
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase text-white/50 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              {pendingDraw ? `Next draw: ${pendingDraw.draw_month}` : "Join the platform"}
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-[1.05]">
              Ready to play<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent/60">
                with purpose?
              </span>
            </h2>
            <p className="text-white/50 text-lg font-medium mb-10 max-w-xl mx-auto leading-relaxed">
              Subscribe today, log your scores, and automatically support a cause you believe in — while competing for monthly prizes.
            </p>
            <Link
              href="/subscribe"
              className="group inline-flex items-center gap-3 bg-accent text-primary font-black px-10 py-5 rounded-2xl text-lg hover:bg-accent/90 transition-all hover:shadow-glow-lg shadow-glow-md"
            >
              Get Started Free
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="mt-6 text-xs font-medium text-white/30">Cancel anytime. No hidden fees.</p>
          </FadeUp>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className="border-t border-white/6 py-12">
        <div className="max-w-6xl mx-auto px-5 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="font-black text-xl tracking-tighter text-white">
            DIGITAL<span className="text-accent">HEROS</span>
          </span>
          <nav className="flex items-center gap-6 flex-wrap justify-center">
            {[
              { label: "How It Works", href: "/how-it-works" },
              { label: "Charities", href: "/charities" },
              { label: "Subscribe", href: "/subscribe" },
              { label: "Login", href: "/login" },
            ].map((l) => (
              <Link key={l.label} href={l.href} className="text-sm font-medium text-white/40 hover:text-white transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>
          <p className="text-xs text-white/25 font-medium">
            © {new Date().getFullYear()} Digital Heros
          </p>
        </div>
      </footer>
    </div>
  );
}
