"use client";

import { useState, type FormEvent } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import type { AccountDetails } from "@/app/onboarding/onboarding";

interface SignupFormProps {
  initialValues: AccountDetails;
  onNext: (values: AccountDetails) => void;
}

type Errors = Partial<Record<keyof AccountDetails, string>>;

export default function SignupForm({ initialValues, onNext }: SignupFormProps) {
  const [values, setValues] = useState<AccountDetails>(initialValues);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const update = <K extends keyof AccountDetails>(key: K, value: AccountDetails[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const validate = (): boolean => {
    const next: Errors = {};
    if (!values.fullName.trim()) next.fullName = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(values.email)) next.email = "Enter a valid email address.";
    if (values.password.length < 8) next.password = "Use at least 8 characters.";
    if (values.confirmPassword !== values.password)
      next.confirmPassword = "Passwords don't match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    // Simulate a tick so the button shows feedback even on instant validation.
    await new Promise((resolve) => setTimeout(resolve, 150));
    setSubmitting(false);
    onNext(values);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <h2 className="font-serif text-2xl text-[#1F2A44] dark:text-[#F1EFE7]">
          Create your account
        </h2>
        <p className="mt-1 text-sm text-[#78725F] dark:text-[#9096A6]">
          This is what you`ll use to sign in every time.
        </p>
      </div>

      <Field label="Full name" htmlFor="fullName" error={errors.fullName}>
        <input
          id="fullName"
          type="text"
          autoComplete="name"
          value={values.fullName}
          onChange={(e) => update("fullName", e.target.value)}
          placeholder="Ananya Sharma"
          className={inputClass(!!errors.fullName)}
        />
      </Field>

      <Field label="Email" htmlFor="email" error={errors.email}>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="you@college.edu.in"
          className={inputClass(!!errors.email)}
        />
      </Field>

      <Field label="Password" htmlFor="password" error={errors.password}>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={values.password}
            onChange={(e) => update("password", e.target.value)}
            placeholder="At least 8 characters"
            className={inputClass(!!errors.password) + " pr-10"}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A9585] hover:text-[#1F2A44] dark:hover:text-[#F1EFE7]"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </Field>

      <Field label="Confirm password" htmlFor="confirmPassword" error={errors.confirmPassword}>
        <input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          value={values.confirmPassword}
          onChange={(e) => update("confirmPassword", e.target.value)}
          placeholder="Type it again"
          className={inputClass(!!errors.confirmPassword)}
        />
      </Field>

      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#E8A33D] px-4 py-2.5 text-sm font-semibold text-[#1F2A44] transition-colors hover:bg-[#dc9530] disabled:opacity-70"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Continue to profile
      </button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-[#1F2A44] dark:text-[#F1EFE7]">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-[#B3452F]">{error}</p>}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return [
    "w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors",
    "bg-white text-[#1F2A44] placeholder:text-[#9A9585]",
    "dark:bg-[#1C2333] dark:text-[#F1EFE7] dark:placeholder:text-[#6B7280]",
    hasError
      ? "border-[#B3452F] focus:ring-2 focus:ring-[#B3452F]/30"
      : "border-[#D8D3C4] focus:border-[#E8A33D] focus:ring-2 focus:ring-[#E8A33D]/30 dark:border-[#333B4D] dark:focus:border-[#E8A33D]",
  ].join(" ");
}