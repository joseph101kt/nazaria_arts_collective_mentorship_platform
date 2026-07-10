import { createClient } from "@/lib/supabase/client";
import type { UserRole } from "@/lib/types";

/**
 * All functions here run in the browser (client component context).
 * Server-side session exchange lives in app/auth/callback/route.ts.
 */

export interface SignUpInput {
  fullName: string;
  email: string;
  password: string;
}

export async function signUp({ fullName, email, password }: SignUpInput) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Supabase requires this to be an absolute, allow-listed URL
      // (Auth → URL Configuration → Redirect URLs) in production.
      emailRedirectTo: `${window.location.origin}/auth/callback`,
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) throw error;
  return data;
}

export interface SignInInput {
  email: string;
  password: string;
}

export async function signIn({ email, password }: SignInInput) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

/**
 * Called from the onboarding role-choice step.
 * - mentee: role set, approval_status left at its default ('approved')
 * - mentor: role set, approval_status explicitly flipped to 'pending'
 */
export async function setUserRole(userId: string, role: UserRole) {
  const supabase = createClient();

  const { error } = await supabase
    .from("users")
    .update({
      role,
      ...(role === "mentor" ? { approval_status: "pending" as const } : {}),
    })
    .eq("id", userId);

  if (error) throw error;
}

export interface ProfileInput {
  userId: string;
  bio: string;
  backgroundNotes: string;
  goals: string[];
  interests: string[];
  schoolOrOrg: string;
}

export async function upsertProfile({
  userId,
  bio,
  backgroundNotes,
  goals,
  interests,
  schoolOrOrg,
}: ProfileInput) {
  const supabase = createClient();

  const { error } = await supabase.from("profiles").upsert(
    {
      user_id: userId,
      bio,
      background_notes: backgroundNotes,
      goals,
      interests,
      school_or_org: schoolOrOrg,
    },
    { onConflict: "user_id" },
  );

  if (error) throw error;
}