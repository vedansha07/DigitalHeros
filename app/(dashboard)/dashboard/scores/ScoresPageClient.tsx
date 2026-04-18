"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Trash2, Plus, ArrowUpRight, TrendingUp, Award, AlertCircle } from "lucide-react";
import ScoreEntry from "@/components/dashboard/ScoreEntry";
import { toast } from "sonner";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 24 } } };

function Marquee({ text }: { text: string }) {
  const repeated = Array(12).fill(text);
  return (
    <div className="overflow-hidden py-3 border-y border-surface-border bg-surface-subtle">
      <div className="flex animate-marquee whitespace-nowrap">
        {repeated.map((t, i) => (
          <span key={i} className="text-xs font-black uppercase tracking-[0.3em] px-8 text-muted-light">
            {t} ◆
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ScoresPageClient({ dbUser, scores: initialScores }: any) {
  const [scores, setScores] = useState<any[]>(initialScores);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showEntry, setShowEntry] = useState(false);

  const scoreCount = scores.length;
  const avgScore = scoreCount > 0
    ? (scores.reduce((a: number, s: any) => a + s.score, 0) / scoreCount).toFixed(1)
    : null;
  const bestScore = scoreCount > 0 ? Math.max(...scores.map((s: any) => s.score)) : null;
  const existingDates = scores.map((s: any) => s.score_date);
  const isActive = dbUser.subscription_status === "active";

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const res = await fetch(`/api/scores/${id}`, { method: "DELETE", credentials: "include" });
      if (res.ok) {
        setScores(prev => prev.filter(s => s.id !== id));
        toast.success("Score removed.");
      } else {
        toast.error("Could not delete score.");
      }
    } catch {
      toast.error("Network error.");
    }
    setDeleting(null);
  };

  const handleAdded = async () => {
    // Refetch scores
    const res = await fetch("/api/scores", { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      if (data.scores) setScores(data.scores);
    }
    setShowEntry(false);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-0 -mx-6 md:-mx-8">

      {/* ── HEADER ── */}
      <motion.section variants={item} className="px-6 md:px-8 pt-2 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-2xs font-black text-accent uppercase tracking-[0.3em] mb-2">Dashboard / Scores</p>
            <h1 className="text-4xl md:text-5xl font-black text-primary leading-none tracking-tight">
              Score<span className="text-accent">Log.</span>
            </h1>
            <p className="text-muted text-sm font-medium mt-2">Track your 5 monthly Stableford scores to enter the draw.</p>
          </div>
          <button
            onClick={() => setShowEntry(v => !v)}
            className="inline-flex items-center gap-2 bg-accent text-primary text-sm font-black px-5 py-2.5 rounded-xl hover:shadow-glow-sm transition-all shrink-0"
          >
            <Plus size={14} /> {showEntry ? "Cancel" : "Add Score"}
          </button>
        </div>
      </motion.section>

      <Marquee text="Stableford scoring · Monthly eligibility · Score verification · Draw algorithm" />

      {/* ── STAT STRIP ── */}
      <motion.section variants={item} className="grid grid-cols-2 sm:grid-cols-4 border-b border-surface-border divide-x divide-surface-border">
        {[
          { label: "Logged", value: `${scoreCount}/5`, accent: scoreCount === 5 },
          { label: "Average",  value: avgScore  ?? "—", dark: true },
          { label: "Best",     value: bestScore !== null ? String(bestScore) : "—" },
          { label: "Status",   value: scoreCount === 5 ? "Ready" : `Need ${5 - scoreCount}`, accent: scoreCount === 5 },
        ].map(({ label, value, accent, dark }) => (
          <div key={label} className={`p-6 md:p-8 ${accent ? "bg-accent" : dark ? "bg-primary" : "bg-surface"}`}>
            <p className={`text-2xs font-black uppercase tracking-[0.25em] mb-4 ${accent ? "text-primary/60" : dark ? "text-white/30" : "text-muted-light"}`}>
              {label}
            </p>
            <p className={`text-4xl font-black font-mono ${accent ? "text-primary" : dark ? "text-white" : "text-primary"}`}>
              {value}
            </p>
          </div>
        ))}
      </motion.section>

      {/* ── ADD SCORE PANEL ── */}
      <AnimatePresence>
        {showEntry && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-surface-border bg-surface-subtle"
          >
            <div className="px-6 md:px-8 py-7">
              <p className="text-2xs font-black text-muted-light uppercase tracking-[0.25em] mb-5">New Entry</p>
              <ScoreEntry
                scoresCount={scoreCount}
                existingDates={existingDates}
                onScoreAdded={handleAdded}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SCORES TABLE ── */}
      <motion.section variants={item} className="px-6 md:px-8 py-8">
        <div className="flex items-center justify-between mb-5">
          <p className="text-2xs font-black text-muted-light uppercase tracking-[0.25em]">
            Entry Log · {scoreCount} recorded
          </p>
          {/* Draw progress pills */}
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map(n => (
              <div
                key={n}
                className={`h-2 w-8 rounded-full transition-all duration-300 ${n <= scoreCount ? "bg-accent" : "bg-surface-subtle border border-surface-border"}`}
              />
            ))}
          </div>
        </div>

        {!isActive && (
          <div className="mb-5 flex items-center gap-3 bg-amber-50 border border-amber-100 text-amber-700 rounded-xl px-4 py-3 text-sm font-semibold">
            <AlertCircle size={16} className="shrink-0" />
            Subscribe to a plan to make your scores eligible for the monthly draw.
          </div>
        )}

        {scoreCount === 0 ? (
          <div className="border-2 border-dashed border-surface-border rounded-2xl flex flex-col items-center justify-center py-20 text-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center">
              <Target size={24} className="text-accent" />
            </div>
            <div>
              <p className="font-black text-primary text-lg">No scores yet</p>
              <p className="text-sm text-muted mt-1">Log your first Stableford score above</p>
            </div>
            <button
              onClick={() => setShowEntry(true)}
              className="inline-flex items-center gap-2 bg-accent text-primary text-sm font-black px-5 py-2.5 rounded-xl hover:shadow-glow-sm transition-all mt-2"
            >
              <Plus size={14} /> Log First Score
            </button>
          </div>
        ) : (
          <div className="border border-surface-border rounded-2xl overflow-hidden">
            {/* Visual bars view */}
            <div className="divide-y divide-surface-border">
              {scores.map((score: any, i: number) => (
                <motion.div
                  key={score.id}
                  variants={item}
                  className="flex items-center gap-4 px-6 py-4 bg-surface hover:bg-surface-subtle transition-colors group"
                >
                  {/* Position badge */}
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 font-black text-sm font-mono ${i === 0 ? "bg-accent text-primary" : "bg-surface-subtle border border-surface-border text-muted"}`}>
                    {i + 1}
                  </div>

                  {/* Date */}
                  <div className="w-28 shrink-0">
                    <p className="text-xs font-bold text-muted-light font-mono">
                      {new Date(score.score_date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}
                    </p>
                  </div>

                  {/* Bar */}
                  <div className="flex-1 h-2 bg-surface-subtle rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(score.score / 45) * 100}%` }}
                      transition={{ delay: 0.1 * i, duration: 0.5 }}
                      className={`h-full rounded-full ${score.score >= 36 ? "bg-accent" : score.score >= 28 ? "bg-amber-400" : "bg-muted-light"}`}
                    />
                  </div>

                  {/* Score value */}
                  <p className="text-xl font-black font-mono text-primary w-10 text-right">{score.score}</p>

                  {/* Quality label */}
                  <span className={`text-2xs font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border shrink-0 hidden sm:block ${
                    score.score >= 36 ? "text-accent bg-accent/10 border-accent/20" :
                    score.score >= 28 ? "text-amber-600 bg-amber-50 border-amber-100" :
                    "text-muted bg-surface-subtle border-surface-border"
                  }`}>
                    {score.score >= 36 ? "Excellent" : score.score >= 28 ? "Good" : "Average"}
                  </span>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(score.id)}
                    disabled={deleting === score.id}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-red-50 text-muted-light hover:text-red-500"
                    aria-label="Delete score"
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Footer summary */}
            <div className="bg-surface-subtle border-t border-surface-border px-6 py-4 flex items-center justify-between">
              <p className="text-xs font-semibold text-muted">
                {scoreCount === 5 ? "✓ All 5 scores logged — draw entry secured" : `${5 - scoreCount} more score${5 - scoreCount !== 1 ? "s" : ""} needed for draw eligibility`}
              </p>
              {avgScore && (
                <p className="text-xs font-bold font-mono text-muted">
                  Avg <span className="text-primary">{avgScore}</span> pts
                </p>
              )}
            </div>
          </div>
        )}
      </motion.section>

    </motion.div>
  );
}
