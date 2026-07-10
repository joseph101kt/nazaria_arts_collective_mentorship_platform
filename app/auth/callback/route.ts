// app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { routeForSession } from "@/lib/api/session-routing";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/login?error=missing_code`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    console.error("[auth/callback] exchange failed:", error?.message, error?.status);
    return NextResponse.redirect(
      `${origin}/auth/login?error=auth_callback_failed&reason=${encodeURIComponent(
        error?.message ?? "no_user"
      )}`
    );
  }

  const [{ data: userRow, error: userRowError }, { data: profileRow }] = await Promise.all([
    supabase.from("users").select("role, approval_status").eq("id", data.user.id).single(),
    supabase.from("profiles").select("id").eq("user_id", data.user.id).maybeSingle(),
  ]);

  if (userRowError) {
    // Auth succeeded but no matching public.users row exists yet — almost
    // always means the handle_new_user trigger on auth.users is missing,
    // broken, or hasn't landed yet. Log loudly rather than silently
    // routing to /onboarding as if this were the expected "new user" case.
    console.error(
      "[auth/callback] auth succeeded but no public.users row found for",
      data.user.id,
      userRowError.message
    );
  }

  const destination = routeForSession(
    userRow ? { ...userRow, hasProfile: !!profileRow } : null,
  );

  return NextResponse.redirect(`${origin}${destination}`);
}