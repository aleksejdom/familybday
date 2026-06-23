"use client";

import { Suspense, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { Cake, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      setError("Ungültiger Link. Bitte fordere einen neuen an.");
      return;
    }
    setLoading(true);
    setError("");
    const { error: err } = await authClient.resetPassword({
      newPassword: password,
      token,
    });
    if (err) {
      setError("Ungültiger oder abgelaufener Link. Bitte fordere einen neuen an.");
    } else {
      router.push("/sign-in?reset=1");
    }
    setLoading(false);
  }

  const inputCls =
    "bg-white/50 dark:bg-white/5 border-border/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all h-10";

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="password" className="text-sm font-semibold">
          Neues Passwort
        </Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputCls}
          minLength={8}
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
        <KeyRound className="h-4 w-4" />
        {loading ? "Speichern…" : "Passwort speichern"}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
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
          <h2 className="text-lg font-bold mb-1">Neues Passwort vergeben</h2>
          <p className="text-sm text-muted-foreground mb-5">
            Wähle ein neues Passwort (mindestens 8 Zeichen).
          </p>
          <Suspense>
            <ResetPasswordForm />
          </Suspense>
          <p className="text-center text-sm text-muted-foreground mt-4">
            <Link href="/sign-in" className="text-primary font-medium hover:underline">
              Zurück zur Anmeldung
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
