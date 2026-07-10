// lib/types.ts

/**
 * Central home for enum types and lightweight row shapes that get passed
 * around between hooks/components, independent of the raw generated
 * `database.types.ts`. Keep enum string unions here in sync with the
 * actual Postgres enum values in Supabase.
 *
 * Enums marked "CONFIRM" were inferred from context/defaults in the
 * schema dump, not from an explicit list of allowed values — check them
 * against `select enum_range(null::enum_name)` in Supabase before
 * relying on exhaustive switches over them.
 */

// ---------------------------------------------------------------------------
// Users / auth / approval
// ---------------------------------------------------------------------------

/** users.role — nullable until onboarding sets it. */
export type UserRole = "mentee" | "mentor" | "pm" | "associate";

/** users.approval_status — default 'approved'; only mentors go through 'pending'. */
export type ApprovalStatus = "pending" | "approved" | "rejected";

// ---------------------------------------------------------------------------
// Cohorts / pods
// ---------------------------------------------------------------------------

/** cohorts.status — default 'upcoming'. CONFIRM exact values. */
export type CohortStatus = "upcoming" | "active" | "completed";

/** cohort_members.cohort_role — role a user holds within that cohort. CONFIRM. */
export type CohortRole = "mentee" | "mentor" | "staff";

// ---------------------------------------------------------------------------
// Mentorships
// ---------------------------------------------------------------------------

/** mentorships.status — default 'active'. CONFIRM exact values. */
export type MentorshipStatus = "active" | "paused" | "ended";

// ---------------------------------------------------------------------------
// Assignments
// ---------------------------------------------------------------------------

/** assignments.category — default 'other'. CONFIRM exact values. */
export type AssignmentCategory =
  | "video"
  | "writing"
  | "research"
  | "technical"
  | "other";

/**
 * assignment_dispatches.scope — who a dispatch fans out to.
 * Confirmed by architecture doc (AssignmentDispatchForm: single mentee / pod / cohort).
 */
export type DispatchScope = "mentee" | "pod" | "cohort";

// ---------------------------------------------------------------------------
// Check-ins / escalations
// ---------------------------------------------------------------------------

/** check_ins.emotional_tone. CONFIRM exact values against the TONE_COLOR map. */
export type EmotionalTone = "positive" | "neutral" | "negative" | "concerning";

/**
 * check_ins.escalation_status — confirmed by EscalationDesk's filter tabs
 * (all / unreviewed / reviewed / actioned).
 */
export type EscalationStatus = "unreviewed" | "reviewed" | "actioned";

// ---------------------------------------------------------------------------
// Files
// ---------------------------------------------------------------------------

/** files.file_type — default 'file'. CONFIRM exact values. */
export type FileType = "file" | "link";

// ---------------------------------------------------------------------------
// Meetings
// ---------------------------------------------------------------------------

/** meetings.status — default 'scheduled'. CONFIRM exact values. */
export type MeetingStatus = "scheduled" | "completed" | "cancelled";

/** meeting_series.recurrence. CONFIRM exact values. */
export type MeetingRecurrence = "none" | "weekly" | "biweekly";

// ---------------------------------------------------------------------------
// Courses
// ---------------------------------------------------------------------------

/**
 * external_courses.status — default 'in_progress'.
 * Confirmed exact values from the original phase plan (0006_external_courses.sql).
 */
export type CourseStatus = "in_progress" | "completed" | "dropped";

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

/**
 * notifications.type — confirmed set, matches lib/notif-actions-config.ts
 * and the Phase 14 notification-generation plan.
 */
export type NotificationType =
  | "meeting"
  | "assignment_due"
  | "assignment_submitted"
  | "check_in_escalation"
  | "check_in_reminder"
  | "course_update"
  | "message";

/** user_notifications.status — default 'sent'. CONFIRM exact values. */
export type NotificationDeliveryStatus = "sent" | "delivered" | "failed";

// ---------------------------------------------------------------------------
// Resources
// ---------------------------------------------------------------------------

/** resources.type — CONFIRM exact values, no default given in schema. */
export type ResourceType = "doc" | "video" | "link" | "template";

/** resources.visible_to — default 'mentor'. CONFIRM exact values. */
export type ResourceVisibility = "mentee" | "mentor" | "staff" | "all";

// ---------------------------------------------------------------------------
// Lightweight row shapes
// ---------------------------------------------------------------------------
// These are intentionally NOT full 1:1 mirrors of database.types.ts — they
// capture only the fields components/hooks commonly need. Prefer importing
// generated types from lib/supabase/database.types.ts for anything that
// needs to be schema-exhaustive (inserts/updates); use these for read-side
// props and store shapes.

export interface UserRow {
  id: string;
  email: string;
  full_name: string;
  role: UserRole | null;
  approval_status: ApprovalStatus;
  avatar_url: string | null;
  created_at: string;
  deleted_at: string | null;
}

export interface ProfileRow {
  id: string;
  user_id: string;
  bio: string | null;
  background_notes: string | null;
  goals: string[] | null;
  interests: string[] | null;
  school_or_org: string | null;
  created_at: string;
  updated_at: string;
}

export interface CohortRow {
  id: string;
  name: string;
  program_year: number | null;
  start_date: string | null;
  end_date: string | null;
  status: CohortStatus;
  description: string | null;
  created_at: string;
  deleted_at: string | null;
}

export interface PodRow {
  id: string;
  cohort_id: string;
  name: string;
  skill_level: string | null;
  description: string | null;
  created_at: string;
  deleted_at: string | null;
}

export interface MentorshipRow {
  id: string;
  mentor_id: string;
  mentee_id: string;
  cohort_id: string | null;
  status: MentorshipStatus;
  started_at: string;
  ended_at: string | null;
}

export interface AssignmentRow {
  id: string;
  title: string;
  description: string;
  instructions: string | null;
  category: AssignmentCategory;
  week_number: number | null;
  is_active: boolean;
  created_by: string;
  created_at: string;
  deleted_at: string | null;
  start_date: string | null;
  end_date: string | null;
}

export interface MenteeAssignmentRow {
  id: string;
  dispatch_id: string | null;
  mentee_id: string;
  assignment_id: string;
  pushed_by: string;
  due_at: string;
  pushed_at: string;
  is_submitted: boolean;
  submitted_at: string | null;
  is_checked: boolean;
  checked_at: string | null;
  checked_by: string | null;
  notification_sent_at: string | null;
}

export interface CheckInRow {
  id: string;
  mentorship_id: string;
  emotional_tone: EmotionalTone;
  goals_discussed: string | null;
  raw_notes: string;
  ai_structured: Record<string, unknown> | null;
  escalation_flag: boolean;
  escalation_status: EscalationStatus | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  actioned_at: string | null;
  actioned_by: string | null;
  associate_note: string | null;
  created_at: string;
  deleted_at: string | null;
}

export interface MeetingRow {
  id: string;
  series_id: string | null;
  created_by: string;
  title: string;
  description: string | null;
  google_event_id: string | null;
  meet_link: string | null;
  starts_at: string;
  ends_at: string;
  status: MeetingStatus;
  notes: string | null;
  created_at: string;
  deleted_at: string | null;
}

export interface ConversationRow {
  id: string;
  subject: string | null;
  created_by: string;
  created_at: string;
  last_message_at: string | null;
}

export interface MessageRow {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
}

export interface NotificationRow {
  id: string;
  created_by: string | null;
  type: NotificationType;
  title: string;
  body: string | null;
  mentee_assignment_id: string | null;
  check_in_id: string | null;
  message_id: string | null;
  meeting_id: string | null;
  scheduled_for: string | null;
  created_at: string;
  deleted_at: string | null;
}

export interface ExternalCourseRow {
  id: string;
  mentee_id: string;
  title: string;
  provider: string | null;
  url: string | null;
  description: string | null;
  status: CourseStatus;
  started_at: string | null;
  target_end_date: string | null;
  created_at: string;
  deleted_at: string | null;
}

export interface CourseUpdateRow {
  id: string;
  course_id: string;
  posted_by: string;
  progress_note: string;
  progress_percent: number | null;
  hours_spent: number | null;
  file_id: string | null;
  created_at: string;
  deleted_at: string | null;
}

export interface FileRow {
  id: string;
  title: string | null;
  description: string | null;
  file_type: FileType;
  url: string | null;
  drive_file_id: string | null;
  original_filename: string | null;
  file_size_bytes: number | null;
  mime_type: string | null;
  created_by: string;
  created_at: string;
  deleted_at: string | null;
}