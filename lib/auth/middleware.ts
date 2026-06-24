// middleware.ts

/**
 * ============================================================================
 * Authentication Middleware
 * ============================================================================
 *
 * Purpose
 * -------
 * Centralized authentication protection for the application.
 *
 * Responsibilities
 * ----------------
 * 1. Read and verify the current Supabase session from auth cookies.
 * 2. Allow guests to access:
 *    - /login
 *    - /signup
 * 3. Redirect unauthenticated users away from protected routes.
 * 4. Prevent authenticated users from visiting:
 *    - /login
 *    - /signup
 *
 * What This Middleware Does NOT Do
 * --------------------------------
 * - Does NOT check user roles.
 * - Does NOT query the database.
 * - Does NOT validate cohort membership.
 * - Does NOT validate pod membership.
 * - Does NOT authorize admin access.
 * - Does NOT do role-based redirects from /dashboard.
 *   (That is handled by app/dashboard/page.tsx using requireUserRecord())
 *
 * Authorization Strategy
 * ----------------------
 * Authorization is performed inside Server Components,
 * Route Handlers, and Server Actions using:
 *
 * - requireAdmin()
 * - requirePM()
 * - requireAssociate()
 * - requireMentor()
 * - requireCohortMember()
 * - requireCohortMentor()
 * - requirePodMember()
 *
 * Source of Truth
 * ---------------
 * public.users
 * public.cohort_members
 * public.pod_members
 *
 * Protected Routes
 * ----------------
 * /dashboard
 * /admin/*
 * /cohorts/*
 *
 * Guest Routes
 * ------------
 * /login
 * /signup
 *
 * Note on getUser() vs getSession()
 * ----------------------------------
 * We use supabase.auth.getUser() instead of getSession() here.
 * getSession() reads the JWT from the cookie and trusts it without
 * re-validating against the Supabase Auth server — making it
 * unsuitable for security-sensitive middleware checks.
 * getUser() makes a lightweight network call to verify the token
 * is still valid and has not been revoked.
 * ============================================================================
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const pathname = request.nextUrl.pathname;

  // ---------------------------------------------------------------------------
  // Public authentication pages
  // ---------------------------------------------------------------------------

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/signup";

  // ---------------------------------------------------------------------------
  // Create Supabase client using request cookies
  // ---------------------------------------------------------------------------

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // ---------------------------------------------------------------------------
  // Verify the current user with the Supabase Auth server.
  //
  // getUser() is used here (not getSession()) because middleware
  // runs on every matched request. getSession() would trust the cookie
  // blindly without verifying it hasn't been revoked — a security risk.
  // ---------------------------------------------------------------------------

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ---------------------------------------------------------------------------
  // Guest user (no valid session)
  // ---------------------------------------------------------------------------

  if (!user) {
    // Allow guests to access login/signup
    if (isAuthPage) {
      return response;
    }

    // Redirect guests away from all protected routes
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ---------------------------------------------------------------------------
  // Authenticated user
  // ---------------------------------------------------------------------------

  // Prevent logged-in users from revisiting auth pages
  if (isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow the request to continue.
  // Role-based authorization happens inside each Server Component/Route Handler.
  // Role-based redirects from /dashboard happen in app/dashboard/page.tsx.
  return response;
}

export const config = {
  matcher: [
    "/login",
    "/signup",

    // Protected application routes
    "/dashboard",
    "/admin/:path*",
    "/cohorts/:path*",
  ],
};