import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Guard: if Supabase env vars aren't configured yet, skip auth checks
  // and pass through — public pages will still render
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) {
    return response
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    // Auth failure (e.g. invalid key) — fall through to unauthenticated logic
  }

  const { pathname } = request.nextUrl

  const isDashboard = pathname.startsWith('/dashboard')
  const isAdminRoute = pathname.startsWith('/admin')

  // Combine protected routes check
  if (isDashboard || isAdminRoute) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Check admin role
    const isAdmin = user.app_metadata?.role === 'admin' || user.user_metadata?.role === 'admin'
    if (isAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Check dashboard subscription explicitly as requested
    if (isDashboard) {
      try {
        const { data: dbUser } = await supabase
          .from('users')
          .select('subscription_status')
          .eq('id', user.id)
          .single()
        
        if (dbUser?.subscription_status !== 'active') {
          return NextResponse.redirect(new URL('/subscribe', request.url))
        }
      } catch {
        // DB unreachable — let the page handle its own error state
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
