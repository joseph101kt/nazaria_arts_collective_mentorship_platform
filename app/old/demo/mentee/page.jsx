/**
 * MenteeDashboard.jsx
 * Demo version — all data hardcoded, no external dependencies.
 * Schema-accurate: every field maps to a real table/column.
 */
"use client";
import { useState } from "react";


// ─── Demo data ────────────────────────────────────────────────────────────────

const ME = {
  id: "u-001", full_name: "Arjun Mehta", email: "arjun.mehta@example.com", role: "mentee",
};

const COHORT = {
  id: "c-001", name: "Cohort 4", program_year: 2024,
  start_date: "2024-05-01", end_date: "2024-07-31",
  status: "active", description: "A 12-week mentorship program for emerging tech talent.",
  week_number: 7, total_weeks: 12,
};

const POD = {
  id: "pod-001", name: "Pod B", skill_level: "intermediate",
  members: [
    { user_id: "u-010", full_name: "Priya Sharma", role: "mentor", cohort_role: "mentor", bio: "Senior SWE at Google, 8 years experience. Specialises in distributed systems and backend architecture." },
    { user_id: "u-001", full_name: "Arjun Mehta",  role: "mentee", cohort_role: "mentee", bio: "CS undergrad at BITS Pilani. Interested in backend systems and product development.", is_self: true },
    { user_id: "u-002", full_name: "Riya Kapoor",  role: "mentee", cohort_role: "mentee", bio: "Final year at IIT Delhi. Working on ML projects and data pipelines." },
    { user_id: "u-003", full_name: "Sahil Nair",   role: "mentee", cohort_role: "mentee", bio: "Fresher from NIT Trichy. Interested in frontend and UI engineering." },
    { user_id: "u-004", full_name: "Dev Joshi",    role: "mentee", cohort_role: "mentee", bio: "2nd year at Delhi University. Exploring data science and analytics." },
  ],
};

const ASSIGNMENTS = [
  {
    id: "ma-001", due_at: "2024-07-10T23:59:00Z", pushed_at: "2024-06-10T10:00:00Z",
    is_submitted: false, submitted_at: null, is_checked: false, checked_at: null,
    assignment: {
      id: "a-001", title: "System design — URL shortener",
      description: "Design a scalable URL shortening service from scratch.",
      instructions: "Write a 1-page design doc covering: data model, API endpoints, scaling approach. Use the linked template.",
      category: "research", week_number: 7,
      links: [
        { id: "l-001", title: "Design doc template", link_type: "template", url: "#" },
        { id: "l-002", title: "Reference: System design primer", link_type: "document", url: "#" },
      ],
    },
    submission_links: [],
  },
  {
    id: "ma-002", due_at: "2024-07-01T23:59:00Z", pushed_at: "2024-06-17T10:00:00Z",
    is_submitted: false, submitted_at: null, is_checked: false, checked_at: null,
    assignment: {
      id: "a-002", title: "Career reflection — 6-month goals",
      description: "Reflect on where you want to be in 6 months and what it will take.",
      instructions: "Write 300–500 words. Be specific about milestones and who can help.",
      category: "reflection", week_number: 7,
      links: [],
    },
    submission_links: [],
  },
  {
    id: "ma-003", due_at: "2024-06-25T23:59:00Z", pushed_at: "2024-06-01T10:00:00Z",
    is_submitted: true, submitted_at: "2024-06-24T18:42:00Z", is_checked: true, checked_at: "2024-06-25T09:00:00Z",
    assignment: {
      id: "a-003", title: "Data analysis — sales dataset",
      description: "Explore and summarise a provided sales dataset using Python or Excel.",
      instructions: null, category: "research", week_number: 5,
      links: [
        { id: "l-003", title: "Sales dataset (CSV)", link_type: "file", url: "#" },
      ],
    },
    submission_links: [
      { id: "l-010", title: "My analysis notebook", link_type: "file", url: "#" },
    ],
  },
];

const NOTIFICATIONS = [
  { id: "n-001", type: "meeting",              title: "Session tomorrow",         body: "Your 1:1 with Priya Sharma is tomorrow at 3:00 PM.", created_at: "2024-06-26T08:00:00Z", read_at: null, meta: { meeting_id: "m-001" } },
  { id: "n-002", type: "assignment_due",       title: "Assignment due in 5 days", body: '"Career reflection" is due Jul 1. Submit before the deadline.', created_at: "2024-06-24T08:00:00Z", read_at: null, meta: { assignment_id: "ma-002" } },
  { id: "n-003", type: "reminder",             title: "New resource available",   body: 'Week 7 guide "System design primer" has been shared with your pod.', created_at: "2024-06-24T07:00:00Z", read_at: null, meta: {} },
  { id: "n-004", type: "assignment_submitted", title: "Assignment reviewed",      body: 'Priya reviewed your "Data analysis — sales dataset" submission.', created_at: "2024-06-25T09:00:00Z", read_at: "2024-06-25T11:00:00Z", meta: { assignment_id: "ma-003" } },
  { id: "n-005", type: "meeting",              title: "Meeting notes available",  body: "Notes from your Jun 20 session with Priya are now available.", created_at: "2024-06-20T11:00:00Z", read_at: "2024-06-21T09:00:00Z", meta: { meeting_id: "m-010" } },
];

const CHAT_CHANNELS = [
  { id: "ch-001", name: "Cohort 4",            type: "cohort",     description: "Everyone in the cohort" },
  { id: "ch-002", name: "Pod B",               type: "pod_all",    description: "Pod B — mentors & mentees" },
  { id: "ch-003", name: "Pod B (mentees only)",type: "pod_mentee", description: "Mentees in Pod B only" },
  { id: "ch-004", name: "Priya Sharma",        type: "direct",     description: "Direct · Mentor" },
];

const DEMO_MESSAGES = {
  "ch-001": [
    { id: "msg-1", sender: { full_name: "Neha Singh",   role: "associate" }, body: "Welcome to week 7 everyone! Big week for submissions.", created_at: "2024-06-24T09:00:00Z" },
    { id: "msg-2", sender: { full_name: "Arjun Mehta",  role: "mentee", is_self: true }, body: "Thanks! Is the design doc template updated for this week?", created_at: "2024-06-24T09:04:00Z" },
    { id: "msg-3", sender: { full_name: "Priya Sharma", role: "mentor" }, body: "Yes, updated yesterday. Check the Week 7 resources.", created_at: "2024-06-24T09:07:00Z" },
  ],
  "ch-002": [
    { id: "msg-4", sender: { full_name: "Priya Sharma", role: "mentor" }, body: "Great session today team. Arjun, solid questions on indexing.", created_at: "2024-06-20T11:30:00Z" },
    { id: "msg-5", sender: { full_name: "Riya Kapoor",  role: "mentee" }, body: "Agreed, really good session!", created_at: "2024-06-20T11:35:00Z" },
    { id: "msg-6", sender: { full_name: "Arjun Mehta",  role: "mentee", is_self: true }, body: "Thanks Priya! That indexing explanation finally clicked.", created_at: "2024-06-20T11:38:00Z" },
  ],
  "ch-003": [
    { id: "msg-7", sender: { full_name: "Sahil Nair",  role: "mentee" }, body: "Anyone else struggling with the system design assignment?", created_at: "2024-06-23T14:00:00Z" },
    { id: "msg-8", sender: { full_name: "Dev Joshi",   role: "mentee" }, body: "Yes! The scaling part especially. Let's pair up?", created_at: "2024-06-23T14:10:00Z" },
    { id: "msg-9", sender: { full_name: "Arjun Mehta", role: "mentee", is_self: true }, body: "I'm in. Saturday works for me.", created_at: "2024-06-23T14:15:00Z" },
  ],
  "ch-004": [
    { id: "msg-10", sender: { full_name: "Priya Sharma", role: "mentor" }, body: "Good progress this week. How are you feeling about the system design assignment?", created_at: "2024-06-22T15:00:00Z" },
    { id: "msg-11", sender: { full_name: "Arjun Mehta",  role: "mentee", is_self: true }, body: "A bit uncertain on the scaling piece. Can we cover it in our 1:1?", created_at: "2024-06-22T15:20:00Z" },
    { id: "msg-12", sender: { full_name: "Priya Sharma", role: "mentor" }, body: "Absolutely, added it to our agenda for tomorrow.", created_at: "2024-06-22T15:22:00Z" },
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

const NOTIF_META = {
  meeting:              { icon: "📅", color: "#6366f1" },
  assignment_due:       { icon: "⏰", color: "#f59e0b" },
  assignment_submitted: { icon: "✅", color: "#10b981" },
  reminder:             { icon: "🔔", color: "#6366f1" },
};

const LINK_ICON = { file: "📎", image: "🖼️", document: "📄", template: "📋", other: "🔗" };

const CAT_COLOR = {
  reflection: "#818cf8", research: "#34d399", creative: "#f472b6",
  career: "#fb923c", other: "#94a3b8",
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
  };
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: small ? "4px 10px" : "7px 14px",
      borderRadius: 8, fontSize: small ? 11 : 13, fontWeight: 600,
      cursor: "pointer", border: "none", width: full ? "100%" : undefined,
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

// ─── Chat panel ───────────────────────────────────────────────────────────────

function ChatPanel({ channels, messages, onClose, initialChannel }) {
  const [activeId, setActiveId] = useState(initialChannel || channels[0]?.id);
  const [input, setInput] = useState("");
  const msgs = messages[activeId] || [];
  const channel = channels.find((c) => c.id === activeId);

  const CH_ICON = { direct: "👤", cohort: "🏛️", pod_all: "👥", pod_mentee: "🙋" };

  return (
    <div style={{
      position: "fixed", top: 0, right: 0, height: "100%", width: 380,
      background: T.surface, borderLeft: `1px solid ${T.border}`,
      zIndex: 60, display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        padding: "14px 16px", borderBottom: `1px solid ${T.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>
            {channel?.name || "Messages"}
          </div>
          <div style={{ fontSize: 11, color: T.textSec, marginTop: 1 }}>
            {channel?.description}
          </div>
        </div>
        <button onClick={onClose} style={{
          background: "none", border: "none", color: T.textSec, fontSize: 18, cursor: "pointer",
        }}>✕</button>
      </div>

      {/* Channel list */}
      <div style={{
        display: "flex", flexDirection: "column", gap: 1, padding: "8px",
        borderBottom: `1px solid ${T.border}`, flexShrink: 0,
      }}>
        {channels.map((ch) => (
          <button key={ch.id} onClick={() => setActiveId(ch.id)} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
            borderRadius: 8, border: "none", cursor: "pointer", textAlign: "left",
            background: activeId === ch.id ? T.accentBg : "transparent",
            color: activeId === ch.id ? "#a5b4fc" : T.textSec,
          }}>
            <span style={{ fontSize: 14 }}>{CH_ICON[ch.type] || "💬"}</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{ch.name}</div>
              <div style={{ fontSize: 10, opacity: 0.7 }}>{ch.description}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: "auto", padding: "14px", display: "flex",
        flexDirection: "column", gap: 14,
      }}>
        {msgs.map((m) => (
          <div key={m.id} style={{
            display: "flex", gap: 8,
            flexDirection: m.sender.is_self ? "row-reverse" : "row",
          }}>
            {!m.sender.is_self && (
              <Avatar name={m.sender.full_name} size={28}
                index={POD.members.findIndex((p) => p.full_name === m.sender.full_name)} />
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
          placeholder="Type a message…" style={{
            flex: 1, padding: "8px 12px", borderRadius: 8, fontSize: 13,
            background: T.cardHi, border: `1px solid ${T.border}`, color: T.text, outline: "none",
          }} />
        <Btn variant="primary" onClick={() => setInput("")}>Send</Btn>
      </div>
    </div>
  );
}

// ─── Notification sidebar ─────────────────────────────────────────────────────

function NotifSidebar({ open, onClose, onGoToAssignment }) {
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const unread = notifs.filter((n) => !n.read_at).length;

  const markRead = (id) =>
    setNotifs((p) => p.map((n) => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
  const markAll = () =>
    setNotifs((p) => p.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() })));

  return (
    <>
      {open && (
        <div onClick={onClose} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 49,
        }} />
      )}
      <div style={{
        position: "fixed", top: 0, right: 0, height: "100%", width: 340,
        background: T.surface, borderLeft: `1px solid ${T.border}`, zIndex: 50,
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.2s ease", display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{
          padding: "14px 16px", borderBottom: `1px solid ${T.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Notifications</span>
            {unread > 0 && (
              <span style={{
                padding: "1px 7px", borderRadius: 10,
                background: T.accent, color: "#fff", fontSize: 11, fontWeight: 700,
              }}>{unread}</span>
            )}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {unread > 0 && (
              <button onClick={markAll} style={{
                fontSize: 11, color: T.accent, background: "none",
                border: "none", cursor: "pointer", fontWeight: 600,
              }}>Mark all read</button>
            )}
            <button onClick={onClose} style={{
              background: "none", border: "none", color: T.textSec,
              fontSize: 18, cursor: "pointer",
            }}>✕</button>
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {notifs.map((n) => {
            const meta = NOTIF_META[n.type] || NOTIF_META.reminder;
            const isAssignment = n.type === "assignment_due" || n.type === "assignment_submitted";
            return (
              <div key={n.id} style={{
                padding: "13px 16px", borderBottom: `1px solid ${T.border}`,
                borderLeft: n.read_at ? "3px solid transparent" : `3px solid ${meta.color}`,
                background: n.read_at ? T.surface : T.card,
              }}>
                <div style={{ display: "flex", gap: 10 }}>
                  <span style={{ fontSize: 18, marginTop: 1 }}>{meta.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: 13, fontWeight: n.read_at ? 500 : 700,
                      color: T.text, marginBottom: 3,
                    }}>{n.title}</div>
                    <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.5, marginBottom: 8 }}>
                      {n.body}
                    </div>
                    {/* Action buttons */}
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {isAssignment && n.meta.assignment_id && (
                        <Btn small variant="ghost" onClick={() => {
                          onGoToAssignment(n.meta.assignment_id);
                          markRead(n.id);
                          onClose();
                        }}>Go to assignment →</Btn>
                      )}
                      {!n.read_at && (
                        <Btn small variant="ghost" onClick={() => markRead(n.id)}>
                          Mark read
                        </Btn>
                      )}
                    </div>
                    <div style={{ fontSize: 10, color: T.textMut, marginTop: 6 }}>
                      {fmtDate(n.created_at)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ─── Assignment card ──────────────────────────────────────────────────────────

function AssignmentCard({ ma }) {
  const [expanded, setExpanded] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitUrl, setSubmitUrl] = useState("");
  const [submitNote, setSubmitNote] = useState("");

  const days = daysUntil(ma.due_at);
  const catColor = CAT_COLOR[ma.assignment.category] || T.textSec;
  const accentColor = ma.is_submitted
    ? T.success
    : days <= 3 ? T.danger
    : days <= 7 ? T.warning
    : T.accent;

  return (
    <Card accent={accentColor} style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>
              {ma.assignment.title}
            </span>
            <Tag color={catColor}>{ma.assignment.category}</Tag>
            {ma.assignment.week_number && (
              <Tag color={T.textSec}>Week {ma.assignment.week_number}</Tag>
            )}
          </div>
          <div style={{ fontSize: 12, color: T.textSec }}>{ma.assignment.description}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5, flexShrink: 0 }}>
          {ma.is_submitted ? (
            <Tag color={T.success} bg={T.successBg}>✓ Submitted</Tag>
          ) : (
            <Tag color={accentColor}
              bg={days <= 3 ? T.dangerBg : days <= 7 ? T.warningBg : T.accentBg}>
              {days > 0 ? `Due in ${days}d` : "Overdue"}
            </Tag>
          )}
          {ma.is_checked && <Tag color={T.accent} bg={T.accentBg}>Reviewed</Tag>}
        </div>
      </div>

      <button onClick={() => setExpanded((e) => !e)} style={{
        marginTop: 10, fontSize: 11, color: T.accent, background: "none",
        border: "none", cursor: "pointer", fontWeight: 600, padding: 0,
      }}>
        {expanded ? "▲ Hide details" : "▼ View details"}
      </button>

      {expanded && (
        <div style={{ marginTop: 12 }}>
          {ma.assignment.instructions && (
            <div style={{
              fontSize: 12, color: T.textSec, lineHeight: 1.6,
              padding: "10px 12px", background: T.cardHi, borderRadius: 8, marginBottom: 12,
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.textMut, marginBottom: 4 }}>INSTRUCTIONS</div>
              {ma.assignment.instructions}
            </div>
          )}

          {ma.assignment.links.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.textMut, marginBottom: 6 }}>PROVIDED FILES</div>
              {ma.assignment.links.map((l) => (
                <a key={l.id} href={l.url} target="_blank" rel="noreferrer" style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "7px 10px",
                  background: T.cardHi, borderRadius: 8, textDecoration: "none",
                  color: T.text, fontSize: 12, fontWeight: 500, marginBottom: 6,
                }}>
                  <span>{LINK_ICON[l.link_type] || "🔗"}</span>
                  <span style={{ flex: 1 }}>{l.title}</span>
                  <span style={{ fontSize: 10, color: T.textMut }}>{l.link_type}</span>
                </a>
              ))}
            </div>
          )}

          <Divider />

          {ma.is_submitted ? (
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.textMut, marginBottom: 6 }}>YOUR SUBMISSION</div>
              {ma.submission_links.map((l) => (
                <a key={l.id} href={l.url} target="_blank" rel="noreferrer" style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "7px 10px",
                  background: T.successBg, borderRadius: 8, textDecoration: "none",
                  color: T.success, fontSize: 12, fontWeight: 500, marginBottom: 6,
                }}>
                  <span>{LINK_ICON[l.link_type] || "🔗"}</span>
                  <span>{l.title}</span>
                </a>
              ))}
              <div style={{ fontSize: 11, color: T.textSec }}>
                Submitted {fmtDate(ma.submitted_at)}
                {ma.is_checked ? " · Reviewed ✓" : " · Awaiting review"}
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.textMut, marginBottom: 10 }}>SUBMIT ASSIGNMENT</div>
              {!submitting ? (
                <Btn variant="primary" onClick={() => setSubmitting(true)}>Submit work</Btn>
              ) : (
                <div>
                  <TextInput
                    label="Link to your work (Google Doc, GitHub, Drive…)"
                    placeholder="https://…"
                    value={submitUrl}
                    onChange={(e) => setSubmitUrl(e.target.value)}
                  />
                  <TextArea
                    label="Note to your mentor (optional)"
                    placeholder="Anything you want them to know…"
                    value={submitNote}
                    onChange={(e) => setSubmitNote(e.target.value)}
                  />
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn variant="primary" onClick={() => setSubmitting(false)}>Submit</Btn>
                    <Btn variant="ghost" onClick={() => setSubmitting(false)}>Cancel</Btn>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

// ─── Pages ────────────────────────────────────────────────────────────────────

function PageCohort({ openChat }) {
  const progress = Math.round((COHORT.week_number / COHORT.total_weeks) * 100);
  const r = 28;
  const circ = 2 * Math.PI * r;

  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 800, color: T.text, marginBottom: 4 }}>{COHORT.name}</div>
      <div style={{ fontSize: 13, color: T.textSec, marginBottom: 20 }}>
        {new Date(COHORT.start_date).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
        {" – "}
        {new Date(COHORT.end_date).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
      </div>

      <Card accent={T.accent}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1, paddingRight: 20 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
              <Tag color={T.success} bg={T.successBg}>● Active</Tag>
              <Tag color={T.textSec}>Year {COHORT.program_year}</Tag>
              <Tag color={T.textSec}>{COHORT.total_weeks} weeks</Tag>
              <Tag color={T.accent} bg={T.accentBg}>Week {COHORT.week_number}</Tag>
            </div>
            {COHORT.description && (
              <div style={{ fontSize: 13, color: T.textSec, lineHeight: 1.7, marginBottom: 16 }}>
                {COHORT.description}
              </div>
            )}
            <Btn variant="primary" onClick={() => openChat("ch-001")}>
              💬 Cohort chat
            </Btn>
          </div>

        </div>
      </Card>
    </div>
  );
}

function PagePod({ openChat }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 800, color: T.text, marginBottom: 4 }}>{POD.name}</div>
      <div style={{ fontSize: 13, color: T.textSec, marginBottom: 20 }}>
        {COHORT.name} · {POD.skill_level} level · {POD.members.length} members
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        <Btn variant="primary"  onClick={() => openChat("ch-002")}>💬 Pod chat (with mentor)</Btn>
        <Btn variant="ghost"    onClick={() => openChat("ch-003")}>💬 Mentee-only chat</Btn>
      </div>

      <SectionLabel>Members</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {POD.members.map((m, i) => (
          <Card key={m.user_id}
            accent={m.cohort_role === "mentor" ? T.accent : m.is_self ? T.success : undefined}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar name={m.full_name} size={40} index={i} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{m.full_name}</span>
                  {m.is_self && <span style={{ fontSize: 11, color: T.success }}>(you)</span>}
                  <RoleBadge role={m.cohort_role} />
                </div>
                {expanded === m.user_id && (
                  <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.6, marginTop: 6 }}>
                    {m.bio}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                <Btn small variant="ghost"
                  onClick={() => setExpanded(expanded === m.user_id ? null : m.user_id)}>
                  {expanded === m.user_id ? "Less" : "Details"}
                </Btn>
                {!m.is_self && (
                  <Btn small variant="primary" onClick={() => openChat("ch-004")}>
                    Chat
                  </Btn>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PageAssignments({ highlightId }) {
  const pending   = ASSIGNMENTS.filter((a) => !a.is_submitted);
  const submitted = ASSIGNMENTS.filter((a) => a.is_submitted);

  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 800, color: T.text, marginBottom: 20 }}>Assignments</div>

      <SectionLabel>Pending · {pending.length}</SectionLabel>
      {pending.length === 0
        ? <div style={{ fontSize: 13, color: T.textSec, marginBottom: 20 }}>All caught up!</div>
        : pending.map((ma) => <AssignmentCard key={ma.id} ma={ma} />)
      }

      <div style={{ marginTop: 20 }} />
      <SectionLabel>Submitted · {submitted.length}</SectionLabel>
      {submitted.map((ma) => <AssignmentCard key={ma.id} ma={ma} />)}
    </div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

const NAV = [
  { id: "cohort",      label: "Cohort",     icon: "🏛️" },
  { id: "pod",         label: "Pod",         icon: "👥" },
  { id: "assignments", label: "Assignments", icon: "📝" },
];

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function MenteeDashboard() {
  const [page,        setPage]        = useState("cohort");
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [chatOpen,    setChatOpen]    = useState(false);
  const [chatChannel, setChatChannel] = useState(null);
  const [highlight,   setHighlight]   = useState(null);

  const unread = NOTIFICATIONS.filter((n) => !n.read_at).length;

  function openChat(channelId) { setChatChannel(channelId); setChatOpen(true); }

  function goToAssignment(id) { setPage("assignments"); setHighlight(id); }

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
          <Avatar name={ME.full_name} size={32} index={3} />
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

          <button onClick={() => setChatOpen(true)} style={{
            padding: "5px 12px", borderRadius: 8, border: "none",
            background: T.accentBg, color: "#a5b4fc",
            fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}>💬 Messages</button>

          <button onClick={() => setNotifOpen(true)} aria-label="Notifications" style={{
            position: "relative", width: 36, height: 36, borderRadius: 8,
            border: "none", background: "transparent", cursor: "pointer",
            fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
            color: unread > 0 ? T.accent : T.textSec,
          }}>
            🔔
            {unread > 0 && (
              <span style={{
                position: "absolute", top: 5, right: 5, width: 8, height: 8,
                borderRadius: "50%", background: T.danger, border: `2px solid ${T.surface}`,
              }} />
            )}
          </button>

          <Avatar name={ME.full_name} size={32} index={3} />
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {page === "cohort"      && <PageCohort openChat={openChat} />}
          {page === "pod"         && <PagePod openChat={openChat} />}
          {page === "assignments" && <PageAssignments highlightId={highlight} />}
        </main>
      </div>

      <NotifSidebar
        open={notifOpen}
        onClose={() => setNotifOpen(false)}
        onGoToAssignment={goToAssignment}
      />

      {chatOpen && (
        <ChatPanel
          channels={CHAT_CHANNELS}
          messages={DEMO_MESSAGES}
          onClose={() => setChatOpen(false)}
          initialChannel={chatChannel}
        />
      )}
    </div>
  );
}