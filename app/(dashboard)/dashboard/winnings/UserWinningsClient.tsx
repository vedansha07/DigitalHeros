"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Award, Upload, Loader2, CheckCircle, Clock, XCircle, Trophy } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

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
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Images only — JPG or PNG required.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large — maximum 5MB.");
      return;
    }

    setUploadingId(resultId);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${resultId}-${Date.now()}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from("winner-proofs")
      .upload(path, file);

    if (upErr) {
      toast.error("Upload failed. Please try again.");
      setUploadingId(null);
      return;
    }

    const { data } = supabase.storage.from("winner-proofs").getPublicUrl(path);

    const res = await fetch(`/api/user/winnings/${resultId}/proof`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ proof_url: data.publicUrl }),
      credentials: "include",
    });

    if (res.ok) {
      toast.success("Scorecard submitted! Awaiting admin review.");
      loadData();
    } else {
      toast.error("Submission failed. Please try again.");
    }

    setUploadingId(null);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-36 bg-surface-subtle rounded-2xl border border-surface-border animate-pulse" />
        ))}
      </div>
    );
  }

  if (winnings.length === 0) {
    return (
      <div className="bg-surface rounded-2xl border border-surface-border shadow-card">
        <EmptyState
          icon={Trophy}
          title="No winnings yet"
          description="You'll appear here once you win a monthly draw. Make sure you have 5 scores logged before each draw date."
        />
      </div>
    );
  }

  const statusConfig: Record<string, { label: string; icon: any; cls: string }> = {
    not_submitted: { label: "Awaiting Proof", icon: Clock, cls: "text-muted bg-surface-subtle border-surface-border" },
    pending:       { label: "Under Review",   icon: Clock, cls: "text-warning bg-amber-50 border-amber-100" },
    approved:      { label: "Approved",       icon: CheckCircle, cls: "text-accent bg-accent/10 border-accent/20" },
    rejected:      { label: "Rejected",       icon: XCircle, cls: "text-danger bg-red-50 border-red-100" },
  };

  return (
    <div className="space-y-5">
      {winnings.map((win) => {
        const verified = win.winner_verifications?.[0] ?? null;
        const status = verified ? verified.admin_status : "not_submitted";
        const cfg = statusConfig[status] ?? statusConfig.not_submitted;
        const StatusIcon = cfg.icon;

        return (
          <div
            key={win.id}
            className="bg-surface rounded-2xl border border-surface-border shadow-card hover:shadow-card-md transition-shadow overflow-hidden"
          >
            {/* Header row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-surface-border">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                  <Award size={22} className="text-accent" />
                </div>
                <div>
                  <p className="text-2xs font-bold text-muted-light uppercase tracking-widest">{win.draws?.draw_month}</p>
                  <p className="text-2xl font-black text-primary font-mono">£{win.prize_amount?.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-2xs font-black uppercase tracking-widest text-muted bg-surface-subtle border border-surface-border px-2.5 py-1 rounded-lg">
                  {win.match_type?.replace("_", " ")}
                </span>
                <span className={`inline-flex items-center gap-1.5 text-2xs font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${cfg.cls}`}>
                  <StatusIcon size={11} /> {cfg.label}
                </span>
                {win.payment_status === "paid" && (
                  <span className="text-2xs font-black uppercase tracking-widest text-accent bg-accent/10 border border-accent/20 px-2.5 py-1 rounded-lg">
                    Paid
                  </span>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              {/* Rejection notes */}
              {status === "rejected" && verified?.admin_notes && (
                <div className="mb-5 bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-700 font-medium">
                  <strong className="block mb-1 font-black">Admin note:</strong>
                  {verified.admin_notes}
                </div>
              )}

              {/* Upload zone */}
              {win.payment_status !== "paid" && status !== "approved" && status !== "pending" && (
                <label className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors ${uploadingId === win.id ? "border-accent/40 bg-accent/5" : "border-surface-border hover:border-accent/40 hover:bg-surface-subtle"}`}>
                  {uploadingId === win.id ? (
                    <><Loader2 size={24} className="text-accent animate-spin" /><p className="text-sm font-semibold text-muted">Uploading...</p></>
                  ) : (
                    <>
                      <Upload size={24} className="text-muted-light" />
                      <div className="text-center">
                        <p className="text-sm font-bold text-primary">Upload certified scorecard</p>
                        <p className="text-xs text-muted mt-1">JPG or PNG · max 5MB</p>
                      </div>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    className="sr-only"
                    disabled={!!uploadingId}
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleUpload(e.target.files[0], win.id);
                    }}
                  />
                </label>
              )}

              {status === "pending" && (
                <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-700 font-semibold">
                  <Clock size={16} className="shrink-0" /> Your scorecard is under admin review. We&apos;ll notify you once it&apos;s approved.
                </div>
              )}

              {(status === "approved" || win.payment_status === "paid") && (
                <div className={`flex items-center gap-3 rounded-xl p-4 text-sm font-semibold ${win.payment_status === "paid" ? "bg-accent/10 border border-accent/20 text-accent" : "bg-surface-subtle border border-surface-border text-muted"}`}>
                  <CheckCircle size={16} className="shrink-0" />
                  {win.payment_status === "paid" ? "Payment dispatched to your account." : "Proof approved — payout is being processed."}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
