/**
 * AssociateDashboard.jsx
 * Associate dashboard. Composes the same shared page components as
 * PMDashboard.jsx from ProgramPages.jsx — no page logic is duplicated.
 *
 * Associate-specific: escalation triage is the default landing page
 * (associates are the primary reviewers), no cohort-creation action,
 * no assignment-template creation — read/track only.
 */
"use client";

import { useState } from "react";
import { T, Avatar, RoleBadge } from "@/components/old/shared";
import { PageOverview, PageCohorts, PageEscalations, PageMentors, PageAssignments } from "@/components/old/programpages";
import ChatPanel from "@/components/old/chat";
import { ME_ASSOCIATE, ESCALATIONS } from "@/components/old/demoData";

const NAV = [
  { id: "escalations", label: "Escalations",  icon: "🚨" },
  { id: "overview",    label: "Overview",     icon: "📊" },
  { id: "cohorts",     label: "Cohorts",       icon: "🏛️" },
  { id: "mentors",     label: "Mentors",       icon: "🧑‍🏫" },
];

export default function AssociateDashboard() {
  // Associates land on Escalations by default — that's their primary job
  const [page, setPage] = useState("escalations");
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
          width: 32, height: 32, borderRadius: 8, background: T.warningBg,
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
          <Avatar name={ME_ASSOCIATE.full_name} size={32} index={2} />
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
          {unreviewedCount > 0 && page !== "escalations" && (
            <span style={{
              fontSize: 11, color: T.danger, background: T.dangerBg,
              padding: "3px 8px", borderRadius: 4, fontWeight: 600,
            }}>
              {unreviewedCount} unreviewed escalation{unreviewedCount > 1 ? "s" : ""}
            </span>
          )}
          <RoleBadge role="associate" />
          <span style={{ fontSize: 13, color: T.textSec }}>{ME_ASSOCIATE.full_name}</span>

          <button onClick={() => openChat("ch-staff")} style={{
            padding: "5px 12px", borderRadius: 8, border: "none",
            background: T.accentBg, color: "#a5b4fc",
            fontSize: 12, fontWeight: 600, cursor: "pointer",
          }}>💬 Messages</button>

          <Avatar name={ME_ASSOCIATE.full_name} size={32} index={2} />
        </header>

        <main style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {page === "overview"    && <PageOverview setPage={setPage} role="associate" />}
          {page === "cohorts"     && <PageCohorts role="associate" />}
          {page === "escalations" && <PageEscalations role="associate" />}
          {page === "mentors"     && <PageMentors role="associate" />}
          {page === "assignments" && <PageAssignments role="associate" />}
        </main>
      </div>

      {chatOpen && (
        <ChatPanel onClose={() => setChatOpen(false)} initialChannel={chatChannel} viewerRole="associate" />
      )}
    </div>
  );
}


