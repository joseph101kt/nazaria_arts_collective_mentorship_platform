/**
 * ChatPanel.jsx
 * Shared chat panel for PM and Associate dashboards.
 * Shows role badges on every message so it's always clear who is
 * mentor / mentee / associate / pm in a conversation.
 */

import { useState } from "react";
import { T, Avatar, RoleBadge, fmtTime } from "./shared";
import { CHAT_CHANNELS, DEMO_MESSAGES, MENTORS, MENTEES } from "./demoData";

const CH_ICON = { staff: "🔒", cohort: "🏛️", mentors: "🧑‍🏫", direct: "👤" };

export default function ChatPanel({ onClose, initialChannel, viewerRole = "pm" }) {
  const [activeId, setActiveId] = useState(initialChannel || CHAT_CHANNELS[0]?.id);
  const [input, setInput] = useState("");

  const msgs    = DEMO_MESSAGES[activeId] || [];
  const channel = CHAT_CHANNELS.find((c) => c.id === activeId);

  // Determine if a message is "self" based on viewer role
  const isSelf = (m) =>
    (viewerRole === "pm" && m.sender.is_self_pm) ||
    (viewerRole === "associate" && m.sender.is_self_associate);

  const avatarIndex = (name) => {
    const all = [...MENTORS, ...MENTEES];
    const idx = all.findIndex((p) => p.full_name === name);
    return idx >= 0 ? idx : 0;
  };

  return (
    <div style={{
      position: "fixed", top: 0, right: 0, height: "100%", width: 420,
      background: T.surface, borderLeft: `1px solid ${T.border}`,
      zIndex: 60, display: "flex",
    }}>
      {/* Channel list */}
      <div style={{
        width: 150, borderRight: `1px solid ${T.border}`,
        display: "flex", flexDirection: "column", padding: "14px 0", overflowY: "auto",
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: T.text, padding: "0 12px 10px" }}>
          Messages
        </div>
        {CHAT_CHANNELS.map((ch) => (
          <button key={ch.id} onClick={() => setActiveId(ch.id)} style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "8px 12px", border: "none", cursor: "pointer",
            width: "100%", textAlign: "left",
            background: activeId === ch.id ? T.accentBg : "transparent",
            color: activeId === ch.id ? "#a5b4fc" : T.textSec,
            borderLeft: activeId === ch.id ? `2px solid ${T.accent}` : "2px solid transparent",
          }}>
            <span style={{ fontSize: 13 }}>{CH_ICON[ch.type] || "💬"}</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
                overflow: "hidden", textOverflow: "ellipsis" }}>{ch.name}</div>
              {ch.type === "staff" && (
                <div style={{ fontSize: 9, color: T.warning, marginTop: 1 }}>Staff only</div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Message pane */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
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

        {channel?.type === "staff" && (
          <div style={{
            margin: "10px 14px 0", padding: "8px 12px", borderRadius: 8,
            background: T.warningBg, border: `1px solid ${T.warning}`,
            fontSize: 12, color: T.warning, fontWeight: 500,
          }}>
            🔒 Visible only to PM and Associate roles — not mentors or mentees.
          </div>
        )}

        <div style={{
          flex: 1, overflowY: "auto", padding: "14px",
          display: "flex", flexDirection: "column", gap: 14,
        }}>
          {msgs.map((m) => {
            const self = isSelf(m);
            return (
              <div key={m.id} style={{
                display: "flex", gap: 8,
                flexDirection: self ? "row-reverse" : "row",
              }}>
                {!self && <Avatar name={m.sender.full_name} size={28} index={avatarIndex(m.sender.full_name)} />}
                <div style={{ maxWidth: "76%" }}>
                  {!self && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: T.textSec }}>
                        {m.sender.full_name}
                      </span>
                      <RoleBadge role={m.sender.role} />
                    </div>
                  )}
                  <div style={{
                    padding: "8px 12px", borderRadius: 10, fontSize: 13, lineHeight: 1.5,
                    background: self ? T.accentBg : T.cardHi,
                    color: self ? "#c7d2fe" : T.text,
                    borderBottomRightRadius: self ? 2 : 10,
                    borderBottomLeftRadius:  self ? 10 : 2,
                  }}>{m.body}</div>
                  <div style={{
                    fontSize: 10, color: T.textMut, marginTop: 3,
                    textAlign: self ? "right" : "left",
                  }}>{fmtTime(m.created_at)}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ padding: "10px 14px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 8 }}>
          <input value={input} onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${channel?.name || ""}…`} style={{
              flex: 1, padding: "8px 12px", borderRadius: 8, fontSize: 13,
              background: T.cardHi, border: `1px solid ${T.border}`,
              color: T.text, outline: "none",
            }} />
          <button onClick={() => setInput("")} style={{
            padding: "7px 14px", borderRadius: 8, border: "none",
            background: T.accent, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}>Send</button>
        </div>
      </div>
    </div>
  );
}