"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Loader2, Check, Lock } from "lucide-react";
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
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    toast.success("Password updated successfully! Please sign in.");
    router.push("/login");
  };

  const inputClass = "w-full h-11 px-4 rounded-xl border border-surface-border bg-surface text-sm text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition";

  return (
    <div>
      <div className="mb-7">
        <div className="h-12 w-12 rounded-xl bg-primary/5 border border-surface-border flex items-center justify-center mb-5">
          <Lock size={22} className="text-primary" />
        </div>
        <h1 className="text-2xl font-black text-primary tracking-tight">Set new password</h1>
        <p className="text-sm text-muted mt-1.5">Enter your new password below.</p>
      </div>

      <form onSubmit={handleUpdate} className="space-y-5">
        {error && (
          <div className="bg-red-50 text-red-700 text-sm p-3.5 rounded-xl border border-red-100 font-medium flex items-start gap-2">
            <span className="text-red-500 mt-0.5">⚠</span> {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-sm font-semibold text-primary">
            New Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPw ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputClass} pr-11`}
              placeholder="Min. 6 characters"
              autoComplete="new-password"
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

        <div className="space-y-1.5">
          <label htmlFor="confirm-password" className="block text-sm font-semibold text-primary">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              type={showPw ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`${inputClass} pr-11 ${
                confirmPassword.length > 0 && !pwMatch ? "border-red-300 focus:ring-red-400" : pwMatch ? "border-accent" : ""
              }`}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            {pwMatch && <Check size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-accent" />}
          </div>
          {confirmPassword.length > 0 && !pwMatch && (
            <p className="text-xs text-red-500 font-medium">Passwords don&apos;t match</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-primary hover:bg-primary-light text-white font-bold text-sm rounded-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2 hover:shadow-card-md"
        >
          {loading ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Updating...
            </>
          ) : (
            "Update password"
          )}
        </button>
      </form>
    </div>
  );
}
