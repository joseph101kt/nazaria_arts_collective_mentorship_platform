import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/database.types";

export default async function SessionDebugPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // no-op: Server Components can't set cookies, middleware already did
        },
      },
    }
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // Check your terminal (not the browser console) — this runs server-side.
  console.log("SESSION DEBUG:", { user, error });

  let userRow = null;
  if (user) {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();
    userRow = data;
  }

  return (
    <pre style={{ padding: 24, fontSize: 12, whiteSpace: "pre-wrap" }}>
      {JSON.stringify({ authUser: user, error, usersRow: userRow }, null, 2)}
    </pre>
  );
}