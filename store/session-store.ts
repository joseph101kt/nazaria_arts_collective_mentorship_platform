// store/session-store.ts
import { create } from "zustand";
import type { ApprovalStatus, UserRole } from "@/lib/types";
import { permissionLevel, type PermissionLevel } from "@/lib/permissions";

export interface SessionUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url: string | null;
}

export interface SessionProfile {
  id: string;
  user_id: string;
  bio: string | null;
  background_notes: string | null;
  goals: string[] | null;
  interests: string[] | null;
  school_or_org: string | null;
}

interface SessionState {
  user: SessionUser | null;
  role: UserRole | null;
  permissionLevel: PermissionLevel | null;
  approvalStatus: ApprovalStatus | null;
  profile: SessionProfile | null;
  /** True until the first hydration attempt (success or failure) completes. */
  loading: boolean;
  setSession: (payload: {
    user: SessionUser;
    approvalStatus: ApprovalStatus;
    profile: SessionProfile | null;
  }) => void;
  clear: () => void;
}

// NOTE: this store holds ONLY session identity — who is logged in, their
// role, their approval status. It is not a place for server data (that's
// TanStack Query's job) and not a place for UI flags like "is chat open"
// (that's ui-store.ts's job). Keep it that way.
export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  role: null,
  permissionLevel: null,
  approvalStatus: null,
  profile: null,
  loading: true,

  setSession: ({ user, approvalStatus, profile }) =>
    set({
      user,
      role: user.role,
      permissionLevel: permissionLevel(user.role),
      approvalStatus,
      profile,
      loading: false,
    }),

  clear: () =>
    set({
      user: null,
      role: null,
      permissionLevel: null,
      approvalStatus: null,
      profile: null,
      loading: false,
    }),
}));