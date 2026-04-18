"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  Award, CreditCard, ChevronRight, Target, HeartHandshake,
  TrendingUp, Plus, Clock, CheckCircle, AlertCircle, ArrowUpRight,
} from "lucide-react";
import ScoreEntry from "./ScoreEntry";
import EmptyState from "@/components/ui/EmptyState";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 26 } } };

function Marquee({ text, dark = false }: { text: string; dark?: boolean }) {
  const repeated = Array(12).fill(text);
  return (
    <div className={`overflow-hidden py-3 border-y ${dark ? "border-onyx-border bg-onyx" : "border-cream-border bg-cream-dim"}`}>
      <div className="flex animate-marquee whitespace-nowrap select-none">
        {repeated.map((t, i) => (
          <span key={i} className={`text-xs font-black uppercase tracking-[0.28em] px-8 ${dark ? "text-onyx-muted" : "text-ink-faint"}`}>
            {t} ◆
          </span>
        ))}
      </div>
    </div>
  );
}

export default function DashboardOverviewClient({ dbUser, scores, nextDraw, charity, winnings }: any) {
  const isActive = dbUser.subscription_status === "active";
  const renewalDate = dbUser.subscription_renewal_date
    ? new Date(dbUser.subscription_renewal_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : null;
  const scoreCount = scores?.length ?? 0;
  const existingDates = (scores ?? []).map((s: any) => s.score_date);
  const avgScore = scoreCount > 0
    ? (scores.reduce((a: number, s: any) => a + s.score, 0) / scoreCount).toFixed(1)
    : "—";

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-0 -mx-6 md:-mx-8 lg:-mx-12">

      {/* ── HEADER ── */}
      <motion.section variants={item} className="px-6 md:px-8 lg:px-12 pt-2 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <div>
            <p className="text-2xs font-black uppercase tracking-[0.3em] text-ink-faint mb-2 flex items-center gap-2">
              <span className="w-6 h-px bg-ink-faint" /> Dashboard
            </p>
            <h1 className="text-5xl md:text-6xl font-black text-ink leading-none tracking-tight">
              {dbUser.full_name?.split(" ")[0] || "Player"}<span className="text-violet">.</span>
            </h1>
            <p className="text-ink-muted text-sm font-medium mt-2">
              {isActive ? "Everything's looking good — keep those scores coming." : "Subscribe to unlock your monthly draw entry."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!isActive && (
              <Link href="/subscribe"
                className="inline-flex items-center gap-2 bg-violet text-cream text-xs font-black px-5 py-3 uppercase tracking-widest hover:bg-coral transition-colors">
                Subscribe <ArrowUpRight size={13} />
              </Link>
            )}
            <Link href="/dashboard/scores"
              className="inline-flex items-center gap-2 border border-cream-border text-ink text-xs font-bold px-5 py-3 uppercase tracking-widest hover:bg-cream-dim transition-colors">
              <Plus size={13} /> Add Score
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ── MARQUEE ── */}
      <Marquee text="Score entries · Monthly draws · Charity impact · Prize pool · Rankings" />

      {/* ── EDITORIAL STAT STRIP ── */}
      <motion.section variants={item} className="grid grid-cols-2 lg:grid-cols-4 border-b border-cream-border divide-x divide-y lg:divide-y-0 divide-cream-border">
        {/* Subscription */}
        <div className={`p-7 md:p-10 ${isActive ? "bg-lime" : "bg-cream"}`}>
          <p className={`text-2xs font-black uppercase tracking-[0.28em] mb-5 ${isActive ? "text-ink/50" : "text-ink-faint"}`}>
            Plan
          </p>
          <p className={`text-4xl font-black font-mono leading-none mb-2 ${isActive ? "text-ink" : "text-ink"}`}>
            {isActive ? "Active" : "None"}
          </p>
          <p className={`text-xs font-semibold ${isActive ? "text-ink/60" : "text-ink-muted"}`}>
            {renewalDate ? `Renews ${renewalDate}` : isActive ? dbUser.subscription_plan : "No active plan"}
          </p>
        </div>

        {/* Scores */}
        <div className={`p-7 md:p-10 ${scoreCount === 5 ? "bg-onyx" : "bg-cream"}`}>
          <p className={`text-2xs font-black uppercase tracking-[0.28em] mb-5 ${scoreCount === 5 ? "text-onyx-muted" : "text-ink-faint"}`}>
            Scores
          </p>
          <p className={`text-4xl font-black font-mono leading-none mb-2 ${scoreCount === 5 ? "text-cream" : "text-ink"}`}>
            {scoreCount}/5
          </p>
          <p className={`text-xs font-semibold ${scoreCount === 5 ? "text-onyx-muted" : "text-ink-muted"}`}>
            {scoreCount === 5 ? "Draw eligible ✓" : `${5 - scoreCount} more needed`}
          </p>
        </div>

        {/* Avg Score */}
        <div className="p-7 md:p-10 bg-cream">
          <p className="text-2xs font-black uppercase tracking-[0.28em] text-ink-faint mb-5">Avg. Score</p>
          <p className="text-4xl font-black font-mono text-ink leading-none mb-2">{avgScore}</p>
          <p className="text-xs font-semibold text-ink-muted">Stableford points</p>
        </div>

        {/* Next Draw */}
        <div className="p-7 md:p-10 bg-violet">
          <p className="text-2xs font-black uppercase tracking-[0.28em] text-white/30 mb-5">Next Draw</p>
          <p className="text-4xl font-black font-mono text-cream leading-none mb-2">
            {nextDraw
              ? new Date(nextDraw.draw_month).toLocaleDateString("en-GB", { month: "short", year: "2-digit" })
              : "TBD"}
          </p>
          <p className="text-xs font-semibold text-white/40">
            {isActive && scoreCount === 5 ? "Entry confirmed ✓" : "Scores required"}
          </p>
        </div>
      </motion.section>

      {/* ── SCORE TRACKER + CHARITY ── */}
      <motion.section variants={item} className="grid grid-cols-1 lg:grid-cols-3 border-b border-cream-border divide-y lg:divide-y-0 lg:divide-x divide-cream-border">

        {/* Score entry + bars */}
        <div className="lg:col-span-2 p-7 md:p-10 bg-cream">
          <div className="flex items-center justify-between mb-7">
            <div>
              <p className="text-2xs font-black uppercase tracking-[0.28em] text-ink-faint mb-1.5">Monthly Scores</p>
              <h2 className="text-2xl font-black text-ink">Score Track</h2>
            </div>
            <Link href="/dashboard/scores" className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-ink-muted hover:text-violet transition-colors">
              Manage <ArrowUpRight size={12} />
            </Link>
          </div>

          {/* Score bars */}
          <div className="space-y-3 mb-8">
            {scoreCount === 0 ? (
              <div className="h-24 flex items-center justify-center border-2 border-dashed border-cream-border">
                <p className="text-xs text-ink-faint font-semibold uppercase tracking-widest">No scores logged yet</p>
              </div>
            ) : (
              scores.slice(0, 5).map((s: any, i: number) => (
                <div key={s.id} className="flex items-center gap-4">
                  <p className="text-2xs font-mono font-bold text-ink-faint w-20 shrink-0">
                    {new Date(s.score_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </p>
                  <div className="flex-1 h-1.5 bg-cream-dim">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(s.score / 45) * 100}%` }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                      className={`h-full ${s.score >= 36 ? "bg-lime" : s.score >= 28 ? "bg-violet" : "bg-ink-faint"}`}
                    />
                  </div>
                  <p className="text-sm font-black font-mono text-ink w-8 text-right">{s.score}</p>
                </div>
              ))
            )}
          </div>

          {/* Capacity pips */}
          <div className="flex items-center gap-1.5 mb-8">
            {[1,2,3,4,5].map(n => (
              <div key={n} className={`h-1.5 flex-1 transition-colors duration-300 ${n <= scoreCount ? "bg-lime" : "bg-cream-dim border border-cream-border"}`} />
            ))}
            <p className="text-2xs font-black font-mono text-ink-faint ml-2 shrink-0">{scoreCount}/5</p>
          </div>

          {/* Quick add */}
          <div className="border-t border-cream-border pt-7">
            <p className="text-2xs font-black uppercase tracking-[0.28em] text-ink-faint mb-5">Quick Entry</p>
            <ScoreEntry scoresCount={scoreCount} existingDates={existingDates} onScoreAdded={() => window.location.reload()} />
          </div>
        </div>

        {/* Charity column */}
        <div className="bg-onyx p-7 md:p-10 flex flex-col justify-between">
          <div>
            <p className="text-2xs font-black uppercase tracking-[0.28em] text-onyx-muted mb-2">Your Charity</p>
            <h2 className="text-2xl font-black text-cream mb-2">
              {charity?.name ?? "Not selected"}
            </h2>
            <p className="text-sm text-onyx-muted font-medium">
              {dbUser.charity_contribution_percentage ?? 10}% of your plan supports this cause
            </p>
          </div>

          <div className="mt-10 space-y-3">
            <div className="border border-onyx-border p-5">
              <p className="text-2xs font-black text-onyx-muted uppercase tracking-widest mb-2">Contribution Rate</p>
              <p className="text-4xl font-black font-mono text-lime">
                {dbUser.charity_contribution_percentage ?? 10}%
              </p>
            </div>
            <Link href="/dashboard/charity"
              className="flex items-center justify-between w-full border border-onyx-border hover:border-lime/40 text-onyx-muted hover:text-lime font-black text-xs px-5 py-4 uppercase tracking-widest transition-colors group">
              <span>{charity ? "Change Charity" : "Select Charity"}</span>
              <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ── MARQUEE 2 ── */}
      <Marquee text="Prize history · Draw results · Verification · Payout status · Monthly winnings" dark />

      {/* ── WINNINGS ── */}
      <motion.section variants={item} className="px-6 md:px-8 lg:px-12 py-10">
        <div className="flex items-center justify-between mb-7">
          <div>
            <p className="text-2xs font-black uppercase tracking-[0.28em] text-ink-faint mb-1.5">Prize History</p>
            <h2 className="text-2xl font-black text-ink">Recent Winnings</h2>
          </div>
          <Link href="/dashboard/winnings"
            className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-ink-muted hover:text-violet transition-colors">
            View All <ArrowUpRight size={12} />
          </Link>
        </div>

        {!winnings || winnings.length === 0 ? (
          <div className="border-2 border-dashed border-cream-border">
            <EmptyState icon={Award} title="No winnings yet"
              description="Keep your 5 scores current to be eligible for the monthly draw." />
          </div>
        ) : (
          <div className="border border-cream-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[500px]">
                <thead className="bg-cream-dim border-b border-cream-border">
                  <tr>
                    {["Draw", "Tier", "Prize", "Status"].map(h => (
                      <th key={h} className="px-6 py-4 text-left text-2xs font-black text-ink-faint uppercase tracking-[0.25em]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-border bg-cream">
                  {winnings.map((w: any) => (
                    <tr key={w.id} className="hover:bg-cream-dim transition-colors">
                      <td className="px-6 py-4 font-bold text-ink font-mono text-sm">{w.draws?.draw_month}</td>
                      <td className="px-6 py-4">
                        <span className="text-2xs font-black uppercase tracking-widest text-ink-muted border border-cream-border px-2.5 py-1">
                          {w.match_type?.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-black text-ink font-mono text-lg">£{w.prize_amount?.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        {w.payment_status === "paid"
                          ? <span className="text-2xs font-black uppercase tracking-widest text-ink bg-lime px-2.5 py-1">Paid</span>
                          : <span className="text-2xs font-black uppercase tracking-widest text-cream bg-violet px-2.5 py-1">Pending</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.section>

    </motion.div>
  );
}
