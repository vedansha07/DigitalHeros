"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Loader2, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }
    toast.success("Welcome back!");
    router.push("/dashboard");
    router.refresh();
  };

  const inputCls = "w-full h-12 px-4 border border-cream-border bg-cream text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-violet focus:ring-1 focus:ring-violet transition font-medium";

  return (
    <div>
      {/* Header */}
      <div className="mb-8 pb-8 border-b border-cream-border">
        <p className="text-2xs font-black uppercase tracking-[0.3em] text-ink-faint mb-2">Account Access</p>
        <h1 className="text-3xl font-black text-ink tracking-tight">Welcome back.</h1>
        <p className="text-sm text-ink-muted mt-1.5">Sign in to your Digital Heros account.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        {error && (
          <div className="bg-coral/8 text-coral text-sm p-4 border border-coral/20 font-semibold flex items-start gap-2">
            <span className="mt-0.5">⚠</span> {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-xs font-black uppercase tracking-[0.2em] text-ink-muted mb-2">Email Address</label>
          <input id="email" type="email" required autoComplete="email" value={email}
            onChange={e => setEmail(e.target.value)} className={inputCls} placeholder="you@example.com" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="password" className="text-xs font-black uppercase tracking-[0.2em] text-ink-muted">Password</label>
            <Link href="/forgot-password" className="text-2xs font-bold text-violet hover:text-coral transition-colors uppercase tracking-widest">
              Forgot?
            </Link>
          </div>
          <div className="relative">
            <input id="password" type={showPw ? "text" : "password"} required autoComplete="current-password"
              value={password} onChange={e => setPassword(e.target.value)}
              className={`${inputCls} pr-12`} placeholder="••••••••" />
            <button type="button" aria-label={showPw ? "Hide" : "Show"} onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink transition p-1.5">
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full h-12 bg-ink hover:bg-violet text-cream font-black text-xs uppercase tracking-[0.2em] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
          {loading ? <><Loader2 size={14} className="animate-spin" /> Signing in...</> : <>Sign In <ArrowUpRight size={14} /></>}
        </button>
      </form>

      <p className="text-center text-sm text-ink-muted mt-8 pt-8 border-t border-cream-border">
        No account?{" "}
        <Link href="/signup" className="text-violet font-bold hover:text-coral transition-colors">Create one</Link>
      </p>
    </div>
  );
}
