"use client"

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
    })

    if (resetError) {
      setError(resetError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="flex flex-col gap-6 text-center">
        <h2 className="text-xl font-semibold text-primary">Check your email</h2>
        <p className="text-sm text-gray-500">
          We've sent a password reset link to <span className="font-medium text-gray-900">{email}</span>. 
          Please check your inbox.
        </p>
        <Link href="/login" className="w-full bg-primary hover:bg-primary/90 text-white font-medium rounded-lg px-4 py-2 mt-4 transition block">
          Return to sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-primary">Reset password</h2>
        <p className="text-sm text-gray-500 mt-2">Enter your email and we'll send you a reset link.</p>
      </div>

      <form onSubmit={handleReset} className="flex flex-col gap-4">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-primary">Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
            placeholder="jsmith@example.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium rounded-lg px-4 py-2 mt-2 transition disabled:opacity-70"
        >
          {loading ? 'Sending link...' : 'Send reset link'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500">
        Remember your password?{' '}
        <Link href="/login" className="text-accent font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
