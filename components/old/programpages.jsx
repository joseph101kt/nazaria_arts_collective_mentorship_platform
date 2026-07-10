/**
 * ProgramPages.jsx
 * Page-level components shared by PM and Associate dashboards.
 * Each export is a self-contained page. The `role` prop ("pm" | "associate")
 * gates a small number of PM-only actions (creating cohorts, deactivating
 * mentors) — everything else is identical between the two roles since
 * both need full visibility into the program.
 */

import { useState } from "react";
import {
  T, Avatar, RoleBadge, Tag, Btn, Card, SectionLabel, Divider,
  FieldLabel, TextInput, TextArea, Select, StatCard,
  fmtDate, daysUntil, TONE_COLOR,
} from "./shared";
import {
  COHORTS, PODS, MENTORS, MENTEES, ESCALATIONS,
  ASSIGNMENT_STATS_BY_COHORT, ASSIGNMENT_TEMPLATES, RESOURCES,
} from "./demoData";

// ─── Overview ─────────────────────────────────────────────────────────────────

export function PageOverview({ setPage, role }) {
  const activeCohort = COHORTS.find((c) => c.status === "active");
  const unreviewed = ESCALATIONS.filter((e) => e.escalation_status === "unreviewed");
  const stats = ASSIGNMENT_STATS_BY_COHORT[0];
  const pct = Math.round((stats.submitted / stats.total) * 100);

  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 800, color: T.text, marginBottom: 4 }}>
        Program overview
      </div>
      <div style={{ fontSize: 13, color: T.textSec, marginBottom: 20 }}>
        {role === "pm" ? "Program manager" : "Associate"} view · {COHORTS.length} cohorts ·{" "}
        {MENTORS.length} mentors · {MENTEES.length} mentees
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 20 }}>
        <StatCard label="Active cohort" value={activeCohort?.name || "—"}
          sub={activeCohort ? `Week ${activeCohort.week_number}/${activeCohort.total_weeks}` : ""} />
        <StatCard label="Unreviewed escalations" value={unreviewed.length}
          valueColor={unreviewed.length > 0 ? T.danger : T.success} />
        <StatCard label="Assignment completion" value={`${pct}%`}
          progress={pct} progressColor={pct >= 70 ? T.success : T.warning} />
        <StatCard label="Total mentors" value={MENTORS.length} sub={`${MENTEES.length} mentees`} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Recent escalations</span>
            <button onClick={() => setPage("escalations")} style={{
              fontSize: 11, color: T.accent, background: "none", border: "none",
              cursor: "pointer", fontWeight: 600,
            }}>View all →</button>
          </div>
          {ESCALATIONS.slice(0, 3).map((e) => (
            <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 10,
              padding: "8px 0", borderBottom: `1px solid ${T.border}` }}>
              <Avatar name={e.mentee.full_name} size={28}
                index={MENTEES.findIndex((m) => m.id === e.mentee.id)} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{e.mentee.full_name}</div>
                <div style={{ fontSize: 11, color: T.textSec }}>{e.pod} · {e.mentor.full_name}</div>
              </div>
              <StatusTag status={e.escalation_status} />
            </div>
          ))}
        </Card>

        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Mentor activity</span>
            <button onClick={() => setPage("mentors")} style={{
              fontSize: 11, color: T.accent, background: "none", border: "none",
              cursor: "pointer", fontWeight: 600,
            }}>View all →</button>
          </div>
          {MENTORS.map((m, i) => (
            <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10,
              padding: "8px 0", borderBottom: `1px solid ${T.border}` }}>
              <Avatar name={m.full_name} size={28} index={i} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{m.full_name}</div>
                <div style={{ fontSize: 11, color: T.textSec }}>{m.pod} · {m.mentee_count} mentees</div>
              </div>
              <Tag color={m.assignment_completion >= 70 ? T.success : T.warning}
                bg={m.assignment_completion >= 70 ? T.successBg : T.warningBg}>
                {m.assignment_completion}%
              </Tag>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ─── Status tag helper ─────────────────────────────────────────────────────────

function StatusTag({ status }) {
  const map = {
    unreviewed: { color: T.danger,  bg: T.dangerBg,  label: "Unreviewed" },
    reviewed:   { color: T.warning, bg: T.warningBg, label: "Reviewed" },
    actioned:   { color: T.success, bg: T.successBg, label: "Actioned" },
  };
  const s = map[status] || map.unreviewed;
  return <Tag color={s.color} bg={s.bg}>{s.label}</Tag>;
}

// ─── Cohorts ──────────────────────────────────────────────────────────────────

export function PageCohorts({ role }) {
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", program_year: "", start_date: "", end_date: "", description: "" });

  const STATUS_TAG = {
    active:    { color: T.success, bg: T.successBg, label: "● Active" },
    upcoming:  { color: T.accent,  bg: T.accentBg,  label: "Upcoming" },
    completed: { color: T.textSec, bg: T.cardHi,    label: "Completed" },
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: T.text }}>Cohorts</div>
        {role === "pm" && (
          <Btn variant="primary" onClick={() => setCreating(true)}>+ New cohort</Btn>
        )}
      </div>

      {creating && (
        <Card accent={T.accent} style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 14 }}>Create cohort</div>
          <TextInput label="Name" placeholder="e.g. Cohort 6"
            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <TextInput label="Start date" type="date"
              value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
            <TextInput label="End date" type="date"
              value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
          </div>
          <TextArea label="Description"
            value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="primary" onClick={() => setCreating(false)}>Create</Btn>
            <Btn variant="ghost" onClick={() => setCreating(false)}>Cancel</Btn>
          </div>
        </Card>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {COHORTS.map((c) => {
          const cohortPods = PODS.filter((p) => p.cohort_id === c.id);
          const status = STATUS_TAG[c.status];
          return (
            <Card key={c.id} accent={status.color}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 4 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: T.textSec }}>
                    {fmtDate(c.start_date)} – {fmtDate(c.end_date)} · {c.program_year}
                  </div>
                </div>
                <Tag color={status.color} bg={status.bg}>{status.label}</Tag>
              </div>
              {c.status === "active" && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.textSec, marginBottom: 4 }}>
                    <span>Week {c.week_number} of {c.total_weeks}</span>
                    <span>{Math.round((c.week_number / c.total_weeks) * 100)}%</span>
                  </div>
                  <div style={{ height: 4, background: T.cardHi, borderRadius: 2 }}>
                    <div style={{ height: "100%", borderRadius: 2, background: T.accent,
                      width: `${Math.round((c.week_number / c.total_weeks) * 100)}%` }} />
                  </div>
                </div>
              )}
              <Divider />
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {cohortPods.map((p) => (
                  <Tag key={p.id} color={T.textSec}>
                    {p.name} · {p.mentor} · {p.mentee_count} mentees
                  </Tag>
                ))}
                {cohortPods.length === 0 && (
                  <span style={{ fontSize: 12, color: T.textMut }}>No pods created yet</span>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── Escalations ──────────────────────────────────────────────────────────────

export function PageEscalations({ role }) {
  const [filter, setFilter] = useState("all");
  const [notes, setNotes] = useState({});

  const filtered = filter === "all"
    ? ESCALATIONS
    : ESCALATIONS.filter((e) => e.escalation_status === filter);

  const counts = {
    all: ESCALATIONS.length,
    unreviewed: ESCALATIONS.filter((e) => e.escalation_status === "unreviewed").length,
    reviewed: ESCALATIONS.filter((e) => e.escalation_status === "reviewed").length,
    actioned: ESCALATIONS.filter((e) => e.escalation_status === "actioned").length,
  };

  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 800, color: T.text, marginBottom: 4 }}>Escalations</div>
      <div style={{ fontSize: 13, color: T.textSec, marginBottom: 20 }}>
        Check-ins flagged by mentors across all cohorts
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["all", "unreviewed", "reviewed", "actioned"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "5px 12px", borderRadius: 20, border: "none", cursor: "pointer",
            background: filter === f ? T.accentBg : T.cardHi,
            color: filter === f ? "#a5b4fc" : T.textSec,
            fontSize: 12, fontWeight: 600, textTransform: "capitalize",
          }}>{f} ({counts[f]})</button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map((e) => {
          const tone = TONE_COLOR[e.emotional_tone] || TONE_COLOR.okay;
          const accentColor = e.escalation_status === "unreviewed" ? T.danger
            : e.escalation_status === "reviewed" ? T.warning : T.success;
          return (
            <Card key={e.id} accent={accentColor}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                <Avatar name={e.mentee.full_name} size={40}
                  index={MENTEES.findIndex((m) => m.id === e.mentee.id)} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{e.mentee.full_name}</span>
                    <RoleBadge role="mentee" />
                    <Tag color={tone.text} bg={tone.bg}>{e.emotional_tone}</Tag>
                    <StatusTag status={e.escalation_status} />
                  </div>
                  <div style={{ fontSize: 12, color: T.textSec }}>
                    {e.pod} · {e.cohort} · Flagged by {e.mentor.full_name} · {fmtDate(e.created_at)}
                  </div>
                </div>
              </div>

              <div style={{
                fontSize: 13, color: T.text, lineHeight: 1.6,
                padding: "10px 12px", background: T.cardHi, borderRadius: 8, marginBottom: 10,
              }}>
                {e.escalation_reason}
              </div>

              {e.associate_note && (
                <div style={{
                  fontSize: 12, color: T.success, lineHeight: 1.6,
                  padding: "10px 12px", background: T.successBg, borderRadius: 8, marginBottom: 10,
                }}>
                  <span style={{ fontWeight: 700 }}>Resolution note: </span>{e.associate_note}
                  {e.actioned_by && <span style={{ opacity: 0.7 }}> — {e.actioned_by}</span>}
                </div>
              )}

              {e.escalation_status !== "actioned" && (
                <div>
                  <TextArea
                    label={e.escalation_status === "unreviewed" ? "Add a note and mark reviewed" : "Add resolution note"}
                    placeholder="What action is being taken?"
                    value={notes[e.id] || ""}
                    onChange={(ev) => setNotes({ ...notes, [e.id]: ev.target.value })}
                  />
                  <div style={{ display: "flex", gap: 8 }}>
                    {e.escalation_status === "unreviewed" && (
                      <Btn variant="warning">Mark reviewed</Btn>
                    )}
                    {e.escalation_status === "reviewed" && (
                      <Btn variant="success">Mark actioned</Btn>
                    )}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── Mentors ──────────────────────────────────────────────────────────────────

export function PageMentors({ role }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 800, color: T.text, marginBottom: 20 }}>Mentors</div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {MENTORS.map((m, i) => {
          const mentorMentees = MENTEES.filter((mt) => mt.mentor === m.full_name);
          return (
            <Card key={m.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar name={m.full_name} size={40} index={i} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: T.text }}>{m.full_name}</span>
                    <RoleBadge role="mentor" />
                    <Tag color={T.textSec}>{m.pod} · {m.cohort}</Tag>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, maxWidth: 160, height: 4, background: T.cardHi, borderRadius: 2 }}>
                      <div style={{ height: "100%", borderRadius: 2,
                        background: m.assignment_completion >= 70 ? T.success : T.warning,
                        width: `${m.assignment_completion}%` }} />
                    </div>
                    <span style={{ fontSize: 11, color: T.textSec }}>
                      {m.assignment_completion}% pod completion
                    </span>
                  </div>
                </div>
                <Btn small variant="ghost"
                  onClick={() => setExpanded(expanded === m.id ? null : m.id)}>
                  {expanded === m.id ? "Less" : `${m.mentee_count} mentees`}
                </Btn>
              </div>

              {expanded === m.id && (
                <div style={{ marginTop: 12 }}>
                  <Divider />
                  {mentorMentees.map((mt, j) => {
                    const tone = TONE_COLOR[mt.last_checkin_tone] || TONE_COLOR.okay;
                    return (
                      <div key={mt.id} style={{
                        display: "flex", alignItems: "center", gap: 10, padding: "8px 0",
                        borderBottom: j < mentorMentees.length - 1 ? `1px solid ${T.border}` : "none",
                      }}>
                        <Avatar name={mt.full_name} size={26}
                          index={MENTEES.findIndex((x) => x.id === mt.id)} />
                        <span style={{ flex: 1, fontSize: 12, color: T.text }}>{mt.full_name}</span>
                        <Tag color={tone.text} bg={tone.bg}>{mt.last_checkin_tone}</Tag>
                        <Tag color={T.textSec}>{mt.assignment_completion}%</Tag>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── Assignments (program-wide) ────────────────────────────────────────────────

export function PageAssignments({ role }) {
  const [creating, setCreating] = useState(false);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: T.text }}>Assignment bank</div>
        <Btn variant="primary" onClick={() => setCreating(true)}>+ New template</Btn>
      </div>

      {creating && (
        <Card accent={T.accent} style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 14 }}>New assignment template</div>
          <TextInput label="Title" placeholder="Assignment title" />
          <TextArea label="Description" placeholder="What is this assignment about?" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Select label="Category" defaultValue="other">
              {["reflection","research","creative","career","other"].map((c) => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </Select>
            <TextInput label="Week number" type="number" placeholder="7" />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="primary" onClick={() => setCreating(false)}>Save template</Btn>
            <Btn variant="ghost" onClick={() => setCreating(false)}>Cancel</Btn>
          </div>
        </Card>
      )}

      <SectionLabel>Templates · {ASSIGNMENT_TEMPLATES.length}</SectionLabel>
      <Card style={{ marginBottom: 24 }}>
        {ASSIGNMENT_TEMPLATES.map((a, i) => (
          <div key={a.id} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "10px 0",
            borderBottom: i < ASSIGNMENT_TEMPLATES.length - 1 ? `1px solid ${T.border}` : "none",
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{a.title}</div>
              <div style={{ fontSize: 11, color: T.textSec, marginTop: 2 }}>
                Week {a.week_number} · {a.category} · by {a.created_by}
              </div>
            </div>
            <Tag color={a.is_active ? T.success : T.textMut}
              bg={a.is_active ? T.successBg : T.cardHi}>
              {a.is_active ? "Active" : "Inactive"}
            </Tag>
          </div>
        ))}
      </Card>

      <SectionLabel>Resources</SectionLabel>
      <Card>
        {RESOURCES.map((r, i) => (
          <div key={r.id} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "10px 0",
            borderBottom: i < RESOURCES.length - 1 ? `1px solid ${T.border}` : "none",
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{r.title}</div>
              <div style={{ fontSize: 11, color: T.textSec, marginTop: 2 }}>
                {r.type} · by {r.created_by}{r.week_number ? ` · Week ${r.week_number}` : ""}
              </div>
            </div>
            <Tag color={T.textSec}>visible to {r.visible_to}</Tag>
          </div>
        ))}
      </Card>
    </div>
  );
}