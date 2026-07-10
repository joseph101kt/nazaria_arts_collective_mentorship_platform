// components/onboarding/role-choice.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Users } from "lucide-react";
import { setUserRole } from "@/lib/api/auth";
import { useSessionStore } from "@/store/session-store";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/types";

export function RoleChoice() {
  const router = useRouter();
  const user = useSessionStore((s) => s.user);
  const loading = useSessionStore((s) => s.loading);
  const [selected, setSelected] = useState<UserRole | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleContinue() {
    if (!selected) return;

    if (!user) {
      setError(
        "We couldn't find your session yet. Wait a moment and try again, or refresh the page."
      );
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      // 1. Save the role. 
      // Note: If your backend or Supabase trigger automatically defaults 
      // approval_status to 'pending' when role === 'mentor', this is all you need.
      // If not, you might need to update setUserRole to accept an object or update the column explicitly.
      await setUserRole(user.id, selected);
      
      // 2. Conditional Redirect routing logic
      if (selected === "mentor") {
        router.push("/onboarding/not-approved");
      } else {
        router.push("/onboarding/profile");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save that. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 shadow-sm">
      <h1 className="text-lg font-heading text-text-primary">How will you be joining?</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        You can&apos;t change this later without contacting your program manager.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <RoleCard
          icon={<GraduationCap className="h-5 w-5" />}
          title="I'm a student"
          description="Join a cohort, get assignments, and track your progress."
          active={selected === "mentee"}
          onClick={() => setSelected("mentee")}
        />
        <RoleCard
          icon={<Users className="h-5 w-5" />}
          title="I want to mentor"
          description="Apply to guide a pod. Requires PM approval before you get access."
          active={selected === "mentor"}
          onClick={() => setSelected("mentor")}
        />
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <button
        type="button"
        disabled={!selected || submitting || loading}
        onClick={handleContinue}
        className="mt-6 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Loading your session…" : submitting ? "Saving…" : "Continue"}
      </button>
    </div>
  );
}

function RoleCard({
  icon,
  title,
  description,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors",
        active
          ? "border-ring bg-surface-muted ring-2 ring-ring/30"
          : "border-border hover:bg-surface-muted/50",
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg",
          active ? "bg-primary text-primary-foreground" : "bg-surface-muted text-text-accent",
        )}
      >
        {icon}
      </span>
      <span className="text-sm font-medium text-text-primary">{title}</span>
      <span className="text-xs text-muted-foreground">{description}</span>
    </button>
  );
}