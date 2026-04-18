"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="text-center space-y-5">
        <div className="h-16 w-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto">
          <CheckCircle2 size={32} className="text-accent" />
        </div>
        <div>
          <h1 className="text-xl font-black text-primary">Check your inbox</h1>
          <p className="text-sm text-muted mt-2 leading-relaxed">
            We sent a reset link to <span className="font-semibold text-primary">{email}</span>.
            It may take a minute to arrive.
          </p>
        </div>
        <Link
          href="/login"
          className="block w-full h-11 bg-primary hover:bg-primary-light text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center hover:shadow-card-md"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-7">
        <div className="h-12 w-12 rounded-xl bg-primary/5 border border-surface-border flex items-center justify-center mb-5">
          <Mail size={22} className="text-primary" />
        </div>
        <h1 className="text-2xl font-black text-primary tracking-tight">Forgot password?</h1>
        <p className="text-sm text-muted mt-1.5">Enter your email and we&apos;ll send you a reset link.</p>
      </div>

      <form onSubmit={handleReset} className="space-y-5">
        {error && (
          <div className="bg-red-50 text-red-700 text-sm p-3.5 rounded-xl border border-red-100 font-medium">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-semibold text-primary">Email address</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-surface-border bg-surface text-sm text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-primary hover:bg-primary-light text-white font-bold text-sm rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2 hover:shadow-card-md"
        >
          {loading ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : "Send reset link"}
        </button>
      </form>

      <p className="text-center text-sm text-muted mt-6">
        Remember your password?{" "}
        <Link href="/login" className="text-accent font-semibold hover:text-accent/80 transition">Sign in</Link>
      </p>
    </div>
  );
}
