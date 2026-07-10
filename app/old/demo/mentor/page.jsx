/**
 * MentorDashboard.jsx
 * Demo version — all data hardcoded, no external dependencies.
 * Schema-accurate: every field maps to a real table/column.
 */

"use client";
import { useState } from "react";

// ─── Demo data ────────────────────────────────────────────────────────────────

const ME = {
  id: "u-010", full_name: "Priya Sharma", email: "priya.sharma@example.com", role: "mentor",
};

const COHORT = {
  id: "c-001", name: "Cohort 4", program_year: 2024,
  start_date: "2024-05-01", end_date: "2024-07-31",
  status: "active", description: "A 12-week mentorship program for emerging tech talent.",
  week_number: 7, total_weeks: 12,
};

const POD = {
  id: "pod-001", name: "Pod B", skill_level: "intermediate",
  mentees: [
    { user_id: "u-001", full_name: "Arjun Mehta", role: "mentee", cohort_role: "mentee", bio: "CS undergrad at BITS Pilani. Backend & product focus.", assignments_done: 3, assignments_total: 5 },
    { user_id: "u-002", full_name: "Riya Kapoor",  role: "mentee", cohort_role: "mentee", bio: "Final year IIT Delhi. ML and data pipelines.", assignments_done: 4, assignments_total: 5 },
    { user_id: "u-003", full_name: "Sahil Nair",   role: "mentee", cohort_role: "mentee", bio: "Fresher NIT Trichy. Frontend engineering.", assignments_done: 2, assignments_total: 5 },
    { user_id: "u-004", full_name: "Dev Joshi",    role: "mentee", cohort_role: "mentee", bio: "2nd year Delhi University. Data science.", assignments_done: 1, assignments_total: 5 },
  ],
};

// check_ins — only fields a mentor sees (all fields except escalation internals shown to associate/pm)
// escalation_flag and escalation_status are shown since mentor created these records
const CHECK_INS = [
  {
    id: "ci-001", mentee: { user_id: "u-001", full_name: "Arjun Mehta" },
    emotional_tone: "great", goals_discussed: "Solid progress on data module. Indexing finally clicked after group session.",
    raw_notes: "Arjun seems genuinely energised this week. No blockers. Continue pushing on system design.",
    escalation_flag: false, escalation_status: null,
    created_at: "2024-06-24T10:00:00Z",
  },
  {
    id: "ci-002", mentee: { user_id: "u-002", full_name: "Riya Kapoor" },
    emotional_tone: "okay", goals_discussed: "ML pipeline progressing but she is stretched thin with college exams.",
    raw_notes: "Watch for burnout. Suggested she drop the optional assignment this week. Family stress mentioned briefly.",
    escalation_flag: false, escalation_status: null,
    created_at: "2024-06-21T10:00:00Z",
  },
  {
    id: "ci-003", mentee: { user_id: "u-004", full_name: "Dev Joshi" },
    emotional_tone: "low", goals_discussed: "Missed last two sessions. Difficult to reach.",
    raw_notes: "Dev has gone quiet. Did not complete any assignments this week. May be dealing with something outside the program.",
    escalation_flag: true, escalation_status: "unreviewed",
    created_at: "2024-06-20T10:00:00Z",
  },
];

// mentee_assignments + assignments for mentor's pod
const MENTEE_ASSIGNMENTS = [
  { id: "ma-001", mentee: { user_id: "u-001", full_name: "Arjun Mehta" }, assignment: { title: "System design — URL shortener", week_number: 7 }, due_at: "2024-07-10T23:59:00Z", is_submitted: false, is_checked: false },
  { id: "ma-002", mentee: { user_id: "u-001", full_name: "Arjun Mehta" }, assignment: { title: "Career reflection — 6-month goals", week_number: 7 }, due_at: "2024-07-01T23:59:00Z", is_submitted: false, is_checked: false },
  { id: "ma-003", mentee: { user_id: "u-001", full_name: "Arjun Mehta" }, assignment: { title: "Data analysis — sales dataset", week_number: 5 }, due_at: "2024-06-25T23:59:00Z", is_submitted: true, is_checked: true },
  { id: "ma-004", mentee: { user_id: "u-002", full_name: "Riya Kapoor"  }, assignment: { title: "System design — URL shortener", week_number: 7 }, due_at: "2024-07-10T23:59:00Z", is_submitted: true, is_checked: false },
  { id: "ma-005", mentee: { user_id: "u-002", full_name: "Riya Kapoor"  }, assignment: { title: "Data analysis — sales dataset", week_number: 5 }, due_at: "2024-06-25T23:59:00Z", is_submitted: true, is_checked: true },
  { id: "ma-006", mentee: { user_id: "u-003", full_name: "Sahil Nair"   }, assignment: { title: "System design — URL shortener", week_number: 7 }, due_at: "2024-07-10T23:59:00Z", is_submitted: false, is_checked: false },
  { id: "ma-007", mentee: { user_id: "u-004", full_name: "Dev Joshi"    }, assignment: { title: "System design — URL shortener", week_number: 7 }, due_at: "2024-07-10T23:59:00Z", is_submitted: false, is_checked: false },
];

// Escalations (check_ins where escalation_flag = true) — shown in cohort section
const ESCALATIONS = CHECK_INS.filter((c) => c.escalation_flag);

// Template assignment bank (assignments table)
const ASSIGNMENT_TEMPLATES = [
  { id: "a-001", title: "System design — URL shortener", category: "research", week_number: 7 },
  { id: "a-002", title: "Career reflection — 6-month goals", category: "reflection", week_number: 7 },
  { id: "a-003", title: "Data analysis — sales dataset", category: "research", week_number: 5 },
  { id: "a-004", title: "Build a portfolio landing page", category: "creative", week_number: 8 },
  { id: "a-005", title: "Mock interview prep — STAR method", category: "career", week_number: 9 },
];

// meetings for mentor's pod
const MEETINGS = [
  { id: "m-001", title: "1:1 — Arjun Mehta", starts_at: "2024-06-27T09:30:00Z", ends_at: "2024-06-27T10:15:00Z", status: "scheduled", meet_link: "https://meet.google.com/abc-def", description: "Weekly 1:1" },
  { id: "m-002", title: "Pod B group session", starts_at: "2024-06-27T11:30:00Z", ends_at: "2024-06-27T12:30:00Z", status: "scheduled", meet_link: "https://zoom.us/j/123456", description: null },
  { id: "m-010", title: "1:1 — Arjun Mehta", starts_at: "2024-06-20T09:30:00Z", ends_at: "2024-06-20T10:15:00Z", status: "completed", meet_link: null, description: "Weekly 1:1" },
  { id: "m-011", title: "Pod B group session", starts_at: "2024-06-13T11:30:00Z", ends_at: "2024-06-13T12:30:00Z", status: "completed", meet_link: null, description: null },
];

// Chat channels
const CHAT_CHANNELS = [
  { id: "ch-001", name: "Cohort 4",       type: "cohort",   description: "Everyone in the cohort" },
  { id: "ch-002", name: "Pod B",           type: "pod",      description: "Pod B — all members" },
  { id: "ch-pm",  name: "Program team",   type: "staff",    description: "PM & Associate · separate from mentee view" },
  { id: "ch-m1",  name: "Arjun Mehta",    type: "direct",   description: "Direct · Mentee", mentee_id: "u-001" },
  { id: "ch-m2",  name: "Riya Kapoor",    type: "direct",   description: "Direct · Mentee", mentee_id: "u-002" },
  { id: "ch-m3",  name: "Sahil Nair",     type: "direct",   description: "Direct · Mentee", mentee_id: "u-003" },
  { id: "ch-m4",  name: "Dev Joshi",      type: "direct",   description: "Direct · Mentee", mentee_id: "u-004" },
];

const DEMO_MESSAGES = {
  "ch-001": [
    { id: "msg-1", sender: { full_name: "Neha Singh",   role: "associate" }, body: "Week 7 check-in reminder: all mentors please log check-ins by Friday.", created_at: "2024-06-24T09:00:00Z" },
    { id: "msg-2", sender: { full_name: "Priya Sharma", role: "mentor", is_self: true }, body: "Done for all four of mine!", created_at: "2024-06-24T09:10:00Z" },
  ],
  "ch-002": [
    { id: "msg-3", sender: { full_name: "Priya Sharma", role: "mentor", is_self: true }, body: "Great session today team. Arjun, solid questions on indexing.", created_at: "2024-06-20T11:30:00Z" },
    { id: "msg-4", sender: { full_name: "Riya Kapoor",  role: "mentee" }, body: "Agreed, really good session!", created_at: "2024-06-20T11:35:00Z" },
  ],
  "ch-pm": [
    { id: "msg-5", sender: { full_name: "Rahul Gupta",  role: "pm" }, body: "Priya, Dev Joshi has missed two sessions. Can you log a check-in with your assessment?", created_at: "2024-06-21T10:00:00Z" },
    { id: "msg-6", sender: { full_name: "Priya Sharma", role: "mentor", is_self: true }, body: "Already flagged it — escalation submitted. I'll try to reach him directly.", created_at: "2024-06-21T10:20:00Z" },
    { id: "msg-7", sender: { full_name: "Neha Singh",   role: "associate" }, body: "Thanks Priya. I'll follow up from our side as well.", created_at: "2024-06-21T10:25:00Z" },
  ],
  "ch-m1": [
    { id: "msg-8",  sender: { full_name: "Priya Sharma", role: "mentor", is_self: true }, body: "Good progress this week. How are you feeling about the system design assignment?", created_at: "2024-06-22T15:00:00Z" },
    { id: "msg-9",  sender: { full_name: "Arjun Mehta",  role: "mentee" }, body: "A bit uncertain on the scaling piece. Can we cover it in our 1:1?", created_at: "2024-06-22T15:20:00Z" },
    { id: "msg-10", sender: { full_name: "Priya Sharma", role: "mentor", is_self: true }, body: "Absolutely, added it to our agenda for tomorrow.", created_at: "2024-06-22T15:22:00Z" },
  ],
  "ch-m2": [
    { id: "msg-11", sender: { full_name: "Priya Sharma", role: "mentor", is_self: true }, body: "Hey Riya, how are you holding up with exams + program?", created_at: "2024-06-21T12:00:00Z" },
    { id: "msg-12", sender: { full_name: "Riya Kapoor",  role: "mentee" }, body: "It's a lot but I'm managing. Thank you for checking in!", created_at: "2024-06-21T12:30:00Z" },
  ],
  "ch-m3": [
    { id: "msg-13", sender: { full_name: "Priya Sharma", role: "mentor", is_self: true }, body: "Sahil, let me know if you need help with the system design assignment.", created_at: "2024-06-23T09:00:00Z" },
    { id: "msg-14", sender: { full_name: "Sahil Nair",   role: "mentee" }, body: "Thanks! I'll send you my draft tonight.", created_at: "2024-06-23T09:20:00Z" },
  ],
  "ch-m4": [
    { id: "msg-15", sender: { full_name: "Priya Sharma", role: "mentor", is_self: true }, body: "Hey Dev, just checking in — missed you at the last two sessions. Everything okay?", created_at: "2024-06-22T09:00:00Z" },
  ],
};

// ─── Design tokens ────────────────────────────────────────────────────────────

const T = {
  bg: "#0D1117", surface: "#161B27", card: "#1C2333", cardHi: "#243044",
  border: "#2D3748", borderHi: "#4B5563",
  accent: "#6366F1", accentBg: "#1e1b4b",
  success: "#10B981", successBg: "#064e3b",
  warning: "#F59E0B", warningBg: "#78350f",
  danger: "#EF4444",  dangerBg: "#7f1d1d",
  text: "#F0F4FF", textSec: "#94A3B8", textMut: "#4B5563",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const initials  = (n) => n.split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2);
const fmtDate   = (iso) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
const fmtTime   = (iso) => new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
const daysUntil = (iso) => Math.ceil((new Date(iso) - new Date()) / 86400000);

const PALETTES = [
  ["#3730a3","#c7d2fe"],["#065f46","#a7f3d0"],["#92400e","#fde68a"],
  ["#1e40af","#bfdbfe"],["#831843","#fbcfe8"],["#134e4a","#99f6e4"],
];
const pal = (i = 0) =>
  PALETTES[Math.abs(i) % PALETTES.length];

const ROLE_BADGE = {
  mentor:    { bg: "#312e81", text: "#a5b4fc", label: "Mentor" },
  mentee:    { bg: "#064e3b", text: "#6ee7b7", label: "Mentee" },
  associate: { bg: "#78350f", text: "#fcd34d", label: "Associate" },
  pm:        { bg: "#1e1b4b", text: "#e0e7ff", label: "PM" },
};

const TONE_COLOR = {
  great: { dot: "#10b981", bg: "#064e3b", text: "#6ee7b7" },
  good:  { dot: "#6366f1", bg: "#1e1b4b", text: "#a5b4fc" },
  okay:  { dot: "#f59e0b", bg: "#78350f", text: "#fde68a" },
  low:   { dot: "#ef4444", bg: "#7f1d1d", text: "#fca5a5" },
  concerned: { dot: "#ec4899", bg: "#831843", text: "#fbcfe8" },
};

// ─── Base components ──────────────────────────────────────────────────────────

function Avatar({ name, size = 32, index = 0 }) {
  const [bg, fg] = pal(index);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: bg, color: fg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.36, fontWeight: 700, flexShrink: 0,
    }}>{initials(name)}</div>
  );
}

function RoleBadge({ role }) {
  const r = ROLE_BADGE[role] || ROLE_BADGE.mentee;
  return (
    <span style={{
      padding: "1px 7px", borderRadius: 4, fontSize: 10, fontWeight: 700,
      background: r.bg, color: r.text, letterSpacing: "0.03em",
    }}>{r.label}</span>
  );
}

function Tag({ children, color = T.textSec, bg = T.cardHi }) {
  return (
    <span style={{
      padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600,
      background: bg, color, display: "inline-flex", alignItems: "center", gap: 3,
    }}>{children}</span>
  );
}

function Btn({ children, onClick, variant = "ghost", small, full, style: sx }) {
  const styles = {
    primary: { background: T.accent,    color: "#fff" },
    ghost:   { background: T.cardHi,    color: T.text },
    success: { background: T.successBg, color: T.success },
    danger:  { background: T.dangerBg,  color: T.danger },
    warning: { background: T.warningBg, color: T.warning },
  };
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: small ? "4px 10px" : "7px 14px",
      borderRadius: 8, fontSize: small ? 11 : 13, fontWeight: 600,
      cursor: "pointer", border: "none",
      width: full ? "100%" : undefined,
      justifyContent: full ? "center" : undefined,
      ...(styles[variant] || styles.ghost), ...sx,
    }}>{children}</button>
  );
}

function Card({ children, accent, style: sx }) {
  return (
    <div style={{
      background: T.card, borderRadius: 12, padding: "16px 18px",
      border: `1px solid ${T.border}`,
      borderLeft: accent ? `3px solid ${accent}` : `1px solid ${T.border}`,
      ...sx,
    }}>{children}</div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 800, color: T.textMut,
      textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10,
    }}>{children}</div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: T.border, margin: "12px 0" }} />;
}

function FieldLabel({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 600, color: T.textSec, marginBottom: 5 }}>{children}</div>;
}

function TextInput({ label, ...props }) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <input {...props} style={{
        width: "100%", padding: "8px 10px", borderRadius: 8, fontSize: 13,
        background: T.cardHi, border: `1px solid ${T.border}`, color: T.text,
        outline: "none", boxSizing: "border-box",
      }} />
    </div>
  );
}

function TextArea({ label, ...props }) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <textarea {...props} style={{
        width: "100%", padding: "8px 10px", borderRadius: 8, fontSize: 13,
        background: T.cardHi, border: `1px solid ${T.border}`, color: T.text,
        outline: "none", resize: "vertical", minHeight: 72, boxSizing: "border-box",
      }} />
    </div>
  );
}

function Select({ label, children, ...props }) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && <FieldLabel>{label}</FieldLabel>}
      <select {...props} style={{
        width: "100%", padding: "8px 10px", borderRadius: 8, fontSize: 13,
        background: T.cardHi, border: `1px solid ${T.border}`, color: T.text,
        outline: "none", boxSizing: "border-box",
      }}>{children}</select>
    </div>
  );
}

// ─── Chat panel ───────────────────────────────────────────────────────────────

function ChatPanel({ onClose, initialChannel }) {
  const [activeId, setActiveId] = useState(initialChannel || "ch-001");
  const [input, setInput] = useState("");

  const msgs    = DEMO_MESSAGES[activeId] || [];
  const channel = CHAT_CHANNELS.find((c) => c.id === activeId);

  const CH_ICON = {
    direct: "👤", cohort: "🏛️", pod: "👥", staff: "🔒",
  };

  // Group channels by type for the sidebar
  const groups = [
    { label: "Cohort & pod", ids: ["ch-001", "ch-002"] },
    { label: "Program team",  ids: ["ch-pm"] },
    { label: "Your mentees",  ids: ["ch-m1", "ch-m2", "ch-m3", "ch-m4"] },
  ];

  return (
    <div style={{
      position: "fixed", top: 0, right: 0, height: "100%", width: 440,
      background: T.surface, borderLeft: `1px solid ${T.border}`,
      zIndex: 60, display: "flex",
    }}>
      {/* Channel sidebar */}
      <div style={{
        width: 160, borderRight: `1px solid ${T.border}`,
        display: "flex", flexDirection: "column", padding: "14px 0", overflowY: "auto",
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: T.text, padding: "0 12px 10px" }}>
          Messages
        </div>
        {groups.map((g) => (
          <div key={g.label}>
            <div style={{
              fontSize: 9, fontWeight: 800, color: T.textMut,
              textTransform: "uppercase", letterSpacing: "0.1em",
              padding: "8px 12px 4px",
            }}>{g.label}</div>
            {g.ids.map((id) => {
              const ch = CHAT_CHANNELS.find((c) => c.id === id);
              if (!ch) return null;
              return (
                <button key={id} onClick={() => setActiveId(id)} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "7px 12px", border: "none", cursor: "pointer",
                  width: "100%", textAlign: "left",
                  background: activeId === id ? T.accentBg : "transparent",
                  color: activeId === id ? "#a5b4fc" : T.textSec,
                  borderLeft: activeId === id ? `2px solid ${T.accent}` : "2px solid transparent",
                }}>
                  <span style={{ fontSize: 13 }}>{CH_ICON[ch.type] || "💬"}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
                      overflow: "hidden", textOverflow: "ellipsis" }}>{ch.name}</div>
                    {ch.type === "staff" && (
                      <div style={{ fontSize: 9, color: T.warning, marginTop: 1 }}>Staff only</div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Message pane */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Header */}
        <div style={{
          padding: "14px 16px", borderBottom: `1px solid ${T.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{channel?.name}</div>
            <div style={{ fontSize: 11, color: channel?.type === "staff" ? T.warning : T.textSec }}>
              {channel?.description}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "none", color: T.textSec, fontSize: 18, cursor: "pointer",
          }}>✕</button>
        </div>

        {/* Staff-only notice */}
        {channel?.type === "staff" && (
          <div style={{
            margin: "10px 14px 0", padding: "8px 12px", borderRadius: 8,
            background: T.warningBg, border: `1px solid ${T.warning}`,
            fontSize: 12, color: T.warning, fontWeight: 500,
          }}>
            🔒 This channel is only visible to mentors, associates, and PMs — not mentees.
          </div>
        )}

        {/* Messages */}
        <div style={{
          flex: 1, overflowY: "auto", padding: "14px",
          display: "flex", flexDirection: "column", gap: 14,
        }}>
          {msgs.map((m) => (
            <div key={m.id} style={{
              display: "flex", gap: 8,
              flexDirection: m.sender.is_self ? "row-reverse" : "row",
            }}>
              {!m.sender.is_self && (
                <Avatar name={m.sender.full_name} size={28}
                  index={[...POD.mentees, ME].findIndex((p) => p.full_name === m.sender.full_name)} />
              )}
              <div style={{ maxWidth: "76%" }}>
                {!m.sender.is_self && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: T.textSec }}>
                      {m.sender.full_name}
                    </span>
                    <RoleBadge role={m.sender.role} />
                  </div>
                )}
                <div style={{
                  padding: "8px 12px", borderRadius: 10, fontSize: 13, lineHeight: 1.5,
                  background: m.sender.is_self ? T.accentBg : T.cardHi,
                  color: m.sender.is_self ? "#c7d2fe" : T.text,
                  borderBottomRightRadius: m.sender.is_self ? 2 : 10,
                  borderBottomLeftRadius:  m.sender.is_self ? 10 : 2,
                }}>{m.body}</div>
                <div style={{
                  fontSize: 10, color: T.textMut, marginTop: 3,
                  textAlign: m.sender.is_self ? "right" : "left",
                }}>{fmtTime(m.created_at)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div style={{ padding: "10px 14px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 8 }}>
          <input value={input} onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${channel?.name || ""}…`} style={{
              flex: 1, padding: "8px 12px", borderRadius: 8, fontSize: 13,
              background: T.cardHi, border: `1px solid ${T.border}`,
              color: T.text, outline: "none",
            }} />
          <Btn variant="primary" onClick={() => setInput("")}>Send</Btn>
        </div>
      </div>
    </div>
  );
}

// ─── Pages ────────────────────────────────────────────────────────────────────

function PageCohort({ openChat }) {
  const progress = Math.round((COHORT.week_number / COHORT.total_weeks) * 100);
  const r = 28; const circ = 2 * Math.PI * r;
  const totalDone  = MENTEE_ASSIGNMENTS.filter((a) => a.is_submitted).length;
  const totalAll   = MENTEE_ASSIGNMENTS.length;
  const unchecked  = MENTEE_ASSIGNMENTS.filter((a) => a.is_submitted && !a.is_checked);

  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 800, color: T.text, marginBottom: 4 }}>{COHORT.name}</div>
      <div style={{ fontSize: 13, color: T.textSec, marginBottom: 20 }}>
        {new Date(COHORT.start_date).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
        {" – "}
        {new Date(COHORT.end_date).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
      </div>

      {/* Main cohort card */}
      <Card accent={T.accent} style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1, paddingRight: 20 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
              <Tag color={T.success} bg={T.successBg}>● Active</Tag>
              <Tag color={T.textSec}>Year {COHORT.program_year}</Tag>
              <Tag color={T.accent} bg={T.accentBg}>Week {COHORT.week_number} of {COHORT.total_weeks}</Tag>
            </div>
            <div style={{ fontSize: 13, color: T.textSec, lineHeight: 1.7, marginBottom: 16 }}>
              {COHORT.description}
            </div>
            <Btn variant="primary" onClick={() => openChat("ch-001")}>💬 Cohort chat</Btn>
          </div>
          
        </div>
      </Card>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 20 }}>
        <Card style={{ padding: "12px 16px" }}>
          <div style={{ fontSize: 11, color: T.textMut, marginBottom: 4 }}>Assignment completion</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: T.text }}>
            {totalDone}<span style={{ fontSize: 14, color: T.textSec, fontWeight: 400 }}>/{totalAll}</span>
          </div>
          <div style={{ height: 4, background: T.cardHi, borderRadius: 2, marginTop: 8 }}>
            <div style={{ height: "100%", borderRadius: 2, background: T.success,
              width: `${Math.round((totalDone / totalAll) * 100)}%` }} />
          </div>
        </Card>
        <Card style={{ padding: "12px 16px" }}>
          <div style={{ fontSize: 11, color: T.textMut, marginBottom: 4 }}>Awaiting your review</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: unchecked.length > 0 ? T.warning : T.success }}>
            {unchecked.length}
          </div>
          <div style={{ fontSize: 11, color: T.textSec, marginTop: 4 }}>submitted submissions</div>
        </Card>
        <Card style={{ padding: "12px 16px" }}>
          <div style={{ fontSize: 11, color: T.textMut, marginBottom: 4 }}>Escalations</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: ESCALATIONS.length > 0 ? T.danger : T.success }}>
            {ESCALATIONS.length}
          </div>
          <div style={{ fontSize: 11, color: T.textSec, marginTop: 4 }}>unreviewed flags</div>
        </Card>
      </div>

      {/* Escalations */}
      {ESCALATIONS.length > 0 && (
        <>
          <SectionLabel>Escalations</SectionLabel>
          {ESCALATIONS.map((ci) => {
            const tone = TONE_COLOR[ci.emotional_tone] || TONE_COLOR.okay;
            return (
              <Card key={ci.id} accent={T.danger} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <Avatar name={ci.mentee.full_name} size={36}
                    index={POD.mentees.findIndex((m) => m.user_id === ci.mentee.user_id)} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>
                        {ci.mentee.full_name}
                      </span>
                      <RoleBadge role="mentee" />
                      <Tag color={tone.text} bg={tone.bg}>{ci.emotional_tone}</Tag>
                      <Tag color={T.danger} bg={T.dangerBg}>⚑ Escalated</Tag>
                    </div>
                    <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.6, marginBottom: 8 }}>
                      {ci.goals_discussed}
                    </div>
                    <div style={{ fontSize: 11, color: T.textMut }}>{fmtDate(ci.created_at)}</div>
                  </div>
                </div>
              </Card>
            );
          })}
        </>
      )}
    </div>
  );
}

function PagePod({ openChat }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 800, color: T.text, marginBottom: 4 }}>{POD.name}</div>
      <div style={{ fontSize: 13, color: T.textSec, marginBottom: 20 }}>
        {COHORT.name} · {POD.skill_level} level · {POD.mentees.length} mentees
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        <Btn variant="primary" onClick={() => openChat("ch-002")}>💬 Pod chat</Btn>
      </div>

      <SectionLabel>Your mentees</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {POD.mentees.map((m, i) => {
          const pct = Math.round((m.assignments_done / m.assignments_total) * 100);
          const lastCheckin = CHECK_INS.find((c) => c.mentee.user_id === m.user_id);
          const tone = lastCheckin ? TONE_COLOR[lastCheckin.emotional_tone] : null;
          const chatChannel = CHAT_CHANNELS.find((ch) => ch.mentee_id === m.user_id);

          return (
            <Card key={m.user_id}
              accent={lastCheckin?.escalation_flag ? T.danger : undefined}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar name={m.full_name} size={40} index={i} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{m.full_name}</span>
                    <RoleBadge role="mentee" />
                    {tone && <Tag color={tone.text} bg={tone.bg}>{lastCheckin.emotional_tone}</Tag>}
                    {lastCheckin?.escalation_flag && <Tag color={T.danger} bg={T.dangerBg}>⚑ Flagged</Tag>}
                  </div>
                  {/* Assignment progress bar */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, height: 4, background: T.cardHi, borderRadius: 2 }}>
                      <div style={{ height: "100%", borderRadius: 2,
                        background: pct >= 80 ? T.success : pct >= 50 ? T.accent : T.warning,
                        width: `${pct}%` }} />
                    </div>
                    <span style={{ fontSize: 11, color: T.textSec, flexShrink: 0 }}>
                      {m.assignments_done}/{m.assignments_total} assignments
                    </span>
                  </div>
                  {expanded === m.user_id && (
                    <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.6, marginTop: 8 }}>
                      {m.bio}
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <Btn small variant="ghost"
                    onClick={() => setExpanded(expanded === m.user_id ? null : m.user_id)}>
                    {expanded === m.user_id ? "Less" : "Details"}
                  </Btn>
                  {chatChannel && (
                    <Btn small variant="primary" onClick={() => openChat(chatChannel.id)}>
                      Chat
                    </Btn>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function PageCheckIns() {
  const [newCheckin, setNewCheckin] = useState(false);
  const [form, setForm] = useState({
    mentee_id: "", emotional_tone: "okay",
    goals_discussed: "", raw_notes: "", escalation_flag: false,
  });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: T.text }}>Check-ins</div>
        <Btn variant="primary" onClick={() => setNewCheckin(true)}>+ Log check-in</Btn>
      </div>

      {newCheckin && (
        <Card accent={T.accent} style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 14 }}>New check-in</div>
          <Select label="Mentee"
            value={form.mentee_id}
            onChange={(e) => setForm({ ...form, mentee_id: e.target.value })}>
            <option value="">Select mentee…</option>
            {POD.mentees.map((m) => <option key={m.user_id} value={m.user_id}>{m.full_name}</option>)}
          </Select>
          <div style={{ marginBottom: 12 }}>
            <FieldLabel>Emotional tone</FieldLabel>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["great","good","okay","low","concerned"].map((t) => {
                const c = TONE_COLOR[t];
                return (
                  <button key={t} onClick={() => setForm({ ...form, emotional_tone: t })} style={{
                    padding: "4px 10px", borderRadius: 6, border: "none", cursor: "pointer",
                    background: form.emotional_tone === t ? c.bg : T.cardHi,
                    color: form.emotional_tone === t ? c.text : T.textSec,
                    fontSize: 12, fontWeight: 600, textTransform: "capitalize",
                  }}>{t}</button>
                );
              })}
            </div>
          </div>
          <TextArea
            label="Goals discussed (visible to mentee)"
            placeholder="What goals / topics did you cover in this session?"
            value={form.goals_discussed}
            onChange={(e) => setForm({ ...form, goals_discussed: e.target.value })}
          />
          <TextArea
            label="Your private notes (never shown to mentee)"
            placeholder="Context, concerns, anything the associate/PM should know…"
            value={form.raw_notes}
            onChange={(e) => setForm({ ...form, raw_notes: e.target.value })}
            style={{ borderColor: T.warningBg }}
          />
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <input type="checkbox" checked={form.escalation_flag}
                onChange={(e) => setForm({ ...form, escalation_flag: e.target.checked })} />
              <span style={{ fontSize: 13, color: T.text }}>Flag for escalation</span>
              <span style={{ fontSize: 11, color: T.textSec }}>— notifies the associate</span>
            </label>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="primary" onClick={() => setNewCheckin(false)}>Save check-in</Btn>
            <Btn variant="ghost" onClick={() => setNewCheckin(false)}>Cancel</Btn>
          </div>
        </Card>
      )}

      <SectionLabel>Recent · {CHECK_INS.length}</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {CHECK_INS.map((ci) => {
          const tone = TONE_COLOR[ci.emotional_tone] || TONE_COLOR.okay;
          return (
            <Card key={ci.id} accent={ci.escalation_flag ? T.danger : undefined}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <Avatar name={ci.mentee.full_name} size={36}
                  index={POD.mentees.findIndex((m) => m.user_id === ci.mentee.user_id)} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{ci.mentee.full_name}</span>
                    <Tag color={tone.text} bg={tone.bg}>{ci.emotional_tone}</Tag>
                    {ci.escalation_flag && <Tag color={T.danger} bg={T.dangerBg}>⚑ Escalated</Tag>}
                    <span style={{ fontSize: 11, color: T.textMut, marginLeft: "auto" }}>{fmtDate(ci.created_at)}</span>
                  </div>
                  <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.6, marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, color: T.textSec }}>Goals discussed: </span>
                    {ci.goals_discussed}
                  </div>
                  <div style={{
                    fontSize: 12, color: T.warning, lineHeight: 1.6,
                    padding: "8px 10px", background: T.warningBg, borderRadius: 8,
                  }}>
                    <span style={{ fontWeight: 600 }}>Private notes: </span>
                    {ci.raw_notes}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function PageSchedule() {
  const [form, setForm] = useState({
    title: "", description: "", starts_at: "", ends_at: "",
    meet_link: "", invitees: [],
  });
  const allInvitees = [
    { id: "u-001", name: "Arjun Mehta", role: "mentee" },
    { id: "u-002", name: "Riya Kapoor", role: "mentee" },
    { id: "u-003", name: "Sahil Nair", role: "mentee" },
    { id: "u-004", name: "Dev Joshi", role: "mentee" },
  ];

  const toggleInvitee = (id) =>
    setForm((f) => ({
      ...f, invitees: f.invitees.includes(id)
        ? f.invitees.filter((i) => i !== id)
        : [...f.invitees, id],
    }));

  const upcoming = MEETINGS.filter((m) => m.status === "scheduled");
  const past     = MEETINGS.filter((m) => m.status !== "scheduled");

  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 800, color: T.text, marginBottom: 20 }}>Schedule</div>

      {/* Schedule meeting form */}
      <Card accent={T.accent} style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 14 }}>Schedule a meeting</div>
        <TextInput label="Title" placeholder="e.g. 1:1 · Arjun Mehta, Pod B group session"
          value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <TextArea label="Description (optional)" placeholder="Agenda or context…"
          value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <TextInput label="Start time" type="datetime-local"
            value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} />
          <TextInput label="End time" type="datetime-local"
            value={form.ends_at} onChange={(e) => setForm({ ...form, ends_at: e.target.value })} />
        </div>
        <TextInput label="Google Meet / Zoom link (optional)" placeholder="https://meet.google.com/…"
          value={form.meet_link} onChange={(e) => setForm({ ...form, meet_link: e.target.value })} />
        <div style={{ marginBottom: 14 }}>
          <FieldLabel>Invite mentees</FieldLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {allInvitees.map((inv, i) => (
              <label key={inv.id} style={{
                display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
                padding: "8px 10px", borderRadius: 8,
                background: form.invitees.includes(inv.id) ? T.accentBg : T.cardHi,
              }}>
                <input type="checkbox" checked={form.invitees.includes(inv.id)}
                  onChange={() => toggleInvitee(inv.id)} />
                <Avatar name={inv.name} size={24} index={i} />
                <span style={{ fontSize: 13, color: T.text }}>{inv.name}</span>
                <RoleBadge role={inv.role} />
              </label>
            ))}
          </div>
        </div>
        <Btn variant="primary">Create meeting</Btn>
      </Card>

      <SectionLabel>Upcoming · {upcoming.length}</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {upcoming.map((m) => (
          <Card key={m.id} accent={T.accent}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 4 }}>{m.title}</div>
                {m.description && <div style={{ fontSize: 12, color: T.textSec, marginBottom: 6 }}>{m.description}</div>}
                <div style={{ fontSize: 12, color: T.textSec }}>
                  {fmtDate(m.starts_at)} · {fmtTime(m.starts_at)} – {fmtTime(m.ends_at)}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                <Tag color={T.accent} bg={T.accentBg}>Scheduled</Tag>
                {m.meet_link && (
                  <a href={m.meet_link} target="_blank" rel="noreferrer"
                    style={{ fontSize: 12, color: T.accent, fontWeight: 600, textDecoration: "none" }}>
                    Join →
                  </a>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <SectionLabel>Past · {past.length}</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {past.map((m) => (
          <Card key={m.id} accent={T.success}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 3 }}>{m.title}</div>
                <div style={{ fontSize: 12, color: T.textSec }}>
                  {fmtDate(m.starts_at)} · {fmtTime(m.starts_at)} – {fmtTime(m.ends_at)}
                </div>
              </div>
              <Tag color={T.success} bg={T.successBg}>Completed</Tag>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PageAssignments() {
  const [form, setForm] = useState({
    template_id: "", custom_title: "", description: "", instructions: "",
    category: "other", week_number: "", due_at: "", assignees: [],
  });

  const allMentees = POD.mentees.map((m) => ({ id: m.user_id, name: m.full_name }));
  const toggleAssignee = (id) =>
    setForm((f) => ({
      ...f, assignees: f.assignees.includes(id)
        ? f.assignees.filter((i) => i !== id)
        : [...f.assignees, id],
    }));

  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 800, color: T.text, marginBottom: 20 }}>Assignments</div>

      {/* Create assignment form */}
      <Card accent={T.accent} style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 14 }}>Push an assignment</div>

        <Select label="Use a template (optional)"
          value={form.template_id}
          onChange={(e) => setForm({ ...form, template_id: e.target.value })}>
          <option value="">— Start from scratch —</option>
          {ASSIGNMENT_TEMPLATES.map((t) => (
            <option key={t.id} value={t.id}>
              Week {t.week_number} · {t.title}
            </option>
          ))}
        </Select>

        <TextInput label="Title"
          placeholder="Assignment title"
          value={form.custom_title}
          onChange={(e) => setForm({ ...form, custom_title: e.target.value })} />
        <TextArea label="Description"
          placeholder="What is this assignment about?"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <TextArea label="Instructions (optional)"
          placeholder="Step-by-step guidance, format requirements, links…"
          value={form.instructions}
          onChange={(e) => setForm({ ...form, instructions: e.target.value })} />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <Select label="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {["reflection","research","creative","career","other"].map((c) => (
              <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </Select>
          <TextInput label="Week number" type="number" placeholder="7"
            value={form.week_number}
            onChange={(e) => setForm({ ...form, week_number: e.target.value })} />
          <TextInput label="Due date" type="datetime-local"
            value={form.due_at}
            onChange={(e) => setForm({ ...form, due_at: e.target.value })} />
        </div>

        <div style={{ marginBottom: 14 }}>
          <FieldLabel>Assign to</FieldLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {allMentees.map((m, i) => (
              <label key={m.id} style={{
                display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
                padding: "8px 10px", borderRadius: 8,
                background: form.assignees.includes(m.id) ? T.accentBg : T.cardHi,
              }}>
                <input type="checkbox" checked={form.assignees.includes(m.id)}
                  onChange={() => toggleAssignee(m.id)} />
                <Avatar name={m.name} size={24} index={i} />
                <span style={{ fontSize: 13, color: T.text }}>{m.name}</span>
              </label>
            ))}
          </div>
        </div>
        <Btn variant="primary">Push assignment</Btn>
      </Card>

      {/* Submission tracker */}
      <SectionLabel>Submission tracker</SectionLabel>
      <Card>
        {MENTEE_ASSIGNMENTS.map((ma, i) => (
          <div key={ma.id} style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 0", borderBottom: i < MENTEE_ASSIGNMENTS.length - 1 ? `1px solid ${T.border}` : "none",
          }}>
            <Avatar name={ma.mentee.full_name} size={28}
              index={POD.mentees.findIndex((m) => m.user_id === ma.mentee.user_id)} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 2 }}>
                {ma.assignment.title}
              </div>
              <div style={{ fontSize: 11, color: T.textSec }}>
                {ma.mentee.full_name} · Week {ma.assignment.week_number}
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
              {ma.is_submitted
                ? <Tag color={T.success} bg={T.successBg}>Submitted</Tag>
                : <Tag color={T.warning} bg={T.warningBg}>Pending</Tag>
              }
              {ma.is_submitted && (
                ma.is_checked
                  ? <Tag color={T.accent} bg={T.accentBg}>Reviewed</Tag>
                  : <Btn small variant="warning" onClick={() => {}}>Review</Btn>
              )}
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

const NAV = [
  { id: "cohort",      label: "Cohort",      icon: "🏛️" },
  { id: "pod",         label: "Pod",          icon: "👥" },
  { id: "checkins",    label: "Check-ins",    icon: "❤️" },
  { id: "schedule",    label: "Schedule",     icon: "📅" },
  { id: "assignments", label: "Assignments",  icon: "📝" },
];

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function MentorDashboard() {
  const [page,        setPage]        = useState("cohort");
  const [chatOpen,    setChatOpen]    = useState(false);
  const [chatChannel, setChatChannel] = useState(null);

  function openChat(channelId) { setChatChannel(channelId); setChatOpen(true); }

  return (
    <div style={{
      display: "flex", height: "100vh",
      fontFamily: "Inter, system-ui, sans-serif",
      background: T.bg, color: T.text,
    }}>
      {/* Sidebar */}
      <nav style={{
        width: 56, background: T.surface, borderRight: `1px solid ${T.border}`,
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "12px 0", gap: 2, flexShrink: 0,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, background: T.accentBg,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 16, marginBottom: 14,
        }}>✦</div>

        {NAV.map((item) => (
          <button key={item.id} title={item.label} onClick={() => setPage(item.id)} style={{
            width: 40, height: 40, borderRadius: 8, border: "none",
            background: page === item.id ? T.accentBg : "transparent",
            color: page === item.id ? "#a5b4fc" : T.textSec,
            fontSize: 16, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>{item.icon}</button>
        ))}

        <div style={{ marginTop: "auto" }}>
          <Avatar name={ME.full_name} size={32} index={0} />
        </div>
      </nav>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        {/* Topbar */}
        <header style={{
          height: 52, background: T.surface, borderBottom: `1px solid ${T.border}`,
          display: "flex", alignItems: "center", padding: "0 20px", gap: 12, flexShrink: 0,
        }}>
          <span style={{ flex: 1, fontSize: 15, fontWeight: 700, color: T.text }}>
            {NAV.find((n) => n.id === page)?.label}
          </span>
          <RoleBadge role="mentor" />
          <span style={{ fontSize: 13, color: T.textSec }}>{ME.full_name}</span>

          <button onClick={() => openChat("ch-001")} style={{
            padding: "5px 12px", borderRadius: 8, border: "none",
            background: T.accentBg, color: "#a5b4fc",
            fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}>💬 Messages</button>

          <Avatar name={ME.full_name} size={32} index={0} />
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {page === "cohort"      && <PageCohort openChat={openChat} />}
          {page === "pod"         && <PagePod openChat={openChat} />}
          {page === "checkins"    && <PageCheckIns />}
          {page === "schedule"    && <PageSchedule />}
          {page === "assignments" && <PageAssignments />}
        </main>
      </div>

      {chatOpen && (
        <ChatPanel
          onClose={() => setChatOpen(false)}
          initialChannel={chatChannel}
        />
      )}
    </div>
  );
}