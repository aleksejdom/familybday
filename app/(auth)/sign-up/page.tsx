"use client";

import { useState } from "react";
import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Cake, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await signUp.email({ name, email, password });
    if (err) {
      setError(err.message || "Registrierung fehlgeschlagen.");
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
          <h2 className="text-lg font-bold mb-5">Konto erstellen</h2>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-sm font-semibold">
                Name
              </Label>
              <Input
                id="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Max Mustermann"
                className={inputCls}
                required
              />
            </div>
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
              <UserPlus className="h-4 w-4" />
              {loading ? "Registrieren…" : "Registrieren"}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Bereits ein Konto?{" "}
            <Link href="/sign-in" className="text-primary font-medium hover:underline">
              Anmelden
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
