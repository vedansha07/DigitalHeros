"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Trash2, Plus, ArrowUpRight, AlertCircle } from "lucide-react";
import ScoreEntry from "@/components/dashboard/ScoreEntry";
import { toast } from "sonner";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 24 } } };

function Marquee({ text }: { text: string }) {
  const repeated = Array(12).fill(text);
  return (
    <div className="overflow-hidden py-3 border-y border-cream-border bg-cream-dim">
      <div className="flex animate-marquee whitespace-nowrap select-none">
        {repeated.map((t, i) => (
          <span key={i} className="text-xs font-black uppercase tracking-[0.28em] px-8 text-ink-faint">{t} ◆</span>
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
  const avgScore = scoreCount > 0 ? (scores.reduce((a: number, s: any) => a + s.score, 0) / scoreCount).toFixed(1) : null;
  const bestScore = scoreCount > 0 ? Math.max(...scores.map((s: any) => s.score)) : null;
  const existingDates = scores.map((s: any) => s.score_date);
  const isActive = dbUser.subscription_status === "active";

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const res = await fetch(`/api/scores/${id}`, { method: "DELETE", credentials: "include" });
      if (res.ok) { setScores(prev => prev.filter(s => s.id !== id)); toast.success("Score removed."); }
      else toast.error("Could not delete score.");
    } catch { toast.error("Network error."); }
    setDeleting(null);
  };

  const handleAdded = async () => {
    const res = await fetch("/api/scores", { credentials: "include" });
    if (res.ok) { const data = await res.json(); if (data.scores) setScores(data.scores); }
    setShowEntry(false);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-0 -mx-6 md:-mx-8 lg:-mx-12">

      {/* ── HEADER ── */}
      <motion.section variants={item} className="px-6 md:px-8 lg:px-12 pt-2 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-2xs font-black uppercase tracking-[0.3em] text-ink-faint mb-2 flex items-center gap-2">
              <span className="w-6 h-px bg-ink-faint" /> Dashboard / Scores
            </p>
            <h1 className="text-5xl md:text-6xl font-black text-ink leading-none tracking-tight">
              Score<span className="text-violet">Log.</span>
            </h1>
            <p className="text-ink-muted text-sm font-medium mt-2">
              Log your 5 monthly Stableford scores to enter the draw.
            </p>
          </div>
          <button onClick={() => setShowEntry(v => !v)}
            className="inline-flex items-center gap-2 bg-ink hover:bg-violet text-cream text-xs font-black px-5 py-3 uppercase tracking-widest transition-colors shrink-0">
            <Plus size={13} /> {showEntry ? "Cancel" : "Add Score"}
          </button>
        </div>
      </motion.section>

      <Marquee text="Stableford scoring · Monthly eligibility · Score verification · Draw algorithm · Handicap tracking" />

      {/* ── STAT STRIP ── */}
      <motion.section variants={item} className="grid grid-cols-2 sm:grid-cols-4 border-b border-cream-border divide-x divide-y sm:divide-y-0 divide-cream-border">
        {[
          { label: "Logged", value: `${scoreCount}/5`, bg: scoreCount === 5 ? "bg-lime text-ink" : "bg-cream text-ink" },
          { label: "Average", value: avgScore ?? "—", bg: "bg-onyx text-cream" },
          { label: "Best", value: bestScore !== null ? String(bestScore) : "—", bg: "bg-cream text-ink" },
          { label: "Status", value: scoreCount === 5 ? "Ready ✓" : `Need ${5 - scoreCount}`, bg: scoreCount === 5 ? "bg-violet text-cream" : "bg-cream text-ink" },
        ].map(({ label, value, bg }) => (
          <div key={label} className={`p-7 md:p-10 ${bg}`}>
            <p className="text-2xs font-black uppercase tracking-[0.28em] opacity-40 mb-5">{label}</p>
            <p className="text-4xl font-black font-mono leading-none">{value}</p>
          </div>
        ))}
      </motion.section>

      {/* ── ADD SCORE PANEL ── */}
      <AnimatePresence>
        {showEntry && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-b border-cream-border bg-cream-dim">
            <div className="px-6 md:px-8 lg:px-12 py-8">
              <p className="text-2xs font-black uppercase tracking-[0.28em] text-ink-faint mb-5">New Entry</p>
              <ScoreEntry scoresCount={scoreCount} existingDates={existingDates} onScoreAdded={handleAdded} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SCORES LIST ── */}
      <motion.section variants={item} className="px-6 md:px-8 lg:px-12 py-10">

        {/* Header row */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-2xs font-black uppercase tracking-[0.28em] text-ink-faint">
            Entry Log · {scoreCount} recorded
          </p>
          {/* Draw dots */}
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(n => (
              <div key={n} className={`h-2 w-8 transition-colors duration-300 ${n <= scoreCount ? "bg-lime" : "bg-cream-dim border border-cream-border"}`} />
            ))}
          </div>
        </div>

        {!isActive && (
          <div className="mb-5 flex items-center gap-3 border border-violet/30 bg-violet/5 text-violet px-5 py-3.5 text-sm font-semibold">
            <AlertCircle size={15} className="shrink-0" />
            Subscribe to enter the monthly draw with your scores.
          </div>
        )}

        {scoreCount === 0 ? (
          <div className="border-2 border-dashed border-cream-border flex flex-col items-center justify-center py-20 text-center gap-5">
            <div className="w-14 h-14 border border-cream-border flex items-center justify-center">
              <Target size={22} className="text-violet" />
            </div>
            <div>
              <p className="font-black text-ink text-lg uppercase tracking-wide">No scores yet</p>
              <p className="text-sm text-ink-muted mt-1">Log your first Stableford score above</p>
            </div>
            <button onClick={() => setShowEntry(true)}
              className="inline-flex items-center gap-2 bg-ink hover:bg-violet text-cream text-xs font-black px-5 py-3 uppercase tracking-widest transition-colors">
              <Plus size={13} /> Log First Score
            </button>
          </div>
        ) : (
          <div className="border border-cream-border overflow-hidden">
            {/* Scores rows */}
            <div className="divide-y divide-cream-border">
              {scores.map((score: any, i: number) => (
                <motion.div key={score.id} variants={item}
                  className="flex items-center gap-4 px-6 py-5 bg-cream hover:bg-cream-dim transition-colors group">

                  {/* Rank */}
                  <div className={`h-8 w-8 flex items-center justify-center shrink-0 font-black text-xs font-mono ${i === 0 ? "bg-lime text-ink" : "border border-cream-border text-ink-muted"}`}>
                    {i + 1}
                  </div>

                  {/* Date */}
                  <div className="w-28 shrink-0">
                    <p className="text-xs font-bold text-ink-muted font-mono">
                      {new Date(score.score_date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}
                    </p>
                  </div>

                  {/* Bar */}
                  <div className="flex-1 h-1.5 bg-cream-dim">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(score.score / 45) * 100}%` }}
                      transition={{ delay: 0.08 * i, duration: 0.5 }}
                      className={`h-full ${score.score >= 36 ? "bg-lime" : score.score >= 28 ? "bg-violet" : "bg-ink-faint"}`}
                    />
                  </div>

                  {/* Score */}
                  <p className="text-2xl font-black font-mono text-ink w-10 text-right">{score.score}</p>

                  {/* Quality badge */}
                  <span className={`text-2xs font-black uppercase tracking-widest px-2.5 py-1 border shrink-0 hidden sm:block ${
                    score.score >= 36 ? "text-ink bg-lime border-lime"
                    : score.score >= 28 ? "text-cream bg-violet border-violet"
                    : "text-ink-muted border-cream-border"
                  }`}>
                    {score.score >= 36 ? "Excellent" : score.score >= 28 ? "Good" : "Average"}
                  </span>

                  {/* Delete */}
                  <button onClick={() => handleDelete(score.id)} disabled={deleting === score.id}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 border border-cream-border hover:border-coral hover:text-coral text-ink-faint"
                    aria-label="Delete score">
                    <Trash2 size={13} />
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="bg-cream-dim border-t border-cream-border px-6 py-4 flex items-center justify-between">
              <p className="text-xs font-semibold text-ink-muted">
                {scoreCount === 5 ? "✓ All 5 scores logged — draw entry secured" : `${5 - scoreCount} more score${5 - scoreCount !== 1 ? "s" : ""} needed`}
              </p>
              {avgScore && (
                <p className="text-xs font-bold font-mono text-ink-muted">
                  Avg <span className="text-ink">{avgScore}</span> pts
                </p>
              )}
            </div>
          </div>
        )}
      </motion.section>

    </motion.div>
  );
}
