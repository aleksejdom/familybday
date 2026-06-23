import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ThemeToggle } from "@/components/theme-toggle";
import { Toaster } from "@/components/ui/sonner";
import { Cake } from "lucide-react";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Geburtstagskalender · by Domowets",
  description: "Nie wieder einen Geburtstag vergessen – Geburtstagskalender by Domowets",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${jakarta.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col relative overflow-x-hidden">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>

          {/* ── Ambient background blobs ── */}
          <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            <div className="blob blob-delay-0 absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full
              bg-violet-400/25 dark:bg-violet-600/20 blur-3xl" />
            <div className="blob blob-delay-2 absolute top-1/2 -right-40 w-[420px] h-[420px] rounded-full
              bg-fuchsia-400/20 dark:bg-fuchsia-700/15 blur-3xl" />
            <div className="blob blob-delay-4 absolute -bottom-20 left-1/3 w-[380px] h-[380px] rounded-full
              bg-indigo-400/20 dark:bg-indigo-700/15 blur-3xl" />
          </div>

          {/* ── Header ── */}
          <header className="sticky top-0 z-20 glass-subtle">
            <div className="container max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 dark:bg-primary/20">
                  <Cake className="h-4 w-4 text-primary" />
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-extrabold text-sm tracking-tight gradient-text">
                    Geburtstagskalender
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground tracking-wide">
                    by Domowets
                  </span>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </header>

          {children}
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
