import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Skip middleware for static files, API routes, and public assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Get the current user
  const { data: { user }, error } = await supabase.auth.getUser()
  
  console.log('🔍 Middleware:', pathname, 'User:', !!user, error ? `Error: ${error.message}` : '')

  // Define route types
  const publicRoutes = ['/', '/about', '/contact', '/blog', '/work', '/process', '/services']
  const authRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password', '/auth/verify']
  const protectedRoutes = ['/dashboard', '/onboarding']
  const previewRoutes = ['/preview'] // Public preview routes
  
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isPreviewRoute = previewRoutes.some(route => pathname.startsWith(route))

  // Allow public routes for everyone
  if (isPublicRoute || isPreviewRoute) {
    return supabaseResponse
  }

  // Handle unauthenticated users
  if (!user) {
    // Allow auth routes
    if (isAuthRoute) {
      return supabaseResponse
    }
    
    // Redirect to login for protected routes
    if (isProtectedRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/auth/login'
      return NextResponse.redirect(url)
    }
  }

  // Handle authenticated users
  if (user) {
    // Redirect away from auth routes to dashboard
    if (isAuthRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }

    // Allow access to protected routes
    if (isProtectedRoute) {
      return supabaseResponse
    }
  }

  // Default: allow the request
  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}