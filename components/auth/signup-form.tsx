"use client";

import { useState } from "react";
import Link from "next/link";
import { signUp } from "@/lib/api/auth";
import { getPasswordStrength, passwordsMatch } from "@/lib/validations/password";
import { PasswordStrengthMeter } from "./password-strength-meter";
import { VerifyEmailCard } from "./verify-email-card";

const inputClass =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/30";

export function SignupForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const { isValid: passwordValid } = getPasswordStrength(password);
  const matchOk = passwordsMatch(password, confirmPassword);
  const canSubmit =
    fullName.trim().length > 0 && email.trim().length > 0 && passwordValid && matchOk && !submitting;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    setError(null);

    if (!canSubmit) return;

    setSubmitting(true);
    try {
      await signUp({ fullName: fullName.trim(), email: email.trim(), password });
      setSubmittedEmail(email.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submittedEmail) {
    return <VerifyEmailCard email={submittedEmail} />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm"
    >
      <h1 className="text-lg font-heading text-text-primary">Create your account</h1>
      <p className="mt-1 text-sm text-muted-foreground">Join the Nazaria community.</p>

      <div className="mt-6 space-y-4">
        <Field label="Full name" htmlFor="fullName">
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={inputClass}
            placeholder="Priya Sharma"
            required
          />
        </Field>

        <Field label="Email" htmlFor="email">
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="you@example.com"
            required
          />
        </Field>

        <Field label="Password" htmlFor="password">
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            required
          />
          <PasswordStrengthMeter password={password} />
        </Field>

        <Field label="Confirm password" htmlFor="confirmPassword">
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputClass}
            required
          />
          {touched && confirmPassword.length > 0 && !matchOk && (
            <p className="mt-1 text-xs text-destructive">Passwords don&apos;t match.</p>
          )}
        </Field>
      </div>

      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={!canSubmit}
        className="mt-6 w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Creating account…" : "Sign up"}
      </button>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-text-accent hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-text-primary">
        {label}
      </label>
      {children}
    </div>
  );
}