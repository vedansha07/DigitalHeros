"use client";
import { useEffect, useState } from "react";
import ScoreEntry from "./ScoreEntry";
import ScoreList from "./ScoreList";
import { Target } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

function ScoreSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-16 bg-surface-subtle rounded-xl border border-surface-border" />
      ))}
    </div>
  );
}

export default function ScoreSection() {
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadScores = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/scores");
      const data = await res.json();
      if (data.scores) setScores(data.scores);
      else setError("Failed to load scores.");
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  useEffect(() => { loadScores(); }, []);

  const existingDates = scores.map((s) => s.score_date);

  return (
    <div className="space-y-8 mt-2">
      {/* Score Entry */}
      <div className="bg-surface rounded-2xl border border-surface-border shadow-card p-6">
        <div className="mb-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-primary">Add New Score</h2>
            <span className="text-2xs font-black uppercase tracking-widest text-muted bg-surface-subtle border border-surface-border px-2.5 py-1 rounded-lg font-mono">
              {scores.length}/5 slots used
            </span>
          </div>
          {/* Capacity bar */}
          <div className="mt-3 h-1 bg-surface-subtle rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-700"
              style={{ width: `${(scores.length / 5) * 100}%` }}
            />
          </div>
          <p className="text-xs text-muted mt-2">
            {scores.length < 5
              ? `You need ${5 - scores.length} more score${5 - scores.length !== 1 ? "s" : ""} to be eligible for the draw.`
              : "You have all 5 scores. You're entered in this month's draw!"}
          </p>
        </div>
        <ScoreEntry scoresCount={scores.length} existingDates={existingDates} onScoreAdded={loadScores} />
      </div>

      {/* Score History */}
      <div className="bg-surface rounded-2xl border border-surface-border shadow-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-surface-border">
          <div>
            <h2 className="text-base font-black text-primary">Score History</h2>
            <p className="text-xs text-muted mt-0.5">Newest first · max 5 retained</p>
          </div>
          <span className="text-sm font-bold text-muted">{scores.length} score{scores.length !== 1 ? "s" : ""}</span>
        </div>

        {error && (
          <div className="p-6 text-sm text-red-600 bg-red-50 flex items-center gap-2 font-medium">
            <span>⚠</span> {error}
            <button onClick={loadScores} className="ml-auto text-xs font-bold text-red-700 underline">Retry</button>
          </div>
        )}

        {loading ? (
          <div className="p-6"><ScoreSkeleton /></div>
        ) : scores.length === 0 ? (
          <EmptyState
            icon={Target}
            title="No scores yet"
            description="Add your first Stableford score above to start building your entry for the monthly draw."
          />
        ) : (
          <ScoreList scores={scores} onScoreUpdated={loadScores} />
        )}
      </div>
    </div>
  );
}
