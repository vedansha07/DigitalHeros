import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  // Skip if Supabase env vars aren't configured
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) return response

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({ name, value, ...options })
        response = NextResponse.next({ request: { headers: request.headers } })
        response.cookies.set({ name, value, ...options })
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({ name, value: '', ...options })
        response = NextResponse.next({ request: { headers: request.headers } })
        response.cookies.set({ name, value: '', ...options })
      },
    },
  })

  // Refresh session — CRITICAL: this keeps the session cookie alive on every request
  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    // Auth failure — treat as unauthenticated
  }

  const { pathname } = request.nextUrl
  const isDashboard = pathname.startsWith('/dashboard')
  const isAdminRoute = pathname.startsWith('/admin')

  // ── Protect dashboard + admin routes ──────────────────────
  if (isDashboard || isAdminRoute) {
    if (!user) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Admin role check
    if (isAdminRoute) {
      const isAdmin =
        user.app_metadata?.role === 'admin' ||
        user.user_metadata?.role === 'admin'
      if (!isAdmin) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    }

    // Note: subscription check is handled at the page level, not middleware
    // This lets the dashboard show a subscribe CTA for inactive users
  }

  // ── Redirect already-logged-in users away from auth pages ──
  if (user && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
