// lib/auth/route-permissions.ts

import { UserRole } from "./roles";

export function canAccessAdmin(role: UserRole): boolean {
  return (
    role === UserRole.PM ||
    role === UserRole.ASSOCIATE
  );
}