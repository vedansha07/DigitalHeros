"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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
      setError("Invalid email or password. Please try again.");
      setLoading(false);
      return;
    }

    toast.success("Welcome back!");
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-primary tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted mt-1.5">Sign in to your Digital Heros account.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        {error && (
          <div className="bg-red-50 text-red-700 text-sm p-3.5 rounded-xl border border-red-100 flex items-start gap-2.5 font-medium">
            <span className="text-red-500 mt-0.5">⚠</span> {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-semibold text-primary">
            Email address
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-surface-border bg-surface text-sm text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-semibold text-primary">
              Password
            </label>
            <Link href="/forgot-password" className="text-xs text-accent hover:text-accent/80 font-semibold transition">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPw ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-4 pr-11 rounded-xl border border-surface-border bg-surface text-sm text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
              placeholder="••••••••"
            />
            <button
              type="button"
              aria-label={showPw ? "Hide password" : "Show password"}
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-light hover:text-muted transition p-1"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-primary hover:bg-primary-light text-white font-bold text-sm rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2 hover:shadow-card-md"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <p className="text-center text-sm text-muted mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-accent font-semibold hover:text-accent/80 transition">
          Create account
        </Link>
      </p>
    </div>
  );
}
