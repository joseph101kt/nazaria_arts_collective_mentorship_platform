// lib/auth/redirects.ts

import { UserRole } from "./roles";

export function getDashboardRoute(
  role: UserRole,
  cohortSlug?: string
): string {
  switch (role) {
    case UserRole.PM:
      return "/admin/pulse";

    case UserRole.ASSOCIATE:
      return "/admin/escalations";

    case UserRole.MENTOR:
      return `/cohorts/${cohortSlug}`;

    case UserRole.MENTEE:
      return `/cohorts/${cohortSlug}`;

    default:
      return "/login";
  }
}