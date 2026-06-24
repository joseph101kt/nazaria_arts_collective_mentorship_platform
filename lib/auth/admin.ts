// lib/auth/admin.ts

import { supabaseAdmin } from "@/lib/supabase/admin";

import { UserRole } from "./roles";

export async function assignUserRole(
  userId: string,
  role: UserRole
): Promise<void> {
  const { error } = await supabaseAdmin
    .from("users")
    .update({
      role,
    })
    .eq("id", userId);

  if (error) {
    throw error;
  }
}

export async function promoteToAssociate(
  userId: string
): Promise<void> {
  await assignUserRole(
    userId,
    UserRole.ASSOCIATE
  );
}

export async function promoteToPM(
  userId: string
): Promise<void> {
  await assignUserRole(
    userId,
    UserRole.PM
  );
}

export async function promoteToMentor(
  userId: string
): Promise<void> {
  await assignUserRole(
    userId,
    UserRole.MENTOR
  );
}

export async function assignUserToCohort(
  userId: string,
  cohortId: string,
  cohortRole: "mentor" | "mentee"
): Promise<void> {
  const { error } = await supabaseAdmin
    .from("cohort_members")
    .upsert({
      user_id: userId,
      cohort_id: cohortId,
      cohort_role: cohortRole,
      left_at: null,
    });

  if (error) {
    throw error;
  }
}

export async function removeUserFromCohort(
  userId: string,
  cohortId: string
): Promise<void> {
  const { error } = await supabaseAdmin
    .from("cohort_members")
    .update({
      left_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .eq("cohort_id", cohortId)
    .is("left_at", null);

  if (error) {
    throw error;
  }
}

export async function deactivateUser(
  userId: string
): Promise<void> {
  const { error } = await supabaseAdmin
    .from("users")
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    throw error;
  }
}