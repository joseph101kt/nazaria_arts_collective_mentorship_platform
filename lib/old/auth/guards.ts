// lib/auth/guards.ts

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { UserRole } from "./roles";

/**
 * Ensures a user is authenticated.
 *
 * Usage:
 * const authUser = await requireAuth();
 */
export async function requireAuth() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect unauthenticated users
  if (!user) {
    redirect("/login");
  }

  return user;
}

/**
 * Ensures the current user exists in the public.users table.
 *
 * Useful because auth.users and public.users
 * are separate tables.
 */
export async function requireUserRecord() {
  const authUser = await requireAuth();

  const supabase = await createClient();

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", authUser.id)
    .is("deleted_at", null)
    .single();

  if (error || !user) {
    redirect("/login");
  }

  return user;
}

/**
 * Ensures the current user has one of the allowed roles.
 */
export async function requireRole(
  allowedRoles: UserRole[]
) {
  const user = await requireUserRecord();

  if (
    !allowedRoles.includes(
      user.role as UserRole
    )
  ) {
    redirect("/dashboard");
  }

  return user;
}

/**
 * PM only
 */
export async function requirePM() {
  return requireRole([
    UserRole.PM,
  ]);
}

/**
 * Associate or PM
 */
export async function requireAssociate() {
  return requireRole([
    UserRole.ASSOCIATE,
    UserRole.PM,
  ]);
}

/**
 * Any admin-level role
 */
export async function requireAdmin() {
  return requireRole([
    UserRole.PM,
    UserRole.ASSOCIATE,
  ]);
}

/**
 * Mentor only
 */
export async function requireMentor() {
  return requireRole([
    UserRole.MENTOR,
  ]);
}

/**
 * Ensures the current user belongs to a cohort.
 *
 * Example:
 * await requireCohortMember(cohortId);
 */
export async function requireCohortMember(
  cohortId: string
) {
  const user = await requireUserRecord();

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("cohort_members")
    .select("*")
    .eq("cohort_id", cohortId)
    .eq("user_id", user.id)
    .is("left_at", null)
    .single();

  if (error || !data) {
    redirect("/dashboard");
  }

  return data;
}

/**
 * Ensures the current user is a mentor
 * in the specified cohort.
 *
 * Example:
 * await requireCohortMentor(cohortId);
 */
export async function requireCohortMentor(
  cohortId: string
) {
  const membership =
    await requireCohortMember(
      cohortId
    );

  if (
    membership.cohort_role !==
    "mentor"
  ) {
    redirect("/dashboard");
  }

  return membership;
}

/**
 * Ensures the current user belongs
 * to the specified pod.
 *
 * Example:
 * await requirePodMember(podId);
 */
export async function requirePodMember(
  podId: string
) {
  const user = await requireUserRecord();

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("pod_members")
    .select("*")
    .eq("pod_id", podId)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    redirect("/dashboard");
  }

  return data;
}