"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export interface Birthday {
  id: string;
  Datum: string;
  Name: string;
  Inhalt: string;
  Old: number;
}

interface Props {
  entry: Birthday | null;
  onClose: () => void;
  onSaved: (updated: Birthday) => void;
}

export function EditBirthdayDialog({ entry, onClose, onSaved }: Props) {
  const [datum, setDatum] = useState("");
  const [name, setName] = useState("");
  const [inhalt, setInhalt] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (entry) {
      setDatum(entry.Datum.slice(0, 10));
      setName(entry.Name);
      setInhalt(entry.Inhalt);
    }
  }, [entry]);

  async function handleSave() {
    if (!datum || !name.trim() || !inhalt.trim()) {
      toast.error("Alle Felder sind erforderlich.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/birthdays/${entry!.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ datum, name: name.trim(), inhalt: inhalt.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onSaved({ id: entry!.id, Datum: data.Datum, Name: data.Name, Inhalt: data.Inhalt, Old: data.Old });
      toast.success("Eintrag aktualisiert.");
      onClose();
    } catch (err) {
      toast.error((err as Error).message || "Fehler beim Speichern.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={!!entry} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md glass border-border/50">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Eintrag bearbeiten</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="edit-datum" className="text-sm font-semibold">Geburtstag</Label>
            <Input
              id="edit-datum" type="date" value={datum}
              onChange={(e) => setDatum(e.target.value)}
              className="bg-white/50 dark:bg-white/5 border-border/60"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-name" className="text-sm font-semibold">Vorname / Name</Label>
            <Input
              id="edit-name" value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Vorname / Name"
              className="bg-white/50 dark:bg-white/5 border-border/60"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-inhalt" className="text-sm font-semibold">Notiz</Label>
            <Textarea
              id="edit-inhalt" rows={3} value={inhalt}
              onChange={(e) => setInhalt(e.target.value)}
              className="bg-white/50 dark:bg-white/5 border-border/60 resize-none"
            />
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} className="border-border/60">
            Abbrechen
          </Button>
          <Button
            onClick={handleSave} disabled={loading}
            className="font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
          >
            {loading ? "Speichert…" : "Speichern"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
