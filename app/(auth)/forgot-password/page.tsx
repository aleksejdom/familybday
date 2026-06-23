"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Cake, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: err } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    });
    if (err) {
      setError("Fehler beim Senden. Bitte versuche es erneut.");
    } else {
      setSent(true);
    }
    setLoading(false);
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
          <h2 className="text-lg font-bold mb-1">Passwort zurücksetzen</h2>
          {sent ? (
            <div className="grid gap-4 mt-4">
              <div className="flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/20 p-3">
                <Mail className="h-4 w-4 text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-700 dark:text-green-400">
                  E-Mail wurde gesendet. Bitte prüfe deinen Posteingang.
                </p>
              </div>
              <Link href="/sign-in" className="text-center text-sm text-primary font-medium hover:underline">
                Zurück zur Anmeldung
              </Link>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-5">
                Gib deine E-Mail-Adresse ein – wir schicken dir einen Link zum Zurücksetzen.
              </p>
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
                {error && (
                  <p className="text-sm text-destructive font-medium">{error}</p>
                )}
                <Button
                  type="submit"
                  disabled={loading}
                  className="gap-2 font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 mt-1"
                >
                  <Mail className="h-4 w-4" />
                  {loading ? "Senden…" : "Link senden"}
                </Button>
              </form>
              <p className="text-center text-sm text-muted-foreground mt-4">
                <Link href="/sign-in" className="text-primary font-medium hover:underline">
                  Zurück zur Anmeldung
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
