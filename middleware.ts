import { NextResponse, type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

export default async function middleware(request: NextRequest) {
  const { nextUrl } = request

  // Demo mode — skip auth, redirect to dashboard as if logged in
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    const isLanding = nextUrl.pathname === "/"
    const isAuthPage =
      nextUrl.pathname.startsWith("/login") ||
      nextUrl.pathname.startsWith("/register") ||
      nextUrl.pathname.startsWith("/onboarding")

    if (isLanding || isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl))
    }

    const response = NextResponse.next()
    response.headers.set("X-Frame-Options", "DENY")
    response.headers.set("X-Content-Type-Options", "nosniff")
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
    return response
  }

  const { user, supabaseResponse } = await updateSession(request)
  const isLoggedIn = !!user

  const isAuthRoute =
    nextUrl.pathname.startsWith("/login") ||
    nextUrl.pathname.startsWith("/register") ||
    nextUrl.pathname.startsWith("/forgot-password")

  const isProtectedRoute =
    nextUrl.pathname.startsWith("/dashboard") ||
    nextUrl.pathname.startsWith("/api/protected") ||
    nextUrl.pathname.startsWith("/onboarding")

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
  const isApiOnboardingRoute = nextUrl.pathname.startsWith("/api/onboarding")

  // Allow API auth and onboarding routes
  if (isApiAuthRoute || isApiOnboardingRoute) {
    return supabaseResponse
  }

  // Redirect logged-in users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  // Redirect guests away from protected pages
  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl)
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect users who haven't completed onboarding away from dashboard
  if (isLoggedIn && nextUrl.pathname.startsWith("/dashboard")) {
    const onboardingComplete = user!.user_metadata?.onboardingComplete
    if (!onboardingComplete) {
      return NextResponse.redirect(new URL("/onboarding", nextUrl))
    }
  }

  // Security headers
  supabaseResponse.headers.set("X-Frame-Options", "DENY")
  supabaseResponse.headers.set("X-Content-Type-Options", "nosniff")
  supabaseResponse.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
