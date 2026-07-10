"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSessionStore } from "@/store/session-store";

// Routes that must never be redirect-guarded, or you get an infinite loop
// (e.g. /pending-approval redirecting to itself).
const PUBLIC_PATHS = ["/login", "/pending-approval", "/not-approved"];

export function ApprovalGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Select fields individually — selecting a fresh object from zustand on
  // every render causes an infinite re-render loop without a shallow
  // comparator, so avoid `useSessionStore((s) => ({ ... }))` here.
  const user = useSessionStore((s) => s.user);
  const approvalStatus = useSessionStore((s) => s.approvalStatus);
  const loading = useSessionStore((s) => s.loading);

  useEffect(() => {
    if (loading) return;
    if (PUBLIC_PATHS.includes(pathname)) return;

    if (!user) {
      router.replace("/login");
      return;
    }
    if (approvalStatus === "pending") {
      router.replace("/pending-approval");
      return;
    }
    if (approvalStatus === "rejected") {
      router.replace("/not-approved");
      return;
    }
  }, [loading, user, approvalStatus, pathname, router]);

  // SessionProvider already renders a spinner while loading — don't
  // double-render one here.
  if (loading) return null;

  // Briefly render nothing rather than flashing protected content while
  // the redirect effect above fires.
  const blocked =
    !PUBLIC_PATHS.includes(pathname) && (!user || approvalStatus !== "approved");
  if (blocked) return null;

  return <>{children}</>;
}