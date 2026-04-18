"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Calendar, AlertTriangle, ArrowUpRight, Loader2, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";
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

export default function SubscriptionManager({ subscription, dbUser }: { subscription: any; dbUser: any }) {
  const [loading, setLoading] = useState("");
  const [showCancel, setShowCancel] = useState(false);
  const router = useRouter();

  const isCancelled = subscription.status === "cancelled";
  const renewalDate = subscription.end_date
    ? new Date(subscription.end_date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "Unknown";

  const handlePortal = async () => {
    setLoading("portal");
    try {
      const res = await fetch("/api/stripe/create-portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else toast.error(data.error || "Failed to load billing portal.");
    } catch { toast.error("Network error."); }
    setLoading("");
  };

  const handleCancel = async () => {
    setLoading("cancel");
    try {
      const res = await fetch("/api/stripe/cancel", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        toast.success("Subscription cancelled. Access continues until end of billing period.");
        setShowCancel(false);
        router.refresh();
      } else toast.error(data.error || "Cancellation failed.");
    } catch { toast.error("Network error."); }
    setLoading("");
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="-mx-6 md:-mx-8 lg:-mx-12">

      {/* ── HEADER ── */}
      <motion.section variants={item} className="px-6 md:px-8 lg:px-12 pt-2 pb-8">
        <p className="text-2xs font-black uppercase tracking-[0.3em] text-ink-faint mb-2 flex items-center gap-2">
          <span className="w-6 h-px bg-ink-faint" /> Dashboard / Membership
        </p>
        <h1 className="text-5xl md:text-6xl font-black text-ink leading-none tracking-tight">
          Membership<span className="text-violet">.</span>
        </h1>
        <p className="text-ink-muted text-sm font-medium mt-2">Manage your subscription, billing, and plan details.</p>
      </motion.section>

      <Marquee text="Subscription status · Billing cycle · Plan management · Stripe portal · Renewal date" />

      {/* ── STATS STRIP ── */}
      <motion.section variants={item} className="grid grid-cols-2 lg:grid-cols-4 border-b border-cream-border divide-x divide-y lg:divide-y-0 divide-cream-border">
        {[
          { label: "Plan",     value: subscription.plan || "None",   bg: "bg-cream" },
          { label: "Status",  value: isCancelled ? "Cancelled" : "Active",
            bg: isCancelled ? "bg-coral text-cream" : "bg-lime text-ink" },
          { label: "Fee",     value: `£${Number(subscription.monthly_fee || 0).toFixed(2)}`, bg: "bg-onyx text-cream" },
          { label: isCancelled ? "Expires" : "Renews",
            value: subscription.end_date ? new Date(subscription.end_date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "—",
            bg: "bg-cream" },
        ].map(({ label, value, bg }) => (
          <div key={label} className={`p-7 md:p-10 ${bg}`}>
            <p className="text-2xs font-black uppercase tracking-[0.28em] opacity-40 mb-5">{label}</p>
            <p className="text-3xl md:text-4xl font-black font-mono leading-none capitalize">{value}</p>
          </div>
        ))}
      </motion.section>

      {/* ── ACTION PANEL ── */}
      <motion.section variants={item} className="grid grid-cols-1 lg:grid-cols-2 border-b border-cream-border divide-y lg:divide-y-0 lg:divide-x divide-cream-border">

        {/* Billing info */}
        <div className="px-8 md:px-12 py-10">
          <p className="text-2xs font-black uppercase tracking-[0.28em] text-ink-faint mb-6">Billing Details</p>

          <div className="space-y-0 border border-cream-border divide-y divide-cream-border">
            {[
              { label: "Plan", value: subscription.plan || "None" },
              { label: "Renewal", value: renewalDate },
              { label: "Monthly Fee", value: `£${Number(subscription.monthly_fee || 0).toFixed(2)}` },
              { label: "Status", value: isCancelled ? "Cancelled" : "Active" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between px-5 py-4 bg-cream">
                <p className="text-xs font-black uppercase tracking-widest text-ink-faint">{label}</p>
                <p className="text-sm font-black text-ink font-mono capitalize">{value}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-5 text-xs text-ink-faint font-semibold">
            <ShieldCheck size={13} /> Secure billing managed by Stripe
          </div>
        </div>

        {/* Actions */}
        <div className="px-8 md:px-12 py-10 flex flex-col justify-between gap-8">
          <div>
            <p className="text-2xs font-black uppercase tracking-[0.28em] text-ink-faint mb-6">Actions</p>
            <div className="space-y-3">
              {!isCancelled ? (
                <>
                  <button onClick={handlePortal} disabled={loading !== ""}
                    className="w-full h-12 bg-ink hover:bg-violet text-cream font-black text-xs uppercase tracking-[0.2em] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading === "portal" ? <><Loader2 size={13} className="animate-spin" /> Loading...</> : <><CreditCard size={13} /> Manage Billing <ArrowUpRight size={13} /></>}
                  </button>
                  <button onClick={() => setShowCancel(true)} disabled={loading !== ""}
                    className="w-full h-12 border border-coral/30 text-coral hover:bg-coral hover:text-cream font-black text-xs uppercase tracking-[0.2em] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                    <AlertTriangle size={13} /> Cancel Subscription
                  </button>
                </>
              ) : (
                <button onClick={handlePortal} disabled={loading !== ""}
                  className="w-full h-12 bg-lime hover:bg-lime/80 text-ink font-black text-xs uppercase tracking-[0.2em] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading === "portal" ? <><Loader2 size={13} className="animate-spin" /> Loading...</> : <><CreditCard size={13} /> Reactivate Membership <ArrowUpRight size={13} /></>}
                </button>
              )}
            </div>
          </div>

          {isCancelled && (
            <div className="border border-coral/20 bg-coral/5 p-5 text-sm">
              <p className="font-black text-coral mb-1 text-xs uppercase tracking-widest">Cancelled</p>
              <p className="text-ink-muted font-medium leading-relaxed">
                Your access continues until <span className="font-bold text-ink">{renewalDate}</span>. Reactivate anytime to resume draw entries.
              </p>
            </div>
          )}
        </div>
      </motion.section>

      {/* ── CANCEL MODAL ── */}
      {showCancel && (
        <div className="fixed inset-0 bg-ink/70 backdrop-blur-sm flex items-center justify-center p-5 z-50">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-cream border border-cream-border max-w-md w-full p-8 shadow-card-lg">
            <div className="flex items-start justify-between mb-6">
              <div className="w-12 h-12 border border-coral/20 bg-coral/5 flex items-center justify-center">
                <AlertTriangle size={22} className="text-coral" />
              </div>
              <button onClick={() => setShowCancel(false)} className="p-2 text-ink-faint hover:text-ink transition">
                <X size={18} />
              </button>
            </div>

            <h4 className="text-2xl font-black text-ink mb-3">Cancel subscription?</h4>
            <p className="text-sm text-ink-muted font-medium leading-relaxed mb-8">
              You&apos;ll retain access until{" "}
              <strong className="text-ink">{renewalDate}</strong>. After that date, your scores are excluded from future draws.
            </p>

            <div className="flex flex-col gap-3">
              <button onClick={handleCancel} disabled={loading === "cancel"}
                className="w-full h-12 bg-coral hover:bg-coral/90 text-cream font-black text-xs uppercase tracking-[0.2em] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {loading === "cancel" ? <><Loader2 size={13} className="animate-spin" /> Cancelling...</> : "Yes, Cancel Plan"}
              </button>
              <button onClick={() => setShowCancel(false)}
                className="w-full h-12 border border-cream-border text-ink font-black text-xs uppercase tracking-[0.2em] hover:bg-cream-dim transition-colors">
                Keep My Plan
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
