"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Loader2, Check, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const pwMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }

    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) { setError(updateError.message); setLoading(false); return; }
    toast.success("Password updated! Please sign in.");
    router.push("/login");
  };

  const inputCls = "w-full h-12 px-4 border border-cream-border bg-cream text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-violet focus:ring-1 focus:ring-violet transition font-medium";

  return (
    <div>
      <div className="mb-8 pb-8 border-b border-cream-border">
        <p className="text-2xs font-black uppercase tracking-[0.3em] text-ink-faint mb-2">Security</p>
        <h1 className="text-3xl font-black text-ink tracking-tight">New password.</h1>
        <p className="text-sm text-ink-muted mt-1.5">Choose a strong password for your account.</p>
      </div>

      <form onSubmit={handleUpdate} className="space-y-5">
        {error && (
          <div className="bg-coral/8 text-coral text-sm p-4 border border-coral/20 font-semibold flex items-start gap-2">
            <span>⚠</span> {error}
          </div>
        )}

        <div>
          <label htmlFor="password" className="block text-xs font-black uppercase tracking-[0.2em] text-ink-muted mb-2">New Password</label>
          <div className="relative">
            <input id="password" type={showPw ? "text" : "password"} required value={password}
              onChange={e => setPassword(e.target.value)} className={`${inputCls} pr-12`}
              placeholder="Min. 6 characters" autoComplete="new-password" />
            <button type="button" onClick={() => setShowPw(!showPw)} aria-label="Toggle password"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink transition p-1.5">
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-xs font-black uppercase tracking-[0.2em] text-ink-muted mb-2">Confirm Password</label>
          <div className="relative">
            <input id="confirm-password" type={showPw ? "text" : "password"} required value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className={`${inputCls} pr-12 ${confirmPassword.length > 0 && !pwMatch ? "border-coral focus:ring-coral" : pwMatch ? "border-lime focus:ring-lime" : ""}`}
              placeholder="••••••••" autoComplete="new-password" />
            {pwMatch && <Check size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-lime" />}
          </div>
          {confirmPassword.length > 0 && !pwMatch && (
            <p className="text-xs text-coral font-semibold mt-1.5">Passwords don&apos;t match</p>
          )}
        </div>

        <button type="submit" disabled={loading}
          className="w-full h-12 bg-ink hover:bg-violet text-cream font-black text-xs uppercase tracking-[0.2em] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
          {loading ? <><Loader2 size={14} className="animate-spin" /> Updating...</> : <>Update Password <ArrowUpRight size={14} /></>}
        </button>
      </form>
    </div>
  );
}
