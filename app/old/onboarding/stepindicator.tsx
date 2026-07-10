"use client";

import { Check } from "lucide-react";
import type { OnboardingStep } from "@/app/onboarding/onboarding";

interface StepIndicatorProps {
  current: OnboardingStep;
}

const steps: { key: OnboardingStep; label: string; caption: string }[] = [
  { key: "account", label: "Account", caption: "Who you are" },
  { key: "profile", label: "Profile", caption: "Your story" },
];

export default function StepIndicator({ current }: StepIndicatorProps) {
  const currentIndex = steps.findIndex((s) => s.key === current);

  return (
    <ol className="flex items-center gap-3 sm:gap-4">
      {steps.map((step, i) => {
        const isComplete = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <li key={step.key} className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2.5">
              <span
                className={[
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 font-mono text-xs font-semibold transition-colors",
                  isComplete
                    ? "border-[#2F6F62] bg-[#2F6F62] text-white"
                    : isCurrent
                    ? "border-[#E8A33D] bg-[#E8A33D] text-[#1F2A44]"
                    : "border-[#D8D3C4] bg-transparent text-[#9A9585] dark:border-[#333B4D] dark:text-[#6B7280]",
                ].join(" ")}
              >
                {isComplete ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <div className="hidden sm:block leading-tight">
                <p
                  className={[
                    "text-sm font-semibold",
                    isCurrent || isComplete
                      ? "text-[#1F2A44] dark:text-[#F1EFE7]"
                      : "text-[#9A9585] dark:text-[#6B7280]",
                  ].join(" ")}
                >
                  {step.label}
                </p>
                <p className="text-xs text-[#9A9585] dark:text-[#6B7280]">
                  {step.caption}
                </p>
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className="h-px w-8 bg-[#D8D3C4] dark:bg-[#333B4D] sm:w-14" />
            )}
          </li>
        );
      })}
    </ol>
  );
}