"use client";
/**
 * MenteeDashboard.jsx
 *
 * Demo version — all data is hardcoded inline to match the real schema.
 * When the DB is ready, replace each data block with the corresponding
 * Supabase query shown in the comment above it.
 *
 * Schema tables used:
 *   users, profiles, cohorts, cohort_members, pods, pod_members,
 *   meetings, meeting_participants, mentee_assignments, assignments,
 *   check_ins, mentorships, resources, user_notifications, notifications
 *
 * NOT included (by design):
 *   check_ins.raw_notes, check_ins.ai_structured, check_ins.escalation_*,
 *   check_ins.associate_note, conversations/messages (chat excluded)
 */

import { useState } from "react";

// ---------------------------------------------------------------------------
// Demo data — mirrors real schema shapes exactly
// ---------------------------------------------------------------------------

// users row (current mentee)
// SELECT id, full_name, email, role, avatar_url FROM users WHERE id = auth.uid()
const CURRENT_USER = {
  id: "u-001",
  full_name: "Arjun Mehta",
  email: "arjun.mehta@example.com",
  role: "mentee",
  avatar_url: null,
};

// profiles row
// SELECT bio, goals, interests, school_or_org FROM profiles WHERE user_id = auth.uid()
const PROFILE = {
  bio: "Computer science undergrad interested in backend systems and product development.",
  goals: ["Land a software engineering internship", "Improve system design skills"],
  interests: ["Backend development", "Open source", "Photography"],
  school_or_org: "BITS Pilani",
};

// cohort_members + cohorts join
// SELECT cm.cohort_role, cm.joined_at, c.name, c.start_date, c.end_date, c.status
// FROM cohort_members cm JOIN cohorts c ON c.id = cm.cohort_id
// WHERE cm.user_id = auth.uid() AND cm.left_at IS NULL
const COHORT = {
  name: "Cohort 4",
  start_date: "2024-05-01",
  end_date: "2024-07-31",
  status: "active",
  cohort_role: "mentee",
  week_number: 7,
  total_weeks: 12,
};

// pod_members + pods join + other pod members with their users row
// SELECT p.id, p.name, p.skill_level,
//        pm2.user_id, u.full_name, u.avatar_url,
//        cm.cohort_role
// FROM pod_members pm
// JOIN pods p ON p.id = pm.pod_id
// JOIN pod_members pm2 ON pm2.pod_id = p.id
// JOIN users u ON u.id = pm2.user_id
// JOIN cohort_members cm ON cm.user_id = u.id AND cm.cohort_id = p.cohort_id
// WHERE pm.user_id = auth.uid()
const POD = {
  id: "pod-001",
  name: "Pod B",
  skill_level: "intermediate",
  members: [
    { user_id: "u-010", full_name: "Priya Sharma",  cohort_role: "mentor" },
    { user_id: "u-001", full_name: "Arjun Mehta",   cohort_role: "mentee", is_self: true },
    { user_id: "u-002", full_name: "Riya Kapoor",   cohort_role: "mentee" },
    { user_id: "u-003", full_name: "Sahil Nair",    cohort_role: "mentee" },
    { user_id: "u-004", full_name: "Dev Joshi",     cohort_role: "mentee" },
  ],
};

// meetings + meeting_participants join — upcoming only
// SELECT m.id, m.title, m.description, m.meet_link, m.starts_at, m.ends_at, m.status, m.notes
// FROM meetings m
// JOIN meeting_participants mp ON mp.meeting_id = m.id
// WHERE mp.user_id = auth.uid()
//   AND m.deleted_at IS NULL
//   AND m.starts_at > now()
// ORDER BY m.starts_at ASC
const UPCOMING_MEETINGS = [
  {
    id: "m-001",
    title: "1:1 with Priya Sharma",
    description: "Weekly mentorship check-in",
    meet_link: "https://meet.google.com/abc-def-ghi",
    starts_at: "2024-06-27T09:30:00Z",
    ends_at:   "2024-06-27T10:15:00Z",
    status: "scheduled",
  },
  {
    id: "m-002",
    title: "Pod B group session",
    description: null,
    meet_link: "https://zoom.us/j/123456",
    starts_at: "2024-06-27T11:30:00Z",
    ends_at:   "2024-06-27T12:30:00Z",
    status: "scheduled",
  },
  {
    id: "m-003",
    title: "Career planning workshop",
    description: "Cohort-wide workshop on resume and interview prep",
    meet_link: null,
    starts_at: "2024-07-01T10:30:00Z",
    ends_at:   "2024-07-01T12:00:00Z",
    status: "scheduled",
  },
];

// meetings — past (same query, starts_at < now(), status = 'completed' | 'cancelled')
const PAST_MEETINGS = [
  {
    id: "m-010",
    title: "1:1 with Priya Sharma",
    starts_at: "2024-06-20T09:30:00Z",
    ends_at:   "2024-06-20T10:15:00Z",
    status: "completed",
    notes: "Discussed data analysis module progress and system design study plan.",
  },
  {
    id: "m-011",
    title: "Pod B group session",
    starts_at: "2024-06-13T11:30:00Z",
    ends_at:   "2024-06-13T12:30:00Z",
    status: "completed",
    notes: null,
  },
  {
    id: "m-012",
    title: "Interview skills workshop",
    starts_at: "2024-06-10T10:00:00Z",
    ends_at:   "2024-06-10T11:30:00Z",
    status: "cancelled",
    notes: null,
  },
];

// mentee_assignments + assignments join
// SELECT ma.id, ma.due_at, ma.pushed_at, ma.is_submitted, ma.submitted_at,
//        ma.is_checked, ma.checked_at,
//        a.title, a.description, a.instructions, a.category, a.week_number
// FROM mentee_assignments ma
// JOIN assignments a ON a.id = ma.assignment_id
// WHERE ma.mentee_id = auth.uid()
//   AND a.deleted_at IS NULL
//   AND ma.due_at > now() - interval '30 days'
// ORDER BY ma.due_at ASC
const ASSIGNMENTS = [
  {
    id: "ma-001",
    due_at: "2024-07-10T23:59:00Z",
    pushed_at: "2024-06-10T10:00:00Z",
    is_submitted: false,
    submitted_at: null,
    is_checked: false,
    checked_at: null,
    assignment: {
      title: "System design — URL shortener",
      description: "Design a scalable URL shortening service from scratch.",
      instructions: "Write a 1-page design doc covering: data model, API endpoints, scaling approach. Use the template linked below.",
      category: "research",
      week_number: 7,
    },
  },
  {
    id: "ma-002",
    due_at: "2024-07-01T23:59:00Z",
    pushed_at: "2024-06-17T10:00:00Z",
    is_submitted: false,
    submitted_at: null,
    is_checked: false,
    checked_at: null,
    assignment: {
      title: "Career reflection — 6-month goals",
      description: "Reflect on where you want to be in 6 months and what it will take to get there.",
      instructions: "Write 300-500 words. Be specific about milestones and who can help you.",
      category: "reflection",
      week_number: 7,
    },
  },
  {
    id: "ma-003",
    due_at: "2024-06-25T23:59:00Z",
    pushed_at: "2024-06-01T10:00:00Z",
    is_submitted: true,
    submitted_at: "2024-06-24T18:42:00Z",
    is_checked: true,
    checked_at: "2024-06-25T09:00:00Z",
    assignment: {
      title: "Data analysis — sales dataset",
      description: "Explore and summarise a provided sales dataset using Python or Excel.",
      instructions: null,
      category: "research",
      week_number: 5,
    },
  },
];

// check_ins — only fields safe to show mentee
// (raw_notes, ai_structured, escalation_* and associate_note are never fetched)
// SELECT ci.id, ci.emotional_tone, ci.goals_discussed, ci.created_at
// FROM check_ins ci
// JOIN mentorships m ON m.id = ci.mentorship_id
// WHERE m.mentee_id = auth.uid()
//   AND ci.deleted_at IS NULL
// ORDER BY ci.created_at DESC
// LIMIT 10
const CHECK_INS = [
  {
    id: "ci-001",
    emotional_tone: "great",
    goals_discussed: "Made solid progress on the data analysis module. Understood indexing properly after the group session.",
    created_at: "2024-06-24T10:00:00Z",
  },
  {
    id: "ci-002",
    emotional_tone: "okay",
    goals_discussed: "Busy week — less progress than hoped on the portfolio. System design practice slipping behind.",
    created_at: "2024-06-17T10:00:00Z",
  },
  {
    id: "ci-003",
    emotional_tone: "great",
    goals_discussed: "Completed the first data analysis project. 1:1 with Priya helped clarify career direction.",
    created_at: "2024-06-10T10:00:00Z",
  },
];

// resources where visible_to = 'mentee' OR visible_to = 'all'
// SELECT id, title, description, url, type, week_number, tags, created_at
// FROM resources
// WHERE is_active = true
//   AND visible_to IN ('mentee', 'all')
// ORDER BY created_at DESC
const RESOURCES = [
  {
    id: "r-001",
    title: "System design primer — distributed systems",
    description: "Core concepts for designing distributed systems at scale.",
    url: "https://example.com/resource1",
    type: "guide",
    week_number: 7,
    tags: ["system design", "backend"],
    created_at: "2024-06-24T10:00:00Z",
  },
  {
    id: "r-002",
    title: "How to structure a technical interview answer",
    description: "A framework for answering system design and coding questions clearly.",
    url: "https://example.com/resource2",
    type: "video",
    week_number: 7,
    tags: ["interviews"],
    created_at: "2024-06-22T10:00:00Z",
  },
  {
    id: "r-003",
    title: "Resume writing for tech roles",
    description: "Template and guidance for crafting a strong tech resume.",
    url: "https://example.com/resource3",
    type: "template",
    week_number: 3,
    tags: ["career", "resume"],
    created_at: "2024-06-01T10:00:00Z",
  },
  {
    id: "r-004",
    title: "Big-O complexity cheat sheet",
    description: "Quick reference for time and space complexity of common algorithms.",
    url: "https://example.com/resource4",
    type: "toolkit",
    week_number: 2,
    tags: ["algorithms", "technical"],
    created_at: "2024-05-20T10:00:00Z",
  },
  {
    id: "r-005",
    title: "Program handbook — Cohort 4",
    description: "Rules, expectations, and schedule for Cohort 4.",
    url: "https://example.com/resource5",
    type: "handbook",
    week_number: null,
    tags: ["program"],
    created_at: "2024-05-01T10:00:00Z",
  },
];

// user_notifications + notifications join
// SELECT n.id, n.type, n.title, n.body, n.created_at,
//        un.read_at, un.status
// FROM user_notifications un
// JOIN notifications n ON n.id = un.notification_id
// WHERE un.user_id = auth.uid()
//   AND un.deleted_at IS NULL
//   AND n.deleted_at IS NULL
// ORDER BY n.created_at DESC
// LIMIT 20
const NOTIFICATIONS = [
  {
    id: "n-001",
    type: "meeting",
    title: "Session reminder",
    body: "Your 1:1 with Priya Sharma is tomorrow at 3:00 PM.",
    created_at: "2024-06-26T08:00:00Z",
    read_at: null,
  },
  {
    id: "n-002",
    type: "assignment_due",
    title: "Assignment due soon",
    body: "\"Career reflection — 6-month goals\" is due in 5 days.",
    created_at: "2024-06-24T08:00:00Z",
    read_at: null,
  },
  {
    id: "n-003",
    type: "reminder",
    title: "New resource available",
    body: "A new guide has been shared for week 7: System design primer.",
    created_at: "2024-06-24T07:00:00Z",
    read_at: null,
  },
  {
    id: "n-004",
    type: "assignment_submitted",
    title: "Assignment reviewed",
    body: "Priya has reviewed your \"Data analysis — sales dataset\" submission.",
    created_at: "2024-06-25T09:00:00Z",
    read_at: "2024-06-25T11:00:00Z",
  },
  {
    id: "n-005",
    type: "meeting",
    title: "Meeting completed",
    body: "Notes from your Jun 20 session with Priya are now available.",
    created_at: "2024-06-20T11:00:00Z",
    read_at: "2024-06-21T09:00:00Z",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function initials(name) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function daysUntil(iso) {
  const diff = new Date(iso) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

const TONE_COLOR = {
  great:     { bg: "#d1fae5", text: "#065f46", dot: "#10b981" },
  good:      { bg: "#dbeafe", text: "#1e40af", dot: "#3b82f6" },
  okay:      { bg: "#fef9c3", text: "#854d0e", dot: "#f59e0b" },
  low:       { bg: "#fee2e2", text: "#991b1b", dot: "#ef4444" },
  concerned: { bg: "#fce7f3", text: "#9d174d", dot: "#ec4899" },
};

const CATEGORY_LABEL = {
  reflection: "Reflection",
  research:   "Research",
  creative:   "Creative",
  career:     "Career",
  other:      "Other",
};

const RESOURCE_ICON = {
  handbook: "📋",
  toolkit:  "🧰",
  template: "📄",
  video:    "🎬",
  guide:    "📖",
};

const NOTIF_ICON = {
  meeting:              "📅",
  assignment_due:       "⏰",
  assignment_submitted: "✅",
  check_in_escalation:  "🚨",
  reminder:             "🔔",
  achievement:          "🏆",
  message:              "✉️",
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function Avatar({ name, size = 32, colorIndex = 0 }) {
  const palettes = [
    { bg: "#ede9fe", text: "#5b21b6" },
    { bg: "#d1fae5", text: "#065f46" },
    { bg: "#fef3c7", text: "#92400e" },
    { bg: "#dbeafe", text: "#1e40af" },
    { bg: "#fce7f3", text: "#9d174d" },
  ];
  const p = palettes[colorIndex % palettes.length];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: p.bg,
        color: p.text,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.38,
        fontWeight: 600,
        flexShrink: 0,
      }}
    >
      {initials(name)}
    </div>
  );
}

function Tag({ children, color = "gray" }) {
  const colors = {
    gray:   { bg: "#f3f4f6", text: "#374151" },
    green:  { bg: "#d1fae5", text: "#065f46" },
    blue:   { bg: "#dbeafe", text: "#1e40af" },
    amber:  { bg: "#fef3c7", text: "#92400e" },
    red:    { bg: "#fee2e2", text: "#991b1b" },
    purple: { bg: "#ede9fe", text: "#5b21b6" },
  };
  const c = colors[color] || colors.gray;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 8px",
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 600,
        background: c.bg,
        color: c.text,
      }}
    >
      {children}
    </span>
  );
}

function Card({ children, style }) {
  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 12,
        padding: "16px 18px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: "#9ca3af",
        textTransform: "uppercase",
        letterSpacing: "0.07em",
        marginBottom: 10,
      }}
    >
      {children}
    </div>
  );
}

function CardTitle({ children, action, onAction }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{children}</span>
      {action && (
        <button
          onClick={onAction}
          style={{ fontSize: 12, color: "#6366f1", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}
        >
          {action}
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page: Overview
// ---------------------------------------------------------------------------

function PageOverview({ setPage }) {
  const unsubmitted = ASSIGNMENTS.filter((a) => !a.is_submitted);
  const unread = NOTIFICATIONS.filter((n) => !n.read_at);

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: "#111827" }}>
          Good morning, {CURRENT_USER.full_name.split(" ")[0]}
        </div>
        <div style={{ fontSize: 13, color: "#6b7280", marginTop: 3 }}>
          {COHORT.name} · {POD.name} · Week {COHORT.week_number} of {COHORT.total_weeks}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Upcoming sessions", value: UPCOMING_MEETINGS.length },
          { label: "Pending assignments", value: unsubmitted.length, warn: unsubmitted.length > 0 },
          { label: "Unread notifications", value: unread.length },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "#f9fafb",
              borderRadius: 10,
              padding: "14px 16px",
              border: s.warn ? "1px solid #fde68a" : "1px solid #e5e7eb",
            }}
          >
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: s.warn ? "#92400e" : "#111827" }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Next session */}
        <Card>
          <CardTitle action="All sessions" onAction={() => setPage("sessions")}>
            Next session
          </CardTitle>
          {UPCOMING_MEETINGS[0] ? (
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                {UPCOMING_MEETINGS[0].title}
              </div>
              <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 12 }}>
                {fmtDate(UPCOMING_MEETINGS[0].starts_at)} · {fmtTime(UPCOMING_MEETINGS[0].starts_at)}
              </div>
              {UPCOMING_MEETINGS[0].meet_link && (
                <a
                  href={UPCOMING_MEETINGS[0].meet_link}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 14px",
                    borderRadius: 8,
                    background: "#6366f1",
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Join meeting
                </a>
              )}
            </div>
          ) : (
            <div style={{ fontSize: 13, color: "#9ca3af" }}>No upcoming sessions</div>
          )}
        </Card>

        {/* Pending assignments */}
        <Card>
          <CardTitle action="All assignments" onAction={() => setPage("assignments")}>
            Pending assignments
          </CardTitle>
          {unsubmitted.length === 0 ? (
            <div style={{ fontSize: 13, color: "#9ca3af" }}>All caught up!</div>
          ) : (
            unsubmitted.slice(0, 2).map((ma) => {
              const days = daysUntil(ma.due_at);
              return (
                <div
                  key={ma.id}
                  style={{ padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}
                >
                  <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 3 }}>
                    {ma.assignment.title}
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <Tag color={days <= 3 ? "red" : days <= 7 ? "amber" : "gray"}>
                      Due in {days}d
                    </Tag>
                    <Tag color="gray">{CATEGORY_LABEL[ma.assignment.category]}</Tag>
                  </div>
                </div>
              );
            })
          )}
        </Card>

        {/* Latest check-in */}
        <Card>
          <CardTitle action="All check-ins" onAction={() => setPage("checkins")}>
            Latest check-in
          </CardTitle>
          {CHECK_INS[0] ? (() => {
            const ci = CHECK_INS[0];
            const tone = TONE_COLOR[ci.emotional_tone];
            return (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: tone.dot,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 600, textTransform: "capitalize" }}>
                    {ci.emotional_tone}
                  </span>
                  <span style={{ fontSize: 12, color: "#9ca3af", marginLeft: "auto" }}>
                    {fmtDate(ci.created_at)}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
                  {ci.goals_discussed}
                </div>
              </div>
            );
          })() : (
            <div style={{ fontSize: 13, color: "#9ca3af" }}>No check-ins yet</div>
          )}
        </Card>

        {/* Pod */}
        <Card>
          <CardTitle action="View pod" onAction={() => setPage("pod")}>
            {POD.name}
          </CardTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {POD.members.map((m, i) => (
              <div key={m.user_id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar name={m.full_name} colorIndex={i} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>
                    {m.full_name}
                    {m.is_self && (
                      <span style={{ fontSize: 11, color: "#6366f1", marginLeft: 6 }}>you</span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: "#9ca3af", textTransform: "capitalize" }}>
                    {m.cohort_role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page: Sessions (meetings)
// ---------------------------------------------------------------------------

function PageSessions() {
  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: "#111827" }}>Sessions</div>

      <SectionTitle>Upcoming</SectionTitle>
      <Card style={{ marginBottom: 20 }}>
        {UPCOMING_MEETINGS.map((m, i) => (
          <div
            key={m.id}
            style={{
              padding: "12px 0",
              borderBottom: i < UPCOMING_MEETINGS.length - 1 ? "1px solid #f3f4f6" : "none",
              display: "flex",
              gap: 14,
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: m.status === "scheduled" ? "#6366f1" : "#9ca3af",
                marginTop: 5,
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{m.title}</div>
              {m.description && (
                <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>{m.description}</div>
              )}
              <div style={{ fontSize: 12, color: "#9ca3af" }}>
                {fmtDate(m.starts_at)} · {fmtTime(m.starts_at)} – {fmtTime(m.ends_at)}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
              <Tag color="blue">Scheduled</Tag>
              {m.meet_link && (
                <a
                  href={m.meet_link}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: 12,
                    color: "#6366f1",
                    fontWeight: 500,
                    textDecoration: "none",
                  }}
                >
                  Join →
                </a>
              )}
            </div>
          </div>
        ))}
      </Card>

      <SectionTitle>Past</SectionTitle>
      <Card>
        {PAST_MEETINGS.map((m, i) => (
          <div
            key={m.id}
            style={{
              padding: "12px 0",
              borderBottom: i < PAST_MEETINGS.length - 1 ? "1px solid #f3f4f6" : "none",
              display: "flex",
              gap: 14,
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: m.status === "completed" ? "#10b981" : "#9ca3af",
                marginTop: 5,
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{m.title}</div>
              <div style={{ fontSize: 12, color: "#9ca3af" }}>
                {fmtDate(m.starts_at)} · {fmtTime(m.starts_at)} – {fmtTime(m.ends_at)}
              </div>
              {m.notes && (
                <div
                  style={{
                    fontSize: 12,
                    color: "#374151",
                    marginTop: 6,
                    padding: "8px 10px",
                    background: "#f9fafb",
                    borderRadius: 6,
                    lineHeight: 1.5,
                  }}
                >
                  {m.notes}
                </div>
              )}
            </div>
            <Tag color={m.status === "completed" ? "green" : "gray"}>
              {m.status === "completed" ? "Completed" : "Cancelled"}
            </Tag>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page: Assignments (mentee_assignments)
// ---------------------------------------------------------------------------

function PageAssignments() {
  const pending  = ASSIGNMENTS.filter((a) => !a.is_submitted);
  const submitted = ASSIGNMENTS.filter((a) => a.is_submitted);

  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: "#111827" }}>Assignments</div>

      <SectionTitle>Pending</SectionTitle>
      {pending.length === 0 ? (
        <Card style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: "#9ca3af" }}>No pending assignments.</div>
        </Card>
      ) : (
        <Card style={{ marginBottom: 20 }}>
          {pending.map((ma, i) => {
            const days = daysUntil(ma.due_at);
            return (
              <div
                key={ma.id}
                style={{
                  padding: "14px 0",
                  borderBottom: i < pending.length - 1 ? "1px solid #f3f4f6" : "none",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
                    {ma.assignment.title}
                  </div>
                  <Tag color={days <= 3 ? "red" : days <= 7 ? "amber" : "gray"}>
                    Due in {days}d
                  </Tag>
                </div>
                <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.5, marginBottom: 8 }}>
                  {ma.assignment.description}
                </div>
                {ma.assignment.instructions && (
                  <div
                    style={{
                      fontSize: 12,
                      color: "#6b7280",
                      background: "#f9fafb",
                      padding: "8px 10px",
                      borderRadius: 6,
                      marginBottom: 8,
                      lineHeight: 1.5,
                    }}
                  >
                    {ma.assignment.instructions}
                  </div>
                )}
                <div style={{ display: "flex", gap: 6 }}>
                  <Tag color="gray">{CATEGORY_LABEL[ma.assignment.category]}</Tag>
                  {ma.assignment.week_number && (
                    <Tag color="purple">Week {ma.assignment.week_number}</Tag>
                  )}
                </div>
              </div>
            );
          })}
        </Card>
      )}

      <SectionTitle>Submitted</SectionTitle>
      <Card>
        {submitted.length === 0 ? (
          <div style={{ fontSize: 13, color: "#9ca3af" }}>Nothing submitted yet.</div>
        ) : (
          submitted.map((ma, i) => (
            <div
              key={ma.id}
              style={{
                padding: "12px 0",
                borderBottom: i < submitted.length - 1 ? "1px solid #f3f4f6" : "none",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 4 }}>
                    {ma.assignment.title}
                  </div>
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>
                    Submitted {fmtDate(ma.submitted_at)}
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
                  <Tag color="green">Submitted</Tag>
                  {ma.is_checked && <Tag color="blue">Reviewed</Tag>}
                </div>
              </div>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page: Check-ins
// ---------------------------------------------------------------------------

function PageCheckIns() {
  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: "#111827" }}>Check-ins</div>
      <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>
        Logged by your mentor after each session. Your private reflections only.
      </div>
      <Card>
        {CHECK_INS.map((ci, i) => {
          const tone = TONE_COLOR[ci.emotional_tone];
          return (
            <div
              key={ci.id}
              style={{
                padding: "14px 0",
                borderBottom: i < CHECK_INS.length - 1 ? "1px solid #f3f4f6" : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: tone.dot,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: "capitalize",
                    padding: "2px 8px",
                    borderRadius: 4,
                    background: tone.bg,
                    color: tone.text,
                  }}
                >
                  {ci.emotional_tone}
                </span>
                <span style={{ fontSize: 12, color: "#9ca3af", marginLeft: "auto" }}>
                  {fmtDate(ci.created_at)}
                </span>
              </div>
              {ci.goals_discussed && (
                <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
                  {ci.goals_discussed}
                </div>
              )}
            </div>
          );
        })}
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page: Resources
// ---------------------------------------------------------------------------

function PageResources() {
  const [filter, setFilter] = useState("all");
  const types = ["all", "handbook", "toolkit", "template", "video", "guide"];
  const filtered = filter === "all" ? RESOURCES : RESOURCES.filter((r) => r.type === filter);

  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: "#111827" }}>Resources</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            style={{
              padding: "5px 12px",
              borderRadius: 20,
              border: filter === t ? "1px solid #6366f1" : "1px solid #e5e7eb",
              background: filter === t ? "#ede9fe" : "#fff",
              color: filter === t ? "#4f46e5" : "#374151",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              textTransform: "capitalize",
            }}
          >
            {t === "all" ? "All" : t}
          </button>
        ))}
      </div>
      <Card>
        {filtered.map((r, i) => (
          <div
            key={r.id}
            style={{
              display: "flex",
              gap: 14,
              padding: "12px 0",
              borderBottom: i < filtered.length - 1 ? "1px solid #f3f4f6" : "none",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "#f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                flexShrink: 0,
              }}
            >
              {RESOURCE_ICON[r.type]}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3, color: "#111827" }}>
                {r.title}
              </div>
              {r.description && (
                <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6, lineHeight: 1.5 }}>
                  {r.description}
                </div>
              )}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <Tag color="purple">{r.type}</Tag>
                {r.week_number && <Tag color="gray">Week {r.week_number}</Tag>}
                {r.tags?.map((t) => <Tag key={t} color="gray">{t}</Tag>)}
              </div>
            </div>
            {r.url && (
              <a
                href={r.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: 12,
                  color: "#6366f1",
                  fontWeight: 500,
                  textDecoration: "none",
                  flexShrink: 0,
                }}
              >
                Open →
              </a>
            )}
          </div>
        ))}
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page: Pod
// ---------------------------------------------------------------------------

function PagePod() {
  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: "#111827" }}>
        {POD.name}
      </div>
      <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 20 }}>
        {COHORT.name} · {POD.skill_level} level
      </div>

      <SectionTitle>Members</SectionTitle>
      <Card style={{ marginBottom: 20 }}>
        {POD.members.map((m, i) => (
          <div
            key={m.user_id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 0",
              borderBottom: i < POD.members.length - 1 ? "1px solid #f3f4f6" : "none",
            }}
          >
            <Avatar name={m.full_name} colorIndex={i} size={36} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>
                {m.full_name}
                {m.is_self && (
                  <span style={{ fontSize: 11, color: "#6366f1", marginLeft: 6 }}>you</span>
                )}
              </div>
              <div style={{ fontSize: 12, color: "#9ca3af", textTransform: "capitalize" }}>
                {m.cohort_role}
              </div>
            </div>
            <Tag color={m.cohort_role === "mentor" ? "purple" : "gray"}>
              {m.cohort_role}
            </Tag>
          </div>
        ))}
      </Card>

      <SectionTitle>Pod sessions</SectionTitle>
      <Card>
        {UPCOMING_MEETINGS.filter((m) => m.title.toLowerCase().includes("pod")).map((m, i, arr) => (
          <div
            key={m.id}
            style={{
              padding: "12px 0",
              borderBottom: i < arr.length - 1 ? "1px solid #f3f4f6" : "none",
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{m.title}</div>
              <div style={{ fontSize: 12, color: "#9ca3af" }}>
                {fmtDate(m.starts_at)} · {fmtTime(m.starts_at)}
              </div>
            </div>
            {m.meet_link && (
              <a
                href={m.meet_link}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: "5px 12px",
                  borderRadius: 8,
                  background: "#6366f1",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Join
              </a>
            )}
          </div>
        ))}
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page: Profile (users + profiles)
// ---------------------------------------------------------------------------

function PageProfile() {
  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, color: "#111827" }}>Profile</div>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <Avatar name={CURRENT_USER.full_name} size={52} colorIndex={3} />
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{CURRENT_USER.full_name}</div>
            <div style={{ fontSize: 13, color: "#6b7280" }}>{CURRENT_USER.email}</div>
            <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{PROFILE.school_or_org}</div>
          </div>
        </div>
        {PROFILE.bio && (
          <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, marginBottom: 16 }}>
            {PROFILE.bio}
          </div>
        )}
        {PROFILE.interests?.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 6 }}>Interests</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {PROFILE.interests.map((t) => <Tag key={t} color="gray">{t}</Tag>)}
            </div>
          </div>
        )}
        {PROFILE.goals?.length > 0 && (
          <div>
            <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 6 }}>Goals</div>
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              {PROFILE.goals.map((g) => (
                <li key={g} style={{ fontSize: 13, color: "#374151", marginBottom: 4 }}>{g}</li>
              ))}
            </ul>
          </div>
        )}
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Notification sidebar
// ---------------------------------------------------------------------------

function NotificationSidebar({ open, onClose }) {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const unreadCount = notifications.filter((n) => !n.read_at).length;

  function markRead(id) {
    // Real: UPDATE user_notifications SET read_at = now() WHERE notification_id = id AND user_id = auth.uid()
    setNotifications((prev) =>
      prev.map((n) => n.id === id ? { ...n, read_at: new Date().toISOString() } : n)
    );
  }

  function markAllRead() {
    // Real: UPDATE user_notifications SET read_at = now() WHERE user_id = auth.uid() AND read_at IS NULL
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
    );
  }

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.15)",
            zIndex: 40,
          }}
        />
      )}

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100%",
          width: 320,
          background: "#fff",
          borderLeft: "1px solid #e5e7eb",
          zIndex: 50,
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.22s ease",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 18px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Notifications</span>
            {unreadCount > 0 && (
              <span
                style={{
                  marginLeft: 8,
                  padding: "1px 7px",
                  borderRadius: 10,
                  background: "#6366f1",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {unreadCount}
              </span>
            )}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                style={{
                  fontSize: 11,
                  color: "#6366f1",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 18,
                color: "#6b7280",
                lineHeight: 1,
                padding: 4,
              }}
              aria-label="Close notifications"
            >
              ×
            </button>
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              style={{
                padding: "14px 18px",
                borderBottom: "1px solid #f3f4f6",
                borderLeft: n.read_at ? "3px solid transparent" : "3px solid #6366f1",
                cursor: "pointer",
                background: n.read_at ? "#fff" : "#fafafe",
                transition: "background 0.1s",
              }}
            >
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 16, marginTop: 1 }}>{NOTIF_ICON[n.type] || "🔔"}</span>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: n.read_at ? 500 : 700,
                      color: "#111827",
                      marginBottom: 3,
                    }}
                  >
                    {n.title}
                  </div>
                  {n.body && (
                    <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>{n.body}</div>
                  )}
                  <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>
                    {fmtDate(n.created_at)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Nav config
// ---------------------------------------------------------------------------

const NAV = [
  { id: "overview",    label: "Overview",    icon: "⊞" },
  { id: "sessions",    label: "Sessions",    icon: "📅" },
  { id: "assignments", label: "Assignments", icon: "📝" },
  { id: "checkins",    label: "Check-ins",   icon: "❤️" },
  { id: "resources",   label: "Resources",   icon: "📚" },
  { id: "pod",         label: "My pod",      icon: "👥" },
  { id: "profile",     label: "Profile",     icon: "👤" },
];

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export default function MenteeDashboard() {
  const [page, setPage] = useState("overview");
  const [notifOpen, setNotifOpen] = useState(false);

  const unreadCount = NOTIFICATIONS.filter((n) => !n.read_at).length;

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Inter, system-ui, sans-serif", background: "#f9fafb" }}>

      {/* ── Sidebar nav ─────────────────────────────────── */}
      <nav
        style={{
          width: 56,
          background: "#fff",
          borderRight: "1px solid #e5e7eb",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "12px 0",
          gap: 2,
          flexShrink: 0,
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "#ede9fe",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            marginBottom: 14,
          }}
        >
          ✦
        </div>

        {NAV.map((item) => (
          <button
            key={item.id}
            title={item.label}
            onClick={() => setPage(item.id)}
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              border: "none",
              background: page === item.id ? "#ede9fe" : "transparent",
              color: page === item.id ? "#5b21b6" : "#9ca3af",
              fontSize: 16,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.12s",
            }}
          >
            {item.icon}
          </button>
        ))}

        <div style={{ marginTop: "auto" }}>
          <Avatar name={CURRENT_USER.full_name} size={32} colorIndex={3} />
        </div>
      </nav>

      {/* ── Main area ───────────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Topbar */}
        <header
          style={{
            height: 52,
            background: "#fff",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            padding: "0 20px",
            gap: 12,
            flexShrink: 0,
          }}
        >
          <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: "#111827" }}>
            {NAV.find((n) => n.id === page)?.label}
          </span>

          {/* Bell */}
          <button
            onClick={() => setNotifOpen(true)}
            aria-label="Notifications"
            style={{
              position: "relative",
              width: 36,
              height: 36,
              borderRadius: 8,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: unreadCount > 0 ? "#6366f1" : "#9ca3af",
            }}
          >
            🔔
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: 4,
                  right: 4,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#ef4444",
                  border: "2px solid #fff",
                }}
              />
            )}
          </button>

          <Avatar name={CURRENT_USER.full_name} size={32} colorIndex={3} />
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {page === "overview"    && <PageOverview setPage={setPage} />}
          {page === "sessions"    && <PageSessions />}
          {page === "assignments" && <PageAssignments />}
          {page === "checkins"    && <PageCheckIns />}
          {page === "resources"   && <PageResources />}
          {page === "pod"         && <PagePod />}
          {page === "profile"     && <PageProfile />}
        </main>
      </div>

      {/* Notification sidebar */}
      <NotificationSidebar open={notifOpen} onClose={() => setNotifOpen(false)} />
    </div>
  );
}