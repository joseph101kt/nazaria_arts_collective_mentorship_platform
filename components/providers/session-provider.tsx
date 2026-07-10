// components/providers/session-provider.tsx
"use client";

import { useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useSessionStore } from "@/store/session-store";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const setSession = useSessionStore((s) => s.setSession);
  const clear = useSessionStore((s) => s.clear);
  const loading = useSessionStore((s) => s.loading);

  useEffect(() => {
    let active = true;

    async function hydrate(authUserId: string | null) {
      if (!authUserId) {
        if (active) clear();
        return;
      }

      const [{ data: userRow, error: userErr }, { data: profileRow }] = await Promise.all([
        supabase.from("users").select("*").eq("id", authUserId).single(),
        supabase.from("profiles").select("*").eq("user_id", authUserId).maybeSingle(),
      ]);

      if (!active) return;

      if (userErr || !userRow) {
        // Auth session exists but no matching `users` row — e.g. the
        // handle_new_user trigger on auth.users is missing/broken, or
        // hasn't landed yet. Log loudly: this used to fail silently and
        // looked identical to "logged out" from the UI's perspective,
        // which made the role-selection bug very hard to track down.
        console.error(
          "[SessionProvider] auth user exists but public.users row not found:",
          authUserId,
          userErr?.message
        );
        clear();
        return;
      }

      setSession({
        user: {
          id: userRow.id,
          email: userRow.email,
          full_name: userRow.full_name,
          role: userRow.role,
          avatar_url: userRow.avatar_url,
        },
        approvalStatus: userRow.approval_status,
        profile: profileRow ?? null,
      });
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      hydrate(session?.user?.id ?? null);
    });

    // Keeps the store in sync across tabs and on sign-in/sign-out/refresh —
    // this is what makes logging out in one tab reflect in another.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      hydrate(session?.user?.id ?? null);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase, setSession, clear]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"
          role="status"
          aria-label="Loading"
        />
      </div>
    );
  }

  return <>{children}</>;
}