"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Award, Upload, Loader2, CheckCircle, Clock, XCircle, Trophy, ArrowUpRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 24 } } };

function Marquee({ text }: { text: string }) {
  const items = Array(12).fill(text);
  return (
    <div className="overflow-hidden py-3 border-y border-cream-border bg-cream-dim">
      <div className="flex animate-marquee whitespace-nowrap select-none">
        {items.map((t, i) => (
          <span key={i} className="text-xs font-black uppercase tracking-[0.28em] px-8 text-ink-faint">{t} ◆</span>
        ))}
      </div>
    </div>
  );
}

const statusConfig: Record<string, { label: string; icon: any; dot: string; label_cls: string }> = {
  not_submitted: { label: "Awaiting Proof",  icon: Clock,        dot: "bg-ink-faint",  label_cls: "text-ink-muted border-cream-border" },
  pending:       { label: "Under Review",    icon: Clock,        dot: "bg-violet",     label_cls: "text-violet border-violet/30 bg-violet/5" },
  approved:      { label: "Approved",        icon: CheckCircle,  dot: "bg-lime",       label_cls: "text-ink bg-lime border-lime" },
  rejected:      { label: "Rejected",        icon: XCircle,      dot: "bg-coral",      label_cls: "text-coral border-coral/30 bg-coral/5" },
};

export default function UserWinningsClient() {
  const [winnings, setWinnings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const loadData = async () => {
    const res = await fetch("/api/user/winnings", { credentials: "include" });
    const data = await res.json();
    if (data.winnings) setWinnings(data.winnings);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleUpload = async (file: File, resultId: string) => {
    if (!["image/jpeg", "image/png"].includes(file.type)) { toast.error("Images only — JPG or PNG required."); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("File too large — max 5MB."); return; }

    setUploadingId(resultId);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${resultId}-${Date.now()}.${ext}`;

    const { error: upErr } = await supabase.storage.from("winner-proofs").upload(path, file);
    if (upErr) { toast.error("Upload failed. Please try again."); setUploadingId(null); return; }

    const { data } = supabase.storage.from("winner-proofs").getPublicUrl(path);
    const res = await fetch(`/api/user/winnings/${resultId}/proof`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proof_url: data.publicUrl }), credentials: "include",
    });

    if (res.ok) { toast.success("Scorecard submitted! Awaiting admin review."); loadData(); }
    else toast.error("Submission failed. Please try again.");
    setUploadingId(null);
  };

  if (loading) {
    return (
      <div className="space-y-3 -mx-6 md:-mx-8 lg:-mx-12 px-6 md:px-8 lg:px-12">
        {[1, 2].map(i => <div key={i} className="h-40 bg-cream-dim border border-cream-border animate-pulse" />)}
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="-mx-6 md:-mx-8 lg:-mx-12">

      {/* ── HEADER ── */}
      <motion.section variants={item} className="px-6 md:px-8 lg:px-12 pt-2 pb-8">
        <p className="text-2xs font-black uppercase tracking-[0.3em] text-ink-faint mb-2 flex items-center gap-2">
          <span className="w-6 h-px bg-ink-faint" /> Dashboard / Winnings
        </p>
        <h1 className="text-5xl md:text-6xl font-black text-ink leading-none tracking-tight">
          Prize<span className="text-violet">Log.</span>
        </h1>
        <p className="text-ink-muted text-sm font-medium mt-2">Your draw results, verification status and payouts.</p>
      </motion.section>

      <Marquee text="Draw results · Proof submission · Admin review · Prize payout · Score verification" />

      {winnings.length === 0 ? (
        <motion.div variants={item} className="mx-6 md:mx-8 lg:mx-12 mt-10 border-2 border-dashed border-cream-border flex flex-col items-center justify-center py-24 text-center gap-5">
          <div className="w-14 h-14 border border-cream-border flex items-center justify-center">
            <Trophy size={22} className="text-violet" />
          </div>
          <div>
            <p className="font-black text-ink text-lg uppercase tracking-wide">No winnings yet</p>
            <p className="text-sm text-ink-muted mt-1 max-w-xs">Keep 5 scores logged before each draw date to be eligible.</p>
          </div>
        </motion.div>
      ) : (
        <motion.div variants={container} className="px-6 md:px-8 lg:px-12 py-10 space-y-0 border-t border-cream-border divide-y divide-cream-border">
          {winnings.map((win) => {
            const verified = win.winner_verifications?.[0] ?? null;
            const status = verified ? verified.admin_status : "not_submitted";
            const cfg = statusConfig[status] ?? statusConfig.not_submitted;
            const StatusIcon = cfg.icon;

            return (
              <motion.div key={win.id} variants={item} className="py-8">
                {/* Win header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-6">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-onyx flex items-center justify-center shrink-0">
                      <Award size={22} className="text-lime" />
                    </div>
                    <div>
                      <p className="text-2xs font-black uppercase tracking-widest text-ink-faint font-mono">{win.draws?.draw_month}</p>
                      <p className="text-3xl font-black text-ink font-mono leading-tight">£{win.prize_amount?.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-2xs font-black uppercase tracking-widest text-ink-muted border border-cream-border px-2.5 py-1.5">
                      {win.match_type?.replace("_", " ")}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 text-2xs font-black uppercase tracking-widest px-2.5 py-1.5 border ${cfg.label_cls}`}>
                      <StatusIcon size={10} /> {cfg.label}
                    </span>
                    {win.payment_status === "paid" && (
                      <span className="text-2xs font-black uppercase tracking-widest text-ink bg-lime border border-lime px-2.5 py-1.5">Paid</span>
                    )}
                  </div>
                </div>

                {/* Rejection note */}
                {status === "rejected" && verified?.admin_notes && (
                  <div className="mb-5 border border-coral/20 bg-coral/5 p-4 text-sm text-coral font-semibold">
                    <strong className="block mb-1 font-black">Admin note:</strong> {verified.admin_notes}
                  </div>
                )}

                {/* Upload zone */}
                {win.payment_status !== "paid" && status !== "approved" && status !== "pending" && (
                  <label className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed p-10 cursor-pointer transition-colors ${uploadingId === win.id ? "border-violet/40 bg-violet/5" : "border-cream-border hover:border-violet/40 hover:bg-cream-dim"}`}>
                    {uploadingId === win.id ? (
                      <><Loader2 size={22} className="text-violet animate-spin" /><p className="text-sm font-semibold text-ink-muted">Uploading...</p></>
                    ) : (
                      <>
                        <Upload size={22} className="text-ink-faint" />
                        <div className="text-center">
                          <p className="text-sm font-black text-ink uppercase tracking-widest">Upload Scorecard</p>
                          <p className="text-xs text-ink-muted mt-1 font-medium">JPG or PNG · max 5MB</p>
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-cream bg-ink hover:bg-violet px-4 py-2 transition-colors mt-1">
                          Choose File <ArrowUpRight size={11} />
                        </span>
                      </>
                    )}
                    <input type="file" accept="image/png,image/jpeg" className="sr-only"
                      disabled={!!uploadingId} onChange={e => { if (e.target.files?.[0]) handleUpload(e.target.files[0], win.id); }} />
                  </label>
                )}

                {status === "pending" && (
                  <div className="flex items-center gap-3 border border-violet/20 bg-violet/5 p-4 text-sm text-violet font-semibold">
                    <Clock size={15} className="shrink-0" /> Your scorecard is under review. We&apos;ll notify you once approved.
                  </div>
                )}

                {(status === "approved" || win.payment_status === "paid") && (
                  <div className={`flex items-center gap-3 p-4 text-sm font-semibold border ${win.payment_status === "paid" ? "bg-lime border-lime text-ink" : "border-cream-border bg-cream-dim text-ink-muted"}`}>
                    <CheckCircle size={15} className="shrink-0" />
                    {win.payment_status === "paid" ? "Payment dispatched to your account." : "Proof approved — payout is being processed."}
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
}
