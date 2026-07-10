import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { routeForSession } from "@/lib/api/session-routing";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
  }

  const [{ data: userRow }, { data: profileRow }] = await Promise.all([
    supabase.from("users").select("role, approval_status").eq("id", data.user.id).single(),
    supabase.from("profiles").select("id").eq("user_id", data.user.id).maybeSingle(),
  ]);

  const destination = routeForSession(
    userRow ? { ...userRow, hasProfile: !!profileRow } : null,
  );

  return NextResponse.redirect(`${origin}${destination}`);
}