"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Birthday } from "@/components/edit-birthday-dialog";

interface Props {
  existingGroups: string[];
  onAdded: (entry: Birthday) => void;
}

export function AddBirthdayForm({ existingGroups, onAdded }: Props) {
  const [datum, setDatum] = useState("");
  const [name, setName] = useState("");
  const [inhalt, setInhalt] = useState("");
  const [adresse, setAdresse] = useState("");
  const [gruppe, setGruppe] = useState("");
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
        body: JSON.stringify({ datum, name: name.trim(), inhalt: inhalt.trim(), adresse: adresse.trim(), gruppe: gruppe.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onAdded({ id: data.id, Datum: data.Datum, Name: data.Name, Inhalt: data.Inhalt, Old: data.Old, Adresse: data.Adresse ?? "", Gruppe: data.Gruppe ?? "" });
      setDatum(""); setName(""); setInhalt(""); setAdresse(""); setGruppe("");
      toast.success(`🎂 ${data.Name} wurde hinzugefügt!`);
    } catch (err) {
      toast.error((err as Error).message || "Fehler beim Speichern.");
    } finally {
      setLoading(false);
    }
  }

  const inputCls = "bg-white/50 dark:bg-white/5 border-border/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all h-10";

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="datum" className="text-sm font-semibold">Geburtstag</Label>
          <Input id="datum" type="date" value={datum} onChange={(e) => setDatum(e.target.value)} className={inputCls} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="name" className="text-sm font-semibold">Vorname / Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="z. B. Max Mustermann" className={inputCls} required />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="inhalt" className="text-sm font-semibold">Notiz</Label>
        <Textarea id="inhalt" rows={2} value={inhalt} onChange={(e) => setInhalt(e.target.value)} placeholder="Wünsche, Geschenkideen, Erinnerungen…" className="bg-white/50 dark:bg-white/5 border-border/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all resize-none" required />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="adresse" className="text-sm font-semibold">Adresse <span className="text-muted-foreground font-normal">(optional)</span></Label>
          <Input id="adresse" value={adresse} onChange={(e) => setAdresse(e.target.value)} placeholder="Musterstraße 1, 12345 Berlin" className={inputCls} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="gruppe" className="text-sm font-semibold">Gruppe / Familie <span className="text-muted-foreground font-normal">(optional)</span></Label>
          <Input
            id="gruppe" value={gruppe} onChange={(e) => setGruppe(e.target.value)}
            placeholder="z. B. Familie Mustermann"
            list="groups-list"
            className={inputCls}
          />
          <datalist id="groups-list">
            {existingGroups.map((g) => <option key={g} value={g} />)}
          </datalist>
        </div>
      </div>
      <div>
        <Button type="submit" disabled={loading} className="gap-2 px-6 font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 hover:scale-[1.02]">
          {loading ? "Speichert…" : "Hinzufügen"}
        </Button>
      </div>
    </form>
  );
}
