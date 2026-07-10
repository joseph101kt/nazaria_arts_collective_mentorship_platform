"use client";

import { GraduationCap, Sparkles } from "lucide-react";
import { OnboardingState } from "./onboarding";

interface WelcomePanelProps {
  data: OnboardingState;
}

export default function WelcomePanel({ data }: WelcomePanelProps) {
  const { fullName } = data.account;
  const { schoolOrOrg, interests, avatarFile } = data.profile;

  const initials = fullName
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("") || "?";

  const avatarPreview = avatarFile ? URL.createObjectURL(avatarFile) : null;

  return (
    <div className="flex h-full flex-col justify-between bg-[#1F2A44] p-8 text-[#F1EFE7] sm:p-10 dark:bg-[#14181F]">
      <div>
        <div className="flex items-center gap-2 text-[#E8A33D]">
          <GraduationCap className="h-6 w-6" />
          <span className="font-mono text-xs uppercase tracking-[0.2em]">
            Mentee Onboarding
          </span>
        </div>
        <h1 className="mt-6 font-serif text-3xl leading-tight sm:text-4xl">
          Your mentor is
          <br />
          waiting to meet you.
        </h1>
        <p className="mt-4 max-w-sm text-sm text-[#C7C2B4]">
          A couple of minutes now gets you matched with a mentor, your pod,
          and a plan built around where you actually want to go.
        </p>
      </div>

      {/* Signature element: live student ID card that fills in as the form is completed */}
      <div className="mt-10">
        <p className="mb-2 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-[#9CA6C4]">
          <Sparkles className="h-3.5 w-3.5" />
          Your card, building itself
        </p>
        <div className="relative overflow-hidden rounded-xl border border-[#3A4560] bg-gradient-to-br from-[#28345186] to-[#1F2A44] p-5 shadow-lg">
          <div
            className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#E8A33D]/10"
            aria-hidden
          />
          <div className="relative flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-[#E8A33D] bg-[#2C3A5C] font-serif text-lg font-semibold">
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarPreview}
                  alt="Your avatar preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate font-serif text-lg">
                {fullName || "Your name here"}
              </p>
              <p className="truncate text-xs text-[#9CA6C4]">
                {schoolOrOrg || "Your college / organization"}
              </p>
            </div>
          </div>
          <div className="relative mt-4 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-[#E8A33D]/15 px-2.5 py-0.5 text-[11px] font-medium text-[#E8A33D]">
              Mentee
            </span>
            {interests.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/8 px-2.5 py-0.5 text-[11px] text-[#C7C2B4]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}