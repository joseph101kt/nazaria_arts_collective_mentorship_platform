import { Mail } from "lucide-react";

interface VerifyEmailCardProps {
  email: string;
}

const GMAIL_URL = "https://mail.google.com/mail/u/0/#inbox";

export function VerifyEmailCard({ email }: VerifyEmailCardProps) {
  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted">
        <Mail className="h-6 w-6 text-text-accent" />
      </div>

      <h1 className="text-lg font-heading text-text-primary">Check your inbox</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        We sent a confirmation link to <span className="font-medium text-text-primary">{email}</span>.
        Open Gmail and click the link to verify your account.
      </p>

      <a
        href={GMAIL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        <GmailLogo className="h-4 w-4" />
        Go to Gmail
      </a>

      <p className="mt-4 text-xs text-muted-foreground">
        Didn&apos;t get it? Check spam, or come back to this page after resending.
      </p>
    </div>
  );
}

function GmailLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="#4285F4" d="M22 6.5v11a1.5 1.5 0 0 1-1.5 1.5H19V8.3l-7 4.9-7-4.9V19H3.5A1.5 1.5 0 0 1 2 17.5v-11A1.5 1.5 0 0 1 3.5 5h.7L12 10.6 19.8 5h.7A1.5 1.5 0 0 1 22 6.5Z" />
    </svg>
  );
}