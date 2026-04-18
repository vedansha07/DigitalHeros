"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, Loader2, ArrowUpRight, Shield } from "lucide-react";
import { toast } from "sonner";
import PublicNavbar from "@/components/layout/PublicNavbar";

const MONTHLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID || "price_monthly_placeholder";
const YEARLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID || "price_yearly_placeholder";

const monthlyFeatures = [
  "Full platform access",
  "5 score entries per month",
  "Monthly draw entry",
  "Choose your charity",
];
const yearlyFeatures = [
  "Everything in Monthly",
  "2 months free (save 20%)",
  "Priority support",
  "Annual summary report",
];

export default function SubscribeClient({ dbUser, isLoggedIn }: { dbUser: any; isLoggedIn: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const isActive = dbUser?.subscription_status === "active";

  const handleSubscribe = async (priceId: string, plan: string) => {
    if (!isLoggedIn) { router.push("/signup"); return; }
    setLoading(plan);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, plan }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.status === 401) { toast.error("Session expired. Please sign in again."); router.push("/login"); return; }
      if (res.status === 400) { toast.error(data.error || "Subscription error."); setLoading(null); return; }
      if (data.url) { window.location.href = data.url; }
      else { toast.error(data.error || "Something went wrong."); setLoading(null); }
    } catch { toast.error("Network error."); setLoading(null); }
  };

  const handleManage = async () => {
    setLoading("manage");
    try {
      const res = await fetch("/api/stripe/create-portal", { method: "POST", credentials: "include" });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; }
      else { toast.error(data.error || "Could not open billing portal."); setLoading(null); }
    } catch { toast.error("Network error."); setLoading(null); }
  };

  return (
    <div className="min-h-screen bg-cream text-ink bg-dot">
      <PublicNavbar />

      {/* ── HEADER ── */}
      <div className="pt-28 pb-16 px-6 lg:px-12 border-b border-cream-border max-w-[1400px] mx-auto">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-ink-faint mb-4 flex items-center gap-2">
          <span className="w-8 h-px bg-ink-faint" /> Plans & Pricing
        </p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <h1 className="text-6xl md:text-7xl font-black tracking-tight leading-none">
            Choose your<br /><span className="text-violet">plan.</span>
          </h1>
          {isActive ? (
            <div className="flex flex-col gap-3">
              <div className="inline-flex items-center gap-2 bg-lime/20 border border-lime px-6 py-3 text-sm font-black text-ink uppercase tracking-widest">
                <Check size={16} className="text-lime" /> Active {dbUser.subscription_plan} plan
              </div>
              <button onClick={handleManage} disabled={loading === "manage"}
                className="inline-flex items-center gap-2 border border-cream-border text-ink-muted text-xs font-bold uppercase tracking-widest px-4 py-2 hover:bg-cream-dim transition-colors">
                {loading === "manage" ? <><Loader2 size={12} className="animate-spin" /> Loading...</> : <><Shield size={12} /> Manage Billing</>}
              </button>
            </div>
          ) : (
            !isLoggedIn && (
              <p className="text-sm text-ink-muted">
                Have an account?{" "}
                <Link href="/login" className="text-violet font-bold hover:text-coral transition-colors">Sign in</Link>
              </p>
            )
          )}
        </div>
      </div>

      {/* ── PLAN GRID ── */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16">
        <div className="grid md:grid-cols-2 gap-0 border border-cream-border divide-y md:divide-y-0 md:divide-x divide-cream-border">

          {/* Monthly */}
          <div className="p-10 md:p-14 flex flex-col bg-cream hover:bg-cream-dim transition-colors">
            <div className="mb-8">
              <p className="text-2xs font-black uppercase tracking-[0.3em] text-ink-faint mb-3">Monthly</p>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-7xl font-black text-ink font-mono leading-none">£10</span>
                <span className="text-ink-muted font-medium pb-2">/month</span>
              </div>
              <p className="text-xs text-ink-muted">Billed monthly · Cancel anytime</p>
            </div>

            <ul className="space-y-3 mb-10 flex-1">
              {monthlyFeatures.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-ink-muted font-medium">
                  <div className="w-4 h-4 border border-cream-border flex items-center justify-center shrink-0">
                    <Check size={10} className="text-violet" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            <button id="subscribe-monthly-btn"
              onClick={() => handleSubscribe(MONTHLY_PRICE_ID, "monthly")}
              disabled={isActive || !!loading}
              className="w-full h-12 border border-ink text-ink hover:bg-ink hover:text-cream font-black text-xs uppercase tracking-[0.2em] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading === "monthly" ? <><Loader2 size={14} className="animate-spin" /> Processing...</>
                : isActive ? "Current Plan"
                : <>Subscribe Monthly <ArrowUpRight size={14} /></>}
            </button>
          </div>

          {/* Yearly — featured */}
          <div className="p-10 md:p-14 flex flex-col bg-violet relative">
            <div className="absolute top-6 right-6">
              <span className="bg-lime text-ink text-2xs font-black uppercase tracking-widest px-3 py-1.5">
                Save 20%
              </span>
            </div>

            <div className="mb-8">
              <p className="text-2xs font-black uppercase tracking-[0.3em] text-white/40 mb-3">Yearly · Best Value</p>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-7xl font-black text-cream font-mono leading-none">£96</span>
                <span className="text-white/40 font-medium pb-2">/year</span>
              </div>
              <p className="text-xs text-white/50">£8/mo · 2 months free</p>
            </div>

            <ul className="space-y-3 mb-10 flex-1">
              {yearlyFeatures.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-white/70 font-medium">
                  <div className="w-4 h-4 border border-white/20 flex items-center justify-center shrink-0">
                    <Check size={10} className="text-lime" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            <button id="subscribe-yearly-btn"
              onClick={() => handleSubscribe(YEARLY_PRICE_ID, "yearly")}
              disabled={isActive || !!loading}
              className="w-full h-12 bg-lime hover:bg-lime/80 text-ink font-black text-xs uppercase tracking-[0.2em] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading === "yearly" ? <><Loader2 size={14} className="animate-spin" /> Processing...</>
                : isActive ? "Current Plan"
                : <>Subscribe Yearly <ArrowUpRight size={14} /></>}
            </button>
          </div>
        </div>

        {/* Trust line */}
        <div className="flex items-center justify-center gap-6 mt-10 pt-10 border-t border-cream-border">
          {["Secure payments via Stripe", "Cancel anytime", "No hidden fees"].map(t => (
            <div key={t} className="flex items-center gap-2 text-xs text-ink-muted font-semibold">
              <div className="w-1 h-1 rounded-full bg-lime" />
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
