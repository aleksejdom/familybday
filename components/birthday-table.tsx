"use client";

import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Cake, Calendar } from "lucide-react";
import { EditBirthdayDialog, Birthday } from "@/components/edit-birthday-dialog";
import { toast } from "sonner";

function daysUntilBirthday(dateString: string): number {
  const today = new Date();
  const birth = new Date(dateString);
  const next = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  if (next < today) next.setFullYear(today.getFullYear() + 1);
  return Math.ceil((next.getTime() - today.getTime()) / 86400000);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("de-DE", {
    day: "2-digit", month: "long", year: "numeric",
  });
}

function DaysBadge({ days }: { days: number }) {
  if (days === 0)
    return (
      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold
        bg-amber-400/20 text-amber-600 dark:text-amber-300 border border-amber-400/30">
        <Cake className="h-3 w-3" /> Heute!
      </span>
    );
  if (days <= 7)
    return (
      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold
        bg-rose-400/15 text-rose-600 dark:text-rose-400 border border-rose-400/25">
        <Calendar className="h-3 w-3" /> in {days}d
      </span>
    );
  if (days <= 30)
    return (
      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium
        bg-violet-400/15 text-violet-600 dark:text-violet-400 border border-violet-400/25">
        in {days}d
      </span>
    );
  return (
    <span className="text-xs text-muted-foreground tabular-nums">in {days}d</span>
  );
}

interface Props {
  initialData: Birthday[];
}

export function BirthdayTable({ initialData }: Props) {
  const [entries, setEntries] = useState<Birthday[]>(initialData);
  const [editing, setEditing] = useState<Birthday | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Diesen Eintrag wirklich löschen?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/birthdays/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setEntries((prev) => prev.filter((e) => e.id !== id));
      toast.success("Eintrag gelöscht.");
    } catch {
      toast.error("Fehler beim Löschen.");
    } finally {
      setDeletingId(null);
    }
  }

  function handleSaved(updated: Birthday) {
    setEntries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  }

  const empty = (
    <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
      <Cake className="h-8 w-8 opacity-30" />
      <span className="text-sm">Noch keine Einträge vorhanden</span>
    </div>
  );

  return (
    <>
      {/* ── Mobile: Card list ─────────────────────────────── */}
      <div className="md:hidden space-y-3">
        {entries.length === 0 && <div className="glass rounded-2xl">{empty}</div>}
        {entries.map((entry) => {
          const days = daysUntilBirthday(entry.Datum);
          const isToday = days === 0;
          return (
            <div
              key={entry.id}
              className={`glass rounded-2xl p-4 transition-colors
                ${isToday ? "border-amber-400/40 bg-amber-400/5" : ""}`}
            >
              {/* Row 1: Name + Badge */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center
                    rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 text-xs font-bold">
                    {entry.Old}
                  </span>
                  <span className="font-bold text-base leading-tight">{entry.Name}</span>
                </div>
                <DaysBadge days={days} />
              </div>

              {/* Row 2: Datum */}
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                {formatDate(entry.Datum)}
              </div>

              {/* Row 3: Notiz */}
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                {entry.Inhalt}
              </p>

              {/* Row 4: Actions */}
              <div className="flex gap-2 pt-3 border-t border-border/40">
                <Button
                  size="sm" variant="ghost"
                  className="flex-1 gap-1.5 h-8 text-xs hover:bg-primary/10 hover:text-primary"
                  onClick={() => setEditing(entry)}
                >
                  <Pencil className="h-3.5 w-3.5" /> Bearbeiten
                </Button>
                <Button
                  size="sm" variant="ghost"
                  className="flex-1 gap-1.5 h-8 text-xs hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => handleDelete(entry.id)}
                  disabled={deletingId === entry.id}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Löschen
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Desktop: Table ────────────────────────────────── */}
      <div className="hidden md:block glass rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/50 hover:bg-transparent">
              <TableHead className="font-semibold text-xs uppercase tracking-wider pl-6">Name</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Datum</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Notiz</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider w-16 text-center">Alter</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider w-28 text-center">Countdown</TableHead>
              <TableHead className="w-24 text-center" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.length === 0 && (
              <TableRow>
                <TableCell colSpan={6}>{empty}</TableCell>
              </TableRow>
            )}
            {entries.map((entry) => {
              const days = daysUntilBirthday(entry.Datum);
              const isToday = days === 0;
              return (
                <TableRow
                  key={entry.id}
                  className={`group border-b border-border/30 transition-colors
                    ${isToday ? "bg-amber-400/5" : "hover:bg-white/30 dark:hover:bg-white/5"}`}
                >
                  <TableCell className="font-semibold pl-6 py-4">{entry.Name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{formatDate(entry.Datum)}</TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-[220px] truncate">{entry.Inhalt}</TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full
                      bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 text-xs font-bold">
                      {entry.Old}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <DaysBadge days={days} />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon" variant="ghost"
                        className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                        onClick={() => setEditing(entry)}
                        aria-label="Bearbeiten"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon" variant="ghost"
                        className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDelete(entry.id)}
                        disabled={deletingId === entry.id}
                        aria-label="Löschen"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <EditBirthdayDialog entry={editing} onClose={() => setEditing(null)} onSaved={handleSaved} />
    </>
  );
}
