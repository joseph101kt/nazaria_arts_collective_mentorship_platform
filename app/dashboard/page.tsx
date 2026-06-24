// app/dashboard/page.tsx

/**
 * ============================================================================
 * Dashboard Page — Role-Based Redirect
 * ============================================================================
 *
 * Purpose
 * -------
 * Acts as a routing hub after login.
 * Reads the user's role from the database and redirects them
 * to the correct landing page for their role.
 *
 * Why Here and Not Middleware?
 * ----------------------------
 * Middleware cannot query the database cheaply on every request.
 * This Server Component runs once after login and redirects
 * to the appropriate destination using:
 *
 * - requireUserRecord() → fetches user + role from public.users
 * - getDashboardRoute()  → maps role to destination path
 *
 * Role → Destination
 * ------------------
 * PM         → /admin/pulse
 * Associate  → /admin/escalations
 * Mentor     → /cohorts/[cohort-slug]
 * Mentee     → /cohorts/[cohort-slug]
 *
 * For Mentors and Mentees, a second query fetches their active
 * cohort membership to resolve the cohort slug.
 *
 * Edge Cases
 * ----------
 * - If a Mentor or Mentee has no active cohort assignment,
 *   they are redirected to /no-cohort.
 * - Deactivated users are caught by requireUserRecord() (deleted_at check)
 *   and redirected to /login.
 * ============================================================================
 */

import { redirect } from "next/navigation";

import { requireUserRecord } from "@/lib/auth/guards";
import { getDashboardRoute } from "@/lib/auth/redirects";
import { UserRole } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  // -------------------------------------------------------------------------
  // Fetch the current user record from public.users.
  // Redirects to /login if unauthenticated or deactivated (deleted_at IS NULL).
  // -------------------------------------------------------------------------

  const user = await requireUserRecord();
  const role = user.role as UserRole;

  // -------------------------------------------------------------------------
  // Mentors and Mentees need their cohort slug to resolve their destination.
  // -------------------------------------------------------------------------

  if (role === UserRole.MENTOR || role === UserRole.MENTEE) {
    const supabase = await createClient();

    const { data } = await supabase
      .from("cohort_members")
      .select("cohorts(slug)")
      .eq("user_id", user.id)
      .is("left_at", null)        // active membership only
      .single();

    // cohort_members.cohort_id → cohorts.id is a many-to-one FK,
    // so Supabase returns `cohorts` as an object, not an array.
    // Cast here until database types are generated (lib/types/database.ts).
    const cohortSlug = (data?.cohorts as { slug: string } | null)?.slug;

    if (!cohortSlug) {
      // User has no active cohort assignment.
      // Create this page to show a friendly "awaiting assignment" message.
      redirect("/no-cohort");
    }

    redirect(getDashboardRoute(role, cohortSlug));
  }

  // -------------------------------------------------------------------------
  // PM and Associate do not need a cohort slug.
  // -------------------------------------------------------------------------

  redirect(getDashboardRoute(role));
}