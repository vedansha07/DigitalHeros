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
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 26 } } };

/* ── Marquee ticker (like the template's repeating labels) ── */
function Marquee({ text, dark = false }: { text: string; dark?: boolean }) {
  const repeated = Array(10).fill(text);
  return (
    <div className={`overflow-hidden py-3 border-y ${dark ? "border-white/10 bg-primary" : "border-surface-border bg-surface-subtle"}`}>
      <div className="flex animate-marquee whitespace-nowrap">
        {repeated.map((t, i) => (
          <span
            key={i}
            className={`text-xs font-black uppercase tracking-[0.3em] px-8 ${dark ? "text-white/20" : "text-muted-light"}`}
          >
            {t} ◆
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Big editorial stat block ── */
function BigStat({ label, value, sub, accent = false, dark = false }: any) {
  return (
    <div className={`p-7 flex flex-col justify-between h-full ${accent ? "bg-accent" : dark ? "bg-primary" : "bg-surface"}`}>
      <p className={`text-2xs font-black uppercase tracking-[0.25em] mb-6 ${accent ? "text-primary/60" : dark ? "text-white/30" : "text-muted-light"}`}>
        {label}
      </p>
      <div>
        <p className={`text-5xl font-black leading-none font-mono ${accent ? "text-primary" : dark ? "text-white" : "text-primary"}`}>
          {value}
        </p>
        {sub && (
          <p className={`text-sm font-semibold mt-3 ${accent ? "text-primary/70" : dark ? "text-white/40" : "text-muted"}`}>
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

export default function DashboardOverviewClient({ dbUser, scores, nextDraw, charity, winnings }: any) {
  const [scoreAdded, setScoreAdded] = useState(0);
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
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-0 -mx-6 md:-mx-8">

      {/* ── HERO HEADER ── */}
      <motion.section variants={item} className="px-6 md:px-8 pt-2 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <div>
            <p className="text-2xs font-black text-accent uppercase tracking-[0.3em] mb-2">Digital Heros / Dashboard</p>
            <h1 className="text-4xl md:text-5xl font-black text-primary leading-none tracking-tight">
              {dbUser.full_name?.split(" ")[0] || "Player"}<span className="text-accent">.</span>
            </h1>
            <p className="text-muted text-sm font-medium mt-2">
              {isActive ? "Your membership is active — play, log, win." : "Subscribe to unlock your monthly draw entry."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!isActive && (
              <Link href="/subscribe" className="inline-flex items-center gap-2 bg-accent text-primary text-sm font-black px-5 py-2.5 rounded-xl hover:shadow-glow-sm transition-all">
                Subscribe Now <ArrowUpRight size={14} />
              </Link>
            )}
            <Link href="/dashboard/scores" className="inline-flex items-center gap-2 border border-surface-border text-primary text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-surface-subtle transition-all">
              <Plus size={14} /> Add Score
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ── MARQUEE DIVIDER ── */}
      <Marquee text="Score entries · Monthly draws · Charity impact · Prize pool · Rankings" />

      {/* ── EDITORIAL STATS GRID ── */}
      <motion.section variants={item} className="grid grid-cols-2 lg:grid-cols-4 border-b border-surface-border divide-x divide-y lg:divide-y-0 divide-surface-border">
        <BigStat
          label="Subscription"
          value={isActive ? "Active" : "Inactive"}
          sub={renewalDate ? `Renews ${renewalDate}` : "No active plan"}
          accent={isActive}
        />
        <BigStat
          label="Score Entries"
          value={`${scoreCount}/5`}
          sub={scoreCount === 5 ? "Draw eligible ✓" : `${5 - scoreCount} more needed`}
          dark={true}
        />
        <BigStat
          label="Avg Score"
          value={avgScore}
          sub="Stableford points"
        />
        <BigStat
          label="Next Draw"
          value={nextDraw ? new Date(nextDraw.draw_month).toLocaleDateString("en-GB", { month: "short", year: "numeric" }) : "TBD"}
          sub={isActive && scoreCount === 5 ? "Entry confirmed ✓" : "Scores required"}
          dark={scoreCount === 5 && isActive}
        />
      </motion.section>

      {/* ── SCORE TRACKER + CHARITY BLOCK ── */}
      <motion.section variants={item} className="grid grid-cols-1 lg:grid-cols-3 border-b border-surface-border divide-y lg:divide-y-0 lg:divide-x divide-surface-border">

        {/* Score progress */}
        <div className="lg:col-span-2 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-2xs font-black text-muted-light uppercase tracking-[0.25em] mb-1">Score Track</p>
              <h2 className="text-xl font-black text-primary">Monthly Scores</h2>
            </div>
            <Link href="/dashboard/scores" className="text-xs text-accent font-black uppercase tracking-widest hover:underline flex items-center gap-1">
              Manage <ArrowUpRight size={12} />
            </Link>
          </div>

          {/* Score bars */}
          <div className="space-y-3 mb-8">
            {scoreCount === 0 ? (
              <div className="h-24 flex items-center justify-center border-2 border-dashed border-surface-border rounded-xl">
                <p className="text-xs text-muted-light font-semibold">No scores logged this month</p>
              </div>
            ) : (
              scores.slice(0, 5).map((s: any, i: number) => (
                <div key={s.id} className="flex items-center gap-4">
                  <p className="text-2xs font-mono font-bold text-muted-light w-20 shrink-0">
                    {new Date(s.score_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </p>
                  <div className="flex-1 h-2 bg-surface-subtle rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(s.score / 45) * 100}%` }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                      className="h-full bg-accent rounded-full"
                    />
                  </div>
                  <p className="text-sm font-black font-mono text-primary w-8 text-right">{s.score}</p>
                </div>
              ))
            )}
            {/* Capacity indicator */}
            <div className="flex items-center gap-2 mt-5 pt-4 border-t border-surface-border">
              {[1,2,3,4,5].map(n => (
                <div
                  key={n}
                  className={`h-2 flex-1 rounded-full transition-all duration-300 ${n <= scoreCount ? "bg-accent" : "bg-surface-subtle"}`}
                />
              ))}
              <p className="text-2xs font-black font-mono text-muted-light ml-2 shrink-0">{scoreCount}/5</p>
            </div>
          </div>

          {/* Add score inline */}
          <div className="border-t border-surface-border pt-6">
            <p className="text-2xs font-black text-muted-light uppercase tracking-[0.25em] mb-4">Quick Entry</p>
            <ScoreEntry
              scoresCount={scoreCount}
              existingDates={existingDates}
              onScoreAdded={() => { setScoreAdded(c => c + 1); window.location.reload(); }}
            />
          </div>
        </div>

        {/* Charity side block */}
        <div className="bg-primary p-6 md:p-8 flex flex-col justify-between">
          <div>
            <p className="text-2xs font-black text-white/30 uppercase tracking-[0.25em] mb-2">Your Charity</p>
            <h2 className="text-xl font-black text-white mb-1">
              {charity?.name ?? "Not selected"}
            </h2>
            <p className="text-sm text-white/40 font-medium">
              {dbUser.charity_contribution_percentage ?? 10}% of your plan goes here
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-2xs font-black text-white/30 uppercase tracking-widest mb-2">Contribution</p>
              <p className="text-3xl font-black font-mono text-accent">
                {dbUser.charity_contribution_percentage ?? 10}%
              </p>
            </div>
            <Link
              href="/dashboard/charity"
              className="flex items-center justify-between w-full bg-accent/10 border border-accent/20 hover:bg-accent hover:text-primary text-accent font-black text-sm px-4 py-3 rounded-xl transition-all group"
            >
              <span>{charity ? "Change Charity" : "Select Charity"}</span>
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* ── MARQUEE DIVIDER 2 ── */}
      <Marquee text="Recent winnings · Prize history · Scorecard verification · Payout status" dark />

      {/* ── WINNINGS TABLE ── */}
      <motion.section variants={item} className="px-6 md:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-2xs font-black text-muted-light uppercase tracking-[0.25em] mb-1">Prize History</p>
            <h2 className="text-2xl font-black text-primary">Recent Winnings</h2>
          </div>
          <Link href="/dashboard/winnings" className="text-xs text-accent font-black uppercase tracking-widest hover:underline flex items-center gap-1">
            View All <ArrowUpRight size={12} />
          </Link>
        </div>

        {!winnings || winnings.length === 0 ? (
          <div className="border-2 border-dashed border-surface-border rounded-2xl">
            <EmptyState
              icon={Award}
              title="No winnings yet"
              description="Keep your 5 scores up to date to be eligible for the monthly draw."
            />
          </div>
        ) : (
          <div className="border border-surface-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[500px]">
                <thead className="bg-surface-subtle border-b border-surface-border">
                  <tr>
                    {["Draw", "Tier", "Prize", "Status"].map(h => (
                      <th key={h} className="px-6 py-4 text-left text-2xs font-black text-muted-light uppercase tracking-[0.2em]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border bg-surface">
                  {winnings.map((w: any) => (
                    <tr key={w.id} className="hover:bg-surface-subtle transition-colors group">
                      <td className="px-6 py-4 font-bold text-primary font-mono text-sm">{w.draws?.draw_month}</td>
                      <td className="px-6 py-4">
                        <span className="text-2xs font-black uppercase tracking-widest text-muted bg-surface-subtle border border-surface-border px-2.5 py-1 rounded-lg">
                          {w.match_type?.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-black text-primary font-mono text-lg">£{w.prize_amount?.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        {w.payment_status === "paid"
                          ? <span className="text-2xs font-black uppercase tracking-widest text-accent bg-accent/10 border border-accent/20 px-2.5 py-1 rounded-lg">Paid</span>
                          : <span className="text-2xs font-black uppercase tracking-widest text-warning bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-lg">Pending</span>}
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
