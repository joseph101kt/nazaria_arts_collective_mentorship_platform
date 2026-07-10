// components/providers/approval-gate.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSessionStore } from "@/store/session-store";

// Routes that must never be redirect-guarded, or you get an infinite loop
// (e.g. /pending-approval redirecting to itself). NOTE: login lives at
// /auth/login, not /login — this was silently wrong before and caused a
// 404 on every failed-auth redirect.
const PUBLIC_PATHS = ["/auth/login", "/auth/signup", "/pending-approval", "/not-approved"];

export function ApprovalGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Select fields individually — selecting a fresh object from zustand on
  // every render causes an infinite re-render loop without a shallow
  // comparator, so avoid `useSessionStore((s) => ({ ... }))` here.
  const user = useSessionStore((s) => s.user);
  const approvalStatus = useSessionStore((s) => s.approvalStatus);
  const loading = useSessionStore((s) => s.loading);

  const isPublic = PUBLIC_PATHS.includes(pathname);
  const isOnboarding = pathname.startsWith("/onboarding");

  useEffect(() => {
    if (loading) return;
    if (isPublic) return;

    if (!user) {
      router.replace("/auth/login");
      return;
    }

    // Treat onboarding like public, but it needs a user.
    // Skip the approval status checks so mentors aren't booted mid-onboarding.
    if (isOnboarding) return;

    if (approvalStatus === "pending") {
      router.replace("/pending-approval");
      return;
    }
    if (approvalStatus === "rejected") {
      router.replace("/not-approved");
      return;
    }
  }, [loading, user, approvalStatus, pathname, router, isPublic, isOnboarding]);

  // SessionProvider already renders a spinner while loading — don't
  // double-render one here.
  if (loading) return null;

  // Briefly render nothing rather than flashing protected content while
  // the redirect effect above fires.
  const blocked =
    !isPublic && (!user || (!isOnboarding && approvalStatus !== "approved"));

  if (blocked) return null;

  return <>{children}</>;
}