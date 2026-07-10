import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import { ApprovalGate } from "@/components/providers/approval-gate";
import "./globals.css";

import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});
export const metadata: Metadata = {
  title: "Nazaria Mentor Portal",
  description: "Mentorship program dashboard for mentees, mentors, and program staff.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.variable} ${geistMono.variable} ${playfair.variable}`} >
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {/* Query doesn't depend on session, so it wraps everything */}
          <QueryProvider>
            {/* SessionProvider hydrates the store and blocks render until
                loading === false */}
            <SessionProvider>
              {/* ApprovalGate reads the now-hydrated store and redirects
                  pending/rejected/logged-out users before anything
                  protected renders 
              <ApprovalGate>{children}</ApprovalGate>
              */}
              {children}
            </SessionProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}