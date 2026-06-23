"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: err } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: false,
    });
    if (err) {
      setError("Aktuelles Passwort ist falsch.");
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/"), 1500);
    }
    setLoading(false);
  }

  const inputCls =
    "bg-white/50 dark:bg-white/5 border-border/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all h-10";

  return (
    <div className="max-w-sm mx-auto mt-12 px-4">
      <div className="glass rounded-2xl p-6 sm:p-8">
        <h2 className="text-lg font-bold mb-5">Passwort ändern</h2>
        {success ? (
          <p className="text-sm text-green-600 dark:text-green-400 font-medium">
            Passwort wurde geändert.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="current" className="text-sm font-semibold">
                Aktuelles Passwort
              </Label>
              <Input
                id="current"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={inputCls}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new" className="text-sm font-semibold">
                Neues Passwort
              </Label>
              <Input
                id="new"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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
        )}
      </div>
    </div>
  );
}
