import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function getCurrentUser() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: dbUser } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return { authUser: user, dbUser: dbUser ?? null }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user?.authUser) {
    redirect('/login')
  }
  // If there's no DB row yet, the user just signed up.
  // Return a safe default so pages don't crash.
  return {
    authUser: user.authUser,
    dbUser: user.dbUser ?? {
      id: user.authUser.id,
      full_name: user.authUser.user_metadata?.full_name ?? 'Player',
      email: user.authUser.email,
      subscription_status: 'inactive',
      subscription_plan: null,
      selected_charity_id: null,
      charity_contribution_percentage: 10,
      subscription_renewal_date: null,
      stripe_customer_id: null,
      is_admin: false,
    },
  }
}

export async function requireAdmin() {
  const user = await requireAuth()
  const isAdmin = user.authUser.app_metadata?.role === 'admin' || user.authUser.user_metadata?.role === 'admin'
  if (!isAdmin) {
    redirect('/login')
  }
  return user
}

export async function requireActiveSubscription() {
  const user = await requireAuth()
  if (user.dbUser?.subscription_status !== 'active') {
    redirect('/subscribe')
  }
  return user
}
