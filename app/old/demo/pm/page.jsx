/**
 * PMDashboard.jsx
 * Program Manager dashboard. Composes the shared page components from
 * ProgramPages.jsx — does not redefine any page logic itself.
 *
 * PM-specific: can create cohorts, create assignment templates,
 * sees the full mentor roster with management actions.
 */
"use client";

import { useState } from "react";
import { T, Avatar, RoleBadge } from "@/components/shared";
import { PageOverview, PageCohorts, PageEscalations, PageMentors, PageAssignments } from "@/components/programpages";
  import ChatPanel from "@/components/chat";
import { ME_PM, ESCALATIONS } from "@/components/demoData";

const NAV = [
  { id: "overview",    label: "Overview",    icon: "📊" },
  { id: "cohorts",     label: "Cohorts",      icon: "🏛️" },
  { id: "escalations", label: "Escalations",  icon: "🚨" },
  { id: "mentors",     label: "Mentors",      icon: "🧑‍🏫" },
];

export default function PMDashboard() {
  const [page, setPage] = useState("overview");
  const [chatOpen, setChatOpen] = useState(false);
  const [chatChannel, setChatChannel] = useState(null);

  const unreviewedCount = ESCALATIONS.filter((e) => e.escalation_status === "unreviewed").length;

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
            width: 40, height: 40, borderRadius: 8, border: "none", position: "relative",
            background: page === item.id ? T.accentBg : "transparent",
            color: page === item.id ? "#a5b4fc" : T.textSec,
            fontSize: 16, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {item.icon}
            {item.id === "escalations" && unreviewedCount > 0 && (
              <span style={{
                position: "absolute", top: 2, right: 2, width: 7, height: 7,
                borderRadius: "50%", background: T.danger,
              }} />
            )}
          </button>
        ))}

        <div style={{ marginTop: "auto" }}>
          <Avatar name={ME_PM.full_name} size={32} index={5} />
        </div>
      </nav>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <header style={{
          height: 52, background: T.surface, borderBottom: `1px solid ${T.border}`,
          display: "flex", alignItems: "center", padding: "0 20px", gap: 12, flexShrink: 0,
        }}>
          <span style={{ flex: 1, fontSize: 15, fontWeight: 700, color: T.text }}>
            {NAV.find((n) => n.id === page)?.label}
          </span>
          <RoleBadge role="pm" />
          <span style={{ fontSize: 13, color: T.textSec }}>{ME_PM.full_name}</span>

          <button onClick={() => openChat("ch-staff")} style={{
            padding: "5px 12px", borderRadius: 8, border: "none",
            background: T.accentBg, color: "#a5b4fc",
            fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}>💬 Messages</button>

          <Avatar name={ME_PM.full_name} size={32} index={5} />
        </header>

        <main style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {page === "overview"    && <PageOverview setPage={setPage} role="pm" />}
          {page === "cohorts"     && <PageCohorts role="pm" />}
          {page === "escalations" && <PageEscalations role="pm" />}
          {page === "mentors"     && <PageMentors role="pm" />}
          {page === "assignments" && <PageAssignments role="pm" />}
        </main>
      </div>

      {chatOpen && (
        <ChatPanel onClose={() => setChatOpen(false)} initialChannel={chatChannel} viewerRole="pm" />
      )}
    </div>
  );
}

