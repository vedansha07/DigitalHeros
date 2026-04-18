"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Loader2, ArrowUpRight, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (err) { setError(err.message); setLoading(false); return; }
    setSent(true);
    setLoading(false);
  };

  return (
    <div>
      <div className="mb-8 pb-8 border-b border-cream-border">
        <p className="text-2xs font-black uppercase tracking-[0.3em] text-ink-faint mb-2">Password Reset</p>
        <h1 className="text-3xl font-black text-ink tracking-tight">Forgot password.</h1>
        <p className="text-sm text-ink-muted mt-1.5">
          No worries — we&apos;ll send you a reset link.
        </p>
      </div>

      {sent ? (
        <div className="text-center py-6">
          <div className="w-14 h-14 border border-lime bg-lime/10 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={24} className="text-lime" />
          </div>
          <p className="font-black text-ink text-lg mb-2">Check your inbox</p>
          <p className="text-sm text-ink-muted mb-8">
            We sent a reset link to <span className="font-bold text-ink">{email}</span>
          </p>
          <Link href="/login" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-violet hover:text-coral transition-colors">
            <ArrowLeft size={12} /> Back to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-coral/8 text-coral text-sm p-4 border border-coral/20 font-semibold">⚠ {error}</div>
          )}
          <div>
            <label htmlFor="email" className="block text-xs font-black uppercase tracking-[0.2em] text-ink-muted mb-2">Email Address</label>
            <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="w-full h-12 px-4 border border-cream-border bg-cream text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-violet focus:ring-1 focus:ring-violet transition"
              placeholder="you@example.com" autoComplete="email" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full h-12 bg-ink hover:bg-violet text-cream font-black text-xs uppercase tracking-[0.2em] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <><Loader2 size={14} className="animate-spin" /> Sending...</> : <>Send Reset Link <ArrowUpRight size={14} /></>}
          </button>
        </form>
      )}

      <p className="text-center text-sm text-ink-muted mt-8 pt-8 border-t border-cream-border">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-violet font-bold hover:text-coral transition-colors">
          <ArrowLeft size={12} /> Back to Sign In
        </Link>
      </p>
    </div>
  );
}
