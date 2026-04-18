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

  return { authUser: user, dbUser }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }
  return user
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
