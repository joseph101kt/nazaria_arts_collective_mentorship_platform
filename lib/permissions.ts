// lib/permissions.ts
import type { UserRole } from "@/lib/types";

export type PermissionLevel = "mentee" | "mentor" | "staff";

/**
 * Collapses the 4 DB roles into 3 permission tiers. PM and Associate get
 * identical access everywhere in the app — this is the single place that
 * fact is encoded. Every hook/component branches on this, never on raw
 * `role`, except where the UI needs the literal label (RoleBadge) or
 * messaging hierarchy needs to distinguish PM from Associate (see
 * canMessage below).
 */
export function permissionLevel(role: UserRole): PermissionLevel {
  return role === "pm" || role === "associate" ? "staff" : role;
}

export interface SessionUser {
  id: string;
  role: UserRole;
}

// ─── Assignments ────────────────────────────────────────────────────────────

export interface ReviewableAssignment {
  /** The mentor_id resolved from the mentee's active mentorship, or null
   * if unassigned/unknown. Pass this in already-joined from the query —
   * permission functions never fetch data themselves. */
  mentorId: string | null;
}

export function canReviewAssignment(
  user: SessionUser,
  assignment: ReviewableAssignment
): boolean {
  const level = permissionLevel(user.role);
  if (level === "staff") return true;
  if (level === "mentor") return assignment.mentorId === user.id;
  return false;
}

export function canDispatchAssignment(role: UserRole): boolean {
  return permissionLevel(role) !== "mentee";
}

// ─── External courses ───────────────────────────────────────────────────────

export interface CourseContext {
  menteeId: string;
  /** The mentee's current active mentor, resolved via `mentorships`. */
  activeMentorId?: string | null;
}

export function canViewCourse(user: SessionUser, course: CourseContext): boolean {
  const level = permissionLevel(user.role);
  if (level === "staff") return true;
  if (user.id === course.menteeId) return true;
  if (level === "mentor") return course.activeMentorId === user.id;
  return false;
}

export function canPostCourseUpdate(user: SessionUser, course: CourseContext): boolean {
  // Owner check, not a role check — one mentee can't post to another
  // mentee's course even though both share the "mentee" role.
  return user.id === course.menteeId;
}

// ─── Meetings ───────────────────────────────────────────────────────────────

export type MeetingTarget = "own_mentees" | "any";

export function canCreateMeeting(role: UserRole, target: MeetingTarget): boolean {
  const level = permissionLevel(role);
  if (level === "mentee") return false;
  if (level === "mentor") return target === "own_mentees";
  return true; // staff can schedule for any mentor/pod/cohort
}

// ─── Messaging ──────────────────────────────────────────────────────────────

const ROLE_RANK: Record<UserRole, number> = {
  pm: 3,
  associate: 2,
  mentor: 1,
  mentee: 0,
};

/**
 * TODO: confirm hierarchy-only messaging with the client.
 *
 * The original plan states new conversations go strictly "one level down"
 * (PM→Associate, Associate→Mentor, Mentor→Mentee). Implemented here as
 * *symmetric adjacency* instead (either party can be the one who starts
 * it) — a strict one-directional reading would mean a mentee could never
 * initiate a conversation with their own mentor, which seems unintended.
 * Revisit once confirmed; this is the only permission function in this
 * file built on an assumption rather than a stated rule.
 */
export function canMessage(fromRole: UserRole, toRole: UserRole): boolean {
  return Math.abs(ROLE_RANK[fromRole] - ROLE_RANK[toRole]) === 1;
}