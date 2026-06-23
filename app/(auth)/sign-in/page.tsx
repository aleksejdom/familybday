"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { Cake, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const passwordReset = searchParams.get("reset") === "1";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await signIn.email({ email, password });
    if (err) {
      setError("E-Mail oder Passwort falsch.");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  const inputCls =
    "bg-white/50 dark:bg-white/5 border-border/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all h-10";

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15">
            <Cake className="h-6 w-6 text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-extrabold tracking-tight gradient-text">
              Geburtstagskalender
            </h1>
            <p className="text-sm text-muted-foreground mt-1">by Domowets</p>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold mb-5">Anmelden</h2>
          {passwordReset && (
            <div className="mb-4 rounded-lg bg-green-500/10 border border-green-500/20 p-3">
              <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                Passwort wurde zurückgesetzt. Melde dich jetzt an.
              </p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-sm font-semibold">
                E-Mail
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@beispiel.de"
                className={inputCls}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-sm font-semibold">
                Passwort
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputCls}
                required
              />
            </div>
            {error && (
              <div className="grid gap-1">
                <p className="text-sm text-destructive font-medium">{error}</p>
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary font-medium hover:underline"
                >
                  Passwort vergessen?
                </Link>
              </div>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="gap-2 font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 mt-1"
            >
              <LogIn className="h-4 w-4" />
              {loading ? "Anmelden…" : "Anmelden"}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Noch kein Konto?{" "}
            <Link href="/sign-up" className="text-primary font-medium hover:underline">
              Registrieren
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
