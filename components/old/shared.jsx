/**
 * shared.jsx
 * Design tokens + base UI primitives shared across PM and Associate dashboards.
 */

import { useState } from "react";

// ─── Design tokens ────────────────────────────────────────────────────────────

export const T = {
  bg: "#0D1117", surface: "#161B27", card: "#1C2333", cardHi: "#243044",
  border: "#2D3748", borderHi: "#4B5563",
  accent: "#6366F1", accentBg: "#1e1b4b",
  success: "#10B981", successBg: "#064e3b",
  warning: "#F59E0B", warningBg: "#78350f",
  danger: "#EF4444",  dangerBg: "#7f1d1d",
  text: "#F0F4FF", textSec: "#94A3B8", textMut: "#4B5563",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const initials  = (n) => n.split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2);
export const fmtDate    = (iso) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
export const fmtTime    = (iso) => new Date(iso).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
export const daysUntil  = (iso) => Math.ceil((new Date(iso) - new Date()) / 86400000);

const PALETTES = [
  ["#3730a3","#c7d2fe"],["#065f46","#a7f3d0"],["#92400e","#fde68a"],
  ["#1e40af","#bfdbfe"],["#831843","#fbcfe8"],["#134e4a","#99f6e4"],
];
export const pal = (i) => PALETTES[i % PALETTES.length];

export const ROLE_BADGE = {
  mentor:    { bg: "#312e81", text: "#a5b4fc", label: "Mentor" },
  mentee:    { bg: "#064e3b", text: "#6ee7b7", label: "Mentee" },
  associate: { bg: "#78350f", text: "#fcd34d", label: "Associate" },
  pm:        { bg: "#1e1b4b", text: "#e0e7ff", label: "PM" },
};

export const TONE_COLOR = {
  great:     { dot: "#10b981", bg: "#064e3b", text: "#6ee7b7" },
  good:      { dot: "#6366f1", bg: "#1e1b4b", text: "#a5b4fc" },
  okay:      { dot: "#f59e0b", bg: "#78350f", text: "#fde68a" },
  low:       { dot: "#ef4444", bg: "#7f1d1d", text: "#fca5a5" },
  concerned: { dot: "#ec4899", bg: "#831843", text: "#fbcfe8" },
};

// ─── Base components ──────────────────────────────────────────────────────────

export function Avatar({ name, size = 32, index = 0 }) {
  const [bg, fg] = pal(index);
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: bg, color: fg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.36, fontWeight: 700, flexShrink: 0,
    }}>{initials(name)}</div>
  );
}

export function RoleBadge({ role }) {
  const r = ROLE_BADGE[role] || ROLE_BADGE.mentee;
  return (
    <span style={{
      padding: "1px 7px", borderRadius: 4, fontSize: 10, fontWeight: 700,
      background: r.bg, color: r.text, letterSpacing: "0.03em",
    }}>{r.label}</span>
  );
}

export function Tag({ children, color = T.textSec, bg = T.cardHi }) {
  return (
    <span style={{
      padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600,
      background: bg, color, display: "inline-flex", alignItems: "center", gap: 3,
    }}>{children}</span>
  );
}

export function Btn({ children, onClick, variant = "ghost", small, full, style: sx }) {
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

export function Card({ children, accent, style: sx }) {
  return (
    <div style={{
      background: T.card, borderRadius: 12, padding: "16px 18px",
      border: `1px solid ${T.border}`,
      borderLeft: accent ? `3px solid ${accent}` : `1px solid ${T.border}`,
      ...sx,
    }}>{children}</div>
  );
}

export function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 800, color: T.textMut,
      textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10,
    }}>{children}</div>
  );
}

export function Divider() {
  return <div style={{ height: 1, background: T.border, margin: "12px 0" }} />;
}

export function FieldLabel({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 600, color: T.textSec, marginBottom: 5 }}>{children}</div>;
}

export function TextInput({ label, ...props }) {
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

export function TextArea({ label, ...props }) {
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

export function Select({ label, children, ...props }) {
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

export function StatCard({ label, value, valueColor, sub, progress, progressColor }) {
  return (
    <Card style={{ padding: "12px 16px" }}>
      <div style={{ fontSize: 11, color: T.textMut, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: valueColor || T.text }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: T.textSec, marginTop: 4 }}>{sub}</div>}
      {progress !== undefined && (
        <div style={{ height: 4, background: T.cardHi, borderRadius: 2, marginTop: 8 }}>
          <div style={{ height: "100%", borderRadius: 2,
            background: progressColor || T.accent, width: `${progress}%` }} />
        </div>
      )}
    </Card>
  );
}