"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const pwMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Immediately sign in — this works even if email confirmation is enabled
    // because Supabase still creates the session on signUp in many configs.
    // If email confirmation fires, the callback route handles the rest.
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

    if (loginError) {
      // Account created but email confirmation is required
      toast.success("Account created! Check your email to confirm, then log in.");
      router.push("/login");
      return;
    }

    toast.success("Welcome to Digital Heros!");
    router.push("/subscribe");
    router.refresh();
  };

  const inputClass = "w-full h-11 px-4 rounded-xl border border-surface-border bg-surface text-sm text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition";

  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-black text-primary tracking-tight">Create your account</h1>
        <p className="text-sm text-muted mt-1.5">Join Digital Heros and start making a difference.</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-700 text-sm p-3.5 rounded-xl border border-red-100 font-medium flex items-start gap-2">
            <span className="text-red-500 mt-0.5">⚠</span> {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="full-name" className="block text-sm font-semibold text-primary">Full name</label>
          <input id="full-name" type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} placeholder="John Smith" autoComplete="name" />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-semibold text-primary">Email address</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="you@example.com" autoComplete="email" />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-sm font-semibold text-primary">Password</label>
          <div className="relative">
            <input id="password" type={showPw ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className={`${inputClass} pr-11`} placeholder="Min. 6 characters" autoComplete="new-password" />
            <button type="button" aria-label={showPw ? "Hide password" : "Show password"} onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-light hover:text-muted transition p-1">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="confirm-password" className="block text-sm font-semibold text-primary">Confirm password</label>
          <div className="relative">
            <input id="confirm-password" type={showPw ? "text" : "password"} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`${inputClass} pr-11 ${confirmPassword.length > 0 && !pwMatch ? "border-red-300 focus:ring-red-400" : pwMatch ? "border-accent" : ""}`} placeholder="••••••••" autoComplete="new-password" />
            {pwMatch && <Check size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-accent" />}
          </div>
          {confirmPassword.length > 0 && !pwMatch && <p className="text-xs text-red-500 font-medium">Passwords don&apos;t match</p>}
        </div>

        <button type="submit" disabled={loading} className="w-full h-11 bg-primary hover:bg-primary-light text-white font-bold text-sm rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2 hover:shadow-card-md">
          {loading ? <><Loader2 size={16} className="animate-spin" /> Creating account...</> : "Create account"}
        </button>
      </form>

      <p className="text-center text-sm text-muted mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-accent font-semibold hover:text-accent/80 transition">Sign in</Link>
      </p>
    </div>
  );
}
