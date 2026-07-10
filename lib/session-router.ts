import type { ApprovalStatus, UserRole } from "@/lib/types";

export interface RoutingUserRow {
  role: UserRole | null;
  approval_status: ApprovalStatus | null;
  /** True once a row exists in `profiles` for this user. */
  hasProfile?: boolean;
}

/**
 * Single source of truth for "where does this user land next."
 * Used right after the signup callback and right after login, so the
 * two paths can never drift apart.
 *
 * Order matters: role -> approval -> profile -> dashboard.
 */
export function routeForSession(userRow: RoutingUserRow | null): string {
  if (!userRow || !userRow.role) {
    return "/auth/onboarding";
  }

  if (userRow.role === "mentor" && userRow.approval_status === "pending") {
    return userRow.hasProfile ? "/pending-approval" : "/auth/onboarding/profile";
  }

  if (userRow.role === "mentor" && userRow.approval_status === "rejected") {
    return "/not-approved";
  }

  if (!userRow.hasProfile) {
    return "/onboarding/profile";
  }

  return "/dashboard";
}