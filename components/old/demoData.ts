/**
 * demoData.jsx
 * Program-wide demo data — visible to PM and Associate roles.
 * Unlike mentor/mentee dashboards (scoped to one pod), these roles
 * see across all cohorts and pods.
 */

// users — PM and Associate
export const ME_PM = { id: "u-100", full_name: "Rahul Gupta", email: "rahul.gupta@example.com", role: "pm" };
export const ME_ASSOCIATE = { id: "u-101", full_name: "Neha Singh", email: "neha.singh@example.com", role: "associate" };

// cohorts table — program manages multiple cohorts
export const COHORTS = [
  { id: "c-001", name: "Cohort 4", program_year: 2024, status: "active",    start_date: "2024-05-01", end_date: "2024-07-31", week_number: 7, total_weeks: 12 },
  { id: "c-002", name: "Cohort 5", program_year: 2024, status: "upcoming",  start_date: "2024-08-01", end_date: "2024-10-31", week_number: 0, total_weeks: 12 },
  { id: "c-003", name: "Cohort 3", program_year: 2024, status: "completed", start_date: "2024-02-01", end_date: "2024-04-30", week_number: 12, total_weeks: 12 },
];

// pods table — grouped by cohort
export const PODS = [
  { id: "pod-001", cohort_id: "c-001", name: "Pod A", skill_level: "beginner",     mentor: "Karthik Iyer",  mentee_count: 4 },
  { id: "pod-002", cohort_id: "c-001", name: "Pod B", skill_level: "intermediate", mentor: "Priya Sharma",  mentee_count: 4 },
  { id: "pod-003", cohort_id: "c-001", name: "Pod C", skill_level: "advanced",     mentor: "Ananya Rao",    mentee_count: 3 },
];

// users (mentors) — for the mentor roster
export const MENTORS = [
  { id: "u-010", full_name: "Priya Sharma", pod: "Pod B", cohort: "Cohort 4", mentee_count: 4, assignment_completion: 73, last_active: "2024-06-26T08:00:00Z" },
  { id: "u-011", full_name: "Karthik Iyer", pod: "Pod A", cohort: "Cohort 4", mentee_count: 4, assignment_completion: 60, last_active: "2024-06-25T14:00:00Z" },
  { id: "u-012", full_name: "Ananya Rao",   pod: "Pod C", cohort: "Cohort 4", mentee_count: 3, assignment_completion: 88, last_active: "2024-06-26T10:00:00Z" },
];

// All mentees across the program — users + cohort_members + pod_members joined
export const MENTEES = [
  { id: "u-001", full_name: "Arjun Mehta",  pod: "Pod B", mentor: "Priya Sharma",  cohort: "Cohort 4", assignment_completion: 60, last_checkin_tone: "great" },
  { id: "u-002", full_name: "Riya Kapoor",  pod: "Pod B", mentor: "Priya Sharma",  cohort: "Cohort 4", assignment_completion: 80, last_checkin_tone: "okay" },
  { id: "u-003", full_name: "Sahil Nair",   pod: "Pod B", mentor: "Priya Sharma",  cohort: "Cohort 4", assignment_completion: 40, last_checkin_tone: "good" },
  { id: "u-004", full_name: "Dev Joshi",    pod: "Pod B", mentor: "Priya Sharma",  cohort: "Cohort 4", assignment_completion: 20, last_checkin_tone: "low" },
  { id: "u-005", full_name: "Meera Pillai", pod: "Pod A", mentor: "Karthik Iyer", cohort: "Cohort 4", assignment_completion: 90, last_checkin_tone: "great" },
  { id: "u-006", full_name: "Yash Patel",   pod: "Pod A", mentor: "Karthik Iyer", cohort: "Cohort 4", assignment_completion: 55, last_checkin_tone: "okay" },
];

// check_ins where escalation_flag = true — program-wide escalation queue
// Note: raw_notes / ai_structured are mentor-private; PM/Associate see
// the structured summary + reason, not the raw brain-dump text.
export const ESCALATIONS = [
  {
    id: "ci-003",
    mentee: { id: "u-004", full_name: "Dev Joshi" },
    mentor: { id: "u-010", full_name: "Priya Sharma" },
    pod: "Pod B", cohort: "Cohort 4",
    emotional_tone: "low",
    escalation_reason: "Missed last two sessions, difficult to reach. Mentor suspects something happening outside the program.",
    escalation_status: "unreviewed",
    created_at: "2024-06-20T10:00:00Z",
    reviewed_at: null, reviewed_by: null,
    actioned_at: null, actioned_by: null,
    associate_note: "",
  },
  {
    id: "ci-008",
    mentee: { id: "u-006", full_name: "Yash Patel" },
    mentor: { id: "u-011", full_name: "Karthik Iyer" },
    pod: "Pod A", cohort: "Cohort 4",
    emotional_tone: "concerned",
    escalation_reason: "Mentee mentioned financial stress affecting ability to attend sessions consistently.",
    escalation_status: "reviewed",
    created_at: "2024-06-18T10:00:00Z",
    reviewed_at: "2024-06-19T09:00:00Z", reviewed_by: "Neha Singh",
    actioned_at: null, actioned_by: null,
    associate_note: "Reached out to mentee directly. Connecting with program scholarship fund. Following up next week.",
  },
  {
    id: "ci-012",
    mentee: { id: "u-002", full_name: "Riya Kapoor" },
    mentor: { id: "u-010", full_name: "Priya Sharma" },
    pod: "Pod B", cohort: "Cohort 4",
    emotional_tone: "okay",
    escalation_reason: "Mentee stretched thin between exams and program commitments. Risk of burnout flagged proactively.",
    escalation_status: "actioned",
    created_at: "2024-06-10T10:00:00Z",
    reviewed_at: "2024-06-11T09:00:00Z", reviewed_by: "Neha Singh",
    actioned_at: "2024-06-12T09:00:00Z", actioned_by: "Neha Singh",
    associate_note: "Adjusted assignment load for this mentee for two weeks. Mentor informed. Resolved.",
  },
];

// mentee_assignments — program-wide completion stats per cohort
export const ASSIGNMENT_STATS_BY_COHORT = [
  { cohort: "Cohort 4", total: 24, submitted: 16, reviewed: 11 },
];

// assignments table — program-wide assignment bank, created_by PM or mentor
export const ASSIGNMENT_TEMPLATES = [
  { id: "a-001", title: "System design — URL shortener", category: "research",   week_number: 7, is_active: true,  created_by: "Priya Sharma" },
  { id: "a-002", title: "Career reflection — 6-month goals", category: "reflection", week_number: 7, is_active: true, created_by: "Rahul Gupta" },
  { id: "a-003", title: "Data analysis — sales dataset", category: "research", week_number: 5, is_active: true, created_by: "Rahul Gupta" },
  { id: "a-004", title: "Build a portfolio landing page", category: "creative", week_number: 8, is_active: true, created_by: "Karthik Iyer" },
  { id: "a-005", title: "Mock interview prep — STAR method", category: "career", week_number: 9, is_active: false, created_by: "Rahul Gupta" },
];

// resources — program-wide library, visible_to varies
export const RESOURCES = [
  { id: "r-001", title: "Program handbook — Cohort 4", type: "handbook", visible_to: "all", week_number: null, created_by: "Rahul Gupta" },
  { id: "r-002", title: "Mentor onboarding toolkit", type: "toolkit", visible_to: "mentor", week_number: null, created_by: "Rahul Gupta" },
  { id: "r-003", title: "System design primer", type: "guide", visible_to: "mentee", week_number: 7, created_by: "Priya Sharma" },
];

// Chat channels visible to PM/Associate
export const CHAT_CHANNELS = [
  { id: "ch-staff", name: "Program team", type: "staff", description: "PM & Associates — internal only" },
  { id: "ch-c001",  name: "Cohort 4",      type: "cohort", description: "Everyone in Cohort 4" },
  { id: "ch-mentors", name: "All mentors", type: "mentors", description: "Mentor coordination channel" },
];

export const DEMO_MESSAGES = {
  "ch-staff": [
    { id: "msg-1", sender: { full_name: "Neha Singh",  role: "associate", is_self_associate: true }, body: "Dev Joshi escalation still unreviewed — can someone take a look today?", created_at: "2024-06-21T09:00:00Z" },
    { id: "msg-2", sender: { full_name: "Rahul Gupta", role: "pm", is_self_pm: true }, body: "On it. I'll call his mentor first to get more context.", created_at: "2024-06-21T09:15:00Z" },
  ],
  "ch-c001": [
    { id: "msg-3", sender: { full_name: "Rahul Gupta", role: "pm", is_self_pm: true }, body: "Reminder: Week 7 assignments are due by end of week. Mentors please prompt your mentees.", created_at: "2024-06-24T08:00:00Z" },
  ],
  "ch-mentors": [
    { id: "msg-4", sender: { full_name: "Neha Singh",  role: "associate", is_self_associate: true }, body: "Please log check-ins for all your mentees by Friday this week.", created_at: "2024-06-24T09:00:00Z" },
    { id: "msg-5", sender: { full_name: "Priya Sharma", role: "mentor" }, body: "Done for all four of mine!", created_at: "2024-06-24T09:10:00Z" },
    { id: "msg-6", sender: { full_name: "Karthik Iyer", role: "mentor" }, body: "Will finish mine by tomorrow.", created_at: "2024-06-24T09:30:00Z" },
  ],
};