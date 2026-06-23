"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Birthday } from "@/components/edit-birthday-dialog";

interface Props {
  onAdded: (entry: Birthday) => void;
}

export function AddBirthdayForm({ onAdded }: Props) {
  const [datum, setDatum] = useState("");
  const [name, setName] = useState("");
  const [inhalt, setInhalt] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!datum || !name.trim() || !inhalt.trim()) {
      toast.error("Alle Felder sind erforderlich.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/birthdays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ datum, name: name.trim(), inhalt: inhalt.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onAdded({ id: data.id, Datum: data.Datum, Name: data.Name, Inhalt: data.Inhalt, Old: data.Old });
      setDatum("");
      setName("");
      setInhalt("");
      toast.success(`🎂 ${data.Name} wurde hinzugefügt!`);
    } catch (err) {
      toast.error((err as Error).message || "Fehler beim Speichern.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="datum" className="text-sm font-semibold">Geburtstag</Label>
          <Input
            id="datum" type="date"
            value={datum} onChange={(e) => setDatum(e.target.value)}
            className="bg-white/50 dark:bg-white/5 border-border/60 focus:border-primary/50
              focus:ring-2 focus:ring-primary/20 transition-all h-10"
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="name" className="text-sm font-semibold">Vorname / Name</Label>
          <Input
            id="name" value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="z. B. Max Mustermann"
            className="bg-white/50 dark:bg-white/5 border-border/60 focus:border-primary/50
              focus:ring-2 focus:ring-primary/20 transition-all h-10"
            required
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="inhalt" className="text-sm font-semibold">Notiz</Label>
        <Textarea
          id="inhalt" rows={3} value={inhalt}
          onChange={(e) => setInhalt(e.target.value)}
          placeholder="Wünsche, Geschenkideen, Erinnerungen…"
          className="bg-white/50 dark:bg-white/5 border-border/60 focus:border-primary/50
            focus:ring-2 focus:ring-primary/20 transition-all resize-none"
          required
        />
      </div>
      <div>
        <Button
          type="submit" disabled={loading}
          className="gap-2 px-6 font-semibold bg-primary hover:bg-primary/90
            shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 hover:scale-[1.02]"
        >
          {loading ? "Speichert…" : "Hinzufügen"}
        </Button>
      </div>
    </form>
  );
}
