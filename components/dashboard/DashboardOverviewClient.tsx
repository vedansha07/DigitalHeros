"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Award, CreditCard, ChevronRight, Target, HeartHandshake,
  TrendingUp, Plus, Clock, CheckCircle, AlertCircle,
} from "lucide-react";
import ScoreEntry from "./ScoreEntry";
import EmptyState from "@/components/ui/EmptyState";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 28 } } };

function StatCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={item}
      className={`bg-surface rounded-2xl border border-surface-border shadow-card hover:shadow-card-md transition-shadow duration-200 p-6 flex flex-col justify-between ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default function DashboardOverviewClient({ dbUser, scores, nextDraw, charity, winnings }: any) {
  const isActive = dbUser.subscription_status === "active";
  const renewalDate = dbUser.subscription_renewal_date
    ? new Date(dbUser.subscription_renewal_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
    : "—";
  const scoreCount = scores?.length ?? 0;
  const existingDates = (scores ?? []).map((s: any) => s.score_date);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">

      {/* Page header */}
      <motion.div variants={item} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-accent uppercase tracking-widest mb-1">Dashboard</p>
          <h1 className="text-3xl font-black text-primary tracking-tight">
            Hey, {dbUser.full_name?.split(" ")[0] || "Player"} 👋
          </h1>
          <p className="text-muted text-sm font-medium mt-1">Here&apos;s your monthly summary</p>
        </div>
        <Link
          href="/dashboard/scores"
          className="inline-flex items-center gap-2 bg-accent text-primary text-sm font-black px-5 py-2.5 rounded-xl hover:bg-accent/90 hover:shadow-glow-sm transition-all shrink-0"
        >
          <Plus size={16} /> Add Score
        </Link>
      </motion.div>

      {/* 4 stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* Subscription */}
        <StatCard>
          <div className="flex items-start justify-between mb-5">
            <div className="h-10 w-10 rounded-xl bg-primary/6 flex items-center justify-center">
              <CreditCard size={20} className="text-primary" />
            </div>
            {isActive
              ? <span className="text-2xs font-black uppercase tracking-widest text-accent bg-accent/10 border border-accent/20 px-2.5 py-1 rounded-lg">Active</span>
              : <span className="text-2xs font-black uppercase tracking-widest text-danger bg-red-50 border border-red-100 px-2.5 py-1 rounded-lg">Inactive</span>}
          </div>
          <div>
            <p className="text-2xs font-bold text-muted-light uppercase tracking-widest mb-1">Plan</p>
            <p className="text-xl font-black text-primary capitalize">{dbUser.subscription_plan || "No plan"}</p>
            <p className="text-xs text-muted mt-1 flex items-center gap-1.5">
              <Clock size={12} /> Renews {renewalDate}
            </p>
          </div>
        </StatCard>

        {/* Scores */}
        <StatCard>
          <div className="flex items-start justify-between mb-5">
            <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Target size={20} className="text-accent" />
            </div>
            <span className="text-2xs font-black uppercase tracking-widest text-muted bg-surface-subtle border border-surface-border px-2.5 py-1 rounded-lg font-mono">
              {scoreCount}/5
            </span>
          </div>
          <div>
            <p className="text-2xs font-bold text-muted-light uppercase tracking-widest mb-1">Scores</p>
            <p className="text-xl font-black text-primary">
              {scoreCount === 5 ? "Ready for draw" : `${5 - scoreCount} more needed`}
            </p>
            {/* Score capacity bar */}
            <div className="mt-3 h-1.5 bg-surface-subtle rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-500"
                style={{ width: `${(scoreCount / 5) * 100}%` }}
              />
            </div>
          </div>
        </StatCard>

        {/* Charity */}
        <StatCard>
          <div className="flex items-start justify-between mb-5">
            <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center">
              <HeartHandshake size={20} className="text-rose-500" />
            </div>
            <span className="text-2xs font-black uppercase tracking-widest text-muted bg-surface-subtle border border-surface-border px-2.5 py-1 rounded-lg font-mono">
              {dbUser.charity_contribution_percentage ?? 10}%
            </span>
          </div>
          <div>
            <p className="text-2xs font-bold text-muted-light uppercase tracking-widest mb-1">Charity</p>
            <p className="text-xl font-black text-primary truncate">{charity?.name ?? "Not set up"}</p>
            <Link href="/dashboard/charity" className="text-xs text-accent font-semibold hover:underline mt-1 inline-flex items-center gap-1">
              Manage <ChevronRight size={12} />
            </Link>
          </div>
        </StatCard>

        {/* Next Draw */}
        <StatCard className="bg-primary text-white border-primary!">
          <div className="flex items-start justify-between mb-5">
            <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
              <TrendingUp size={20} className="text-accent" />
            </div>
            <span className="text-2xs font-black uppercase tracking-widest text-primary bg-accent px-2.5 py-1 rounded-lg">Draw</span>
          </div>
          <div>
            <p className="text-2xs font-bold text-white/40 uppercase tracking-widest mb-1">Next Draw</p>
            <p className="text-xl font-black text-white">{nextDraw?.draw_month ?? "TBD"}</p>
            <p className="text-xs mt-1 flex items-center gap-1.5">
              {isActive && scoreCount === 5
                ? <><CheckCircle size={12} className="text-accent" /><span className="text-accent font-semibold">Entry confirmed</span></>
                : <><AlertCircle size={12} className="text-white/50" /><span className="text-white/50">Scores required</span></>}
            </p>
          </div>
        </StatCard>
      </div>

      {/* Score Entry + Winnings */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

        {/* Quick Score Entry */}
        <motion.div variants={item} className="xl:col-span-2 bg-surface rounded-2xl border border-surface-border shadow-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-black text-primary">Quick Score Entry</h2>
              <p className="text-xs text-muted mt-0.5">Stableford scoring (1–45)</p>
            </div>
            <Link href="/dashboard/scores" className="text-xs text-accent font-semibold hover:underline flex items-center gap-1">
              All scores <ChevronRight size={12} />
            </Link>
          </div>
          <ScoreEntry
            scoresCount={scoreCount}
            existingDates={existingDates}
            onScoreAdded={() => window.location.reload()}
          />
        </motion.div>

        {/* Recent Winnings */}
        <motion.div variants={item} className="xl:col-span-3 bg-surface rounded-2xl border border-surface-border shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-surface-border">
            <div>
              <h2 className="text-base font-black text-primary">Recent Winnings</h2>
              <p className="text-xs text-muted mt-0.5">Your latest draw results</p>
            </div>
            <Link href="/dashboard/winnings" className="text-xs text-accent font-semibold hover:underline flex items-center gap-1">
              View all <ChevronRight size={12} />
            </Link>
          </div>

          {!winnings || winnings.length === 0 ? (
            <EmptyState
              icon={Award}
              title="No winnings yet"
              description="Keep your 5 scores up to date to be eligible for the monthly draw."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[480px]">
                <thead className="bg-surface-subtle border-b border-surface-border">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-2xs font-black text-muted-light uppercase tracking-widest">Draw</th>
                    <th className="px-6 py-3.5 text-left text-2xs font-black text-muted-light uppercase tracking-widest">Tier</th>
                    <th className="px-6 py-3.5 text-left text-2xs font-black text-muted-light uppercase tracking-widest">Prize</th>
                    <th className="px-6 py-3.5 text-right text-2xs font-black text-muted-light uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {winnings.map((w: any) => (
                    <tr key={w.id} className="hover:bg-surface-subtle transition-colors">
                      <td className="px-6 py-4 font-bold text-primary text-sm">{w.draws?.draw_month}</td>
                      <td className="px-6 py-4">
                        <span className="text-2xs font-black uppercase tracking-widest text-muted bg-surface-subtle border border-surface-border px-2.5 py-1 rounded-lg">
                          {w.match_type?.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-black text-primary font-mono text-base">£{w.prize_amount?.toFixed(2)}</td>
                      <td className="px-6 py-4 text-right">
                        {w.payment_status === "paid"
                          ? <span className="text-2xs font-black uppercase tracking-widest text-accent bg-accent/10 border border-accent/20 px-2.5 py-1 rounded-lg">Paid</span>
                          : <span className="text-2xs font-black uppercase tracking-widest text-warning bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-lg">Pending</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

    </motion.div>
  );
}
