"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, Loader2, Zap, Shield, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const MONTHLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID || "price_monthly_placeholder";
const YEARLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID || "price_yearly_placeholder";

const features = {
  monthly: [
    "Full platform access",
    "5 score entries per month",
    "Monthly draw entry",
    "Choose your charity",
  ],
  yearly: [
    "Everything in Monthly",
    "2 months free (save 20%)",
    "Priority support",
    "Annual summary report",
  ],
};

export default function SubscribeClient({ dbUser, isLoggedIn }: { dbUser: any; isLoggedIn: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const isActive = dbUser?.subscription_status === "active";

  const handleSubscribe = async (priceId: string, plan: string) => {
    // Not logged in at all — send to signup
    if (!isLoggedIn) {
      router.push("/signup");
      return;
    }

    setLoading(plan);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, plan }),
        credentials: "include", // Ensure cookies are sent
      });

      const data = await res.json();

      if (res.status === 401) {
        toast.error("Session expired. Please sign in again.");
        router.push("/login");
        return;
      }

      if (res.status === 400) {
        toast.error(data.error || "Subscription error.");
        setLoading(null);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Something went wrong. Please try again.");
        setLoading(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Please check your connection.");
      setLoading(null);
    }
  };

  const handleManage = async () => {
    setLoading("manage");
    try {
      const res = await fetch("/api/stripe/create-portal", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Could not open billing portal.");
        setLoading(null);
      }
    } catch {
      toast.error("Network error. Please try again.");
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-primary bg-dot text-white">
      {/* Header */}
      <div className="pt-32 pb-16 text-center relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-accent/8 blur-[100px] rounded-full pointer-events-none" />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 text-2xs font-black uppercase tracking-widest text-accent bg-accent/10 border border-accent/20 px-3 py-1.5 rounded-lg mb-5">
            <Zap size={10} /> Memberships
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            Choose your plan
          </h1>
          <p className="text-white/50 text-lg font-medium max-w-md mx-auto">
            Subscribe once. Score golf. Support charity. Win prizes.
          </p>

          {isActive && (
            <div className="mt-8 inline-flex flex-col items-center gap-3 bg-accent/10 border border-accent/25 rounded-2xl px-8 py-5">
              <div className="flex items-center gap-2 text-accent font-black">
                <Check size={18} /> Active {dbUser.subscription_plan} plan
              </div>
              <button
                onClick={handleManage}
                disabled={loading === "manage"}
                className="text-sm font-semibold text-white/60 hover:text-white transition flex items-center gap-1"
              >
                {loading === "manage" ? (
                  <><Loader2 size={14} className="animate-spin" /> Loading...</>
                ) : (
                  <><Shield size={14} /> Manage billing</>
                )}
              </button>
            </div>
          )}

          {!isLoggedIn && (
            <p className="mt-6 text-sm text-white/40 font-medium">
              Already have an account?{" "}
              <Link href="/login" className="text-accent font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* Plans */}
      <div className="max-w-4xl mx-auto px-5 lg:px-8 pb-24">
        <div className="grid md:grid-cols-2 gap-6">

          {/* Monthly */}
          <div className="bg-white/4 border border-white/10 rounded-3xl p-8 flex flex-col hover:bg-white/6 transition-colors">
            <div className="mb-6">
              <h3 className="text-xl font-black text-white mb-1">Monthly</h3>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-black text-white font-mono">£10</span>
                <span className="text-white/40 font-medium pb-1.5">/month</span>
              </div>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {features.monthly.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-white/60 font-medium">
                  <Check size={15} className="text-accent shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <button
              id="subscribe-monthly-btn"
              onClick={() => handleSubscribe(MONTHLY_PRICE_ID, "monthly")}
              disabled={isActive || !!loading}
              className="w-full h-12 bg-white/10 border border-white/15 hover:bg-white/15 text-white font-black rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
            >
              {loading === "monthly" ? (
                <><Loader2 size={16} className="animate-spin" /> Processing...</>
              ) : isActive ? (
                "Current Plan"
              ) : (
                <>Subscribe Monthly <ChevronRight size={15} /></>
              )}
            </button>
          </div>

          {/* Yearly — highlighted */}
          <div className="bg-accent/8 border-2 border-accent/60 rounded-3xl p-8 flex flex-col relative shadow-glow-sm hover:shadow-glow-md transition-all">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="bg-accent text-primary text-2xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                Best value · Save 20%
              </span>
            </div>
            <div className="mb-6 mt-2">
              <h3 className="text-xl font-black text-white mb-1">Yearly</h3>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-black text-white font-mono">£96</span>
                <span className="text-white/40 font-medium pb-1.5">/year</span>
              </div>
              <p className="text-2xs text-accent/80 font-bold mt-1">£8/mo — 2 months free</p>
            </div>
            <ul className="space-y-3 mb-8 flex-1">
              {features.yearly.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-white/70 font-medium">
                  <Check size={15} className="text-accent shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <button
              id="subscribe-yearly-btn"
              onClick={() => handleSubscribe(YEARLY_PRICE_ID, "yearly")}
              disabled={isActive || !!loading}
              className="w-full h-12 bg-accent hover:bg-accent/90 text-primary font-black rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm shadow-glow-sm"
            >
              {loading === "yearly" ? (
                <><Loader2 size={16} className="animate-spin" /> Processing...</>
              ) : isActive ? (
                "Current Plan"
              ) : (
                <>Subscribe Yearly <ChevronRight size={15} /></>
              )}
            </button>
          </div>
        </div>

        {/* Trust line */}
        <p className="text-center text-xs text-white/25 font-medium mt-8">
          Secure payment via Stripe · Cancel anytime · No hidden fees
        </p>
      </div>
    </div>
  );
}
