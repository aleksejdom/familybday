"use client";

import { useState, Fragment } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Cake, Calendar, MapPin, Users } from "lucide-react";
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
  return new Date(dateString).toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });
}

function DaysBadge({ days }: { days: number }) {
  if (days === 0)
    return <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-amber-400/20 text-amber-600 dark:text-amber-300 border border-amber-400/30"><Cake className="h-3 w-3" /> Heute!</span>;
  if (days <= 7)
    return <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-rose-400/15 text-rose-600 dark:text-rose-400 border border-rose-400/25"><Calendar className="h-3 w-3" /> in {days}d</span>;
  if (days <= 30)
    return <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-violet-400/15 text-violet-600 dark:text-violet-400 border border-violet-400/25">in {days}d</span>;
  return <span className="text-xs text-muted-foreground tabular-nums">in {days}d</span>;
}

const PALETTE = [
  { border: "border-l-blue-500", bg: "bg-blue-500/5", header: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", badge: "bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-400" },
  { border: "border-l-emerald-500", bg: "bg-emerald-500/5", header: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", badge: "bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400" },
  { border: "border-l-violet-500", bg: "bg-violet-500/5", header: "bg-violet-500/10", text: "text-violet-600 dark:text-violet-400", badge: "bg-violet-500/15 border border-violet-500/30 text-violet-600 dark:text-violet-400" },
  { border: "border-l-rose-500", bg: "bg-rose-500/5", header: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-400", badge: "bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400" },
  { border: "border-l-amber-500", bg: "bg-amber-500/5", header: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", badge: "bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400" },
  { border: "border-l-cyan-500", bg: "bg-cyan-500/5", header: "bg-cyan-500/10", text: "text-cyan-600 dark:text-cyan-400", badge: "bg-cyan-500/15 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400" },
  { border: "border-l-orange-500", bg: "bg-orange-500/5", header: "bg-orange-500/10", text: "text-orange-600 dark:text-orange-400", badge: "bg-orange-500/15 border border-orange-500/30 text-orange-600 dark:text-orange-400" },
  { border: "border-l-pink-500", bg: "bg-pink-500/5", header: "bg-pink-500/10", text: "text-pink-600 dark:text-pink-400", badge: "bg-pink-500/15 border border-pink-500/30 text-pink-600 dark:text-pink-400" },
];

function paletteFor(groupName: string) {
  let hash = 0;
  for (const c of groupName) hash = (hash * 31 + c.charCodeAt(0)) & 0xfffffff;
  return PALETTE[hash % PALETTE.length];
}

type Group = { name: string | null; entries: Birthday[] };

function buildGroups(entries: Birthday[]): Group[] {
  const map = new Map<string, Birthday[]>();
  const ungrouped: Birthday[] = [];
  for (const e of entries) {
    if (e.Gruppe) {
      if (!map.has(e.Gruppe)) map.set(e.Gruppe, []);
      map.get(e.Gruppe)!.push(e);
    } else {
      ungrouped.push(e);
    }
  }
  const result: Group[] = [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, entries]) => ({ name, entries }));
  if (ungrouped.length) result.push({ name: null, entries: ungrouped });
  return result;
}

interface Props {
  initialData: Birthday[];
  existingGroups: string[];
}

export function BirthdayTable({ initialData, existingGroups }: Props) {
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

  const groups = buildGroups(entries);

  const empty = (
    <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
      <Cake className="h-8 w-8 opacity-30" />
      <span className="text-sm">Noch keine Einträge vorhanden</span>
    </div>
  );

  const actionButtons = (entry: Birthday) => (
    <>
      <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-primary/10 hover:text-primary" onClick={() => setEditing(entry)} aria-label="Bearbeiten">
        <Pencil className="h-3.5 w-3.5" />
      </Button>
      <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(entry.id)} disabled={deletingId === entry.id} aria-label="Löschen">
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </>
  );

  return (
    <>
      {/* ── Mobile: Card list ─────────────────────────────── */}
      <div className="md:hidden space-y-6">
        {entries.length === 0 && <div className="glass rounded-2xl">{empty}</div>}
        {groups.map((group) => (
          <div key={group.name ?? "__ungrouped"}>
            {group.name && (() => {
              const pal = paletteFor(group.name);
              return (
                <div className={`flex items-center gap-2 mb-2 px-1`}>
                  <Users className={`h-3.5 w-3.5 ${pal.text}`} />
                  <span className={`text-xs font-bold uppercase tracking-wider ${pal.text}`}>{group.name}</span>
                </div>
              );
            })()}
            <div className="space-y-3">
              {group.entries.map((entry) => {
                const days = daysUntilBirthday(entry.Datum);
                const isToday = days === 0;
                const pal = group.name ? paletteFor(group.name) : null;
                return (
                  <div
                    key={entry.id}
                    className={`glass rounded-2xl p-4 transition-colors border-l-4
                      ${isToday ? "border-l-amber-400 bg-amber-400/5" : pal ? `${pal.border} ${pal.bg}` : "border-l-transparent"}`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 text-xs font-bold">
                          {entry.Old}
                        </span>
                        <span className="font-bold text-base leading-tight">{entry.Name}</span>
                      </div>
                      <DaysBadge days={days} />
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-1">
                      <Calendar className="h-3.5 w-3.5 shrink-0" />
                      {formatDate(entry.Datum)}
                    </div>
                    {entry.Adresse && (
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-1">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        {entry.Adresse}
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{entry.Inhalt}</p>
                    <div className="flex gap-2 pt-3 border-t border-border/40">
                      <Button size="sm" variant="ghost" className="flex-1 gap-1.5 h-8 text-xs hover:bg-primary/10 hover:text-primary" onClick={() => setEditing(entry)}>
                        <Pencil className="h-3.5 w-3.5" /> Bearbeiten
                      </Button>
                      <Button size="sm" variant="ghost" className="flex-1 gap-1.5 h-8 text-xs hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(entry.id)} disabled={deletingId === entry.id}>
                        <Trash2 className="h-3.5 w-3.5" /> Löschen
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* ── Desktop: Table ────────────────────────────────── */}
      <div className="hidden md:block glass rounded-2xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/50 hover:bg-transparent">
              <TableHead className="font-semibold text-xs uppercase tracking-wider pl-6">Name</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Datum</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Notiz</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider">Adresse</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider w-16 text-center">Alter</TableHead>
              <TableHead className="font-semibold text-xs uppercase tracking-wider w-28 text-center">Countdown</TableHead>
              <TableHead className="w-24 text-center" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.length === 0 && (
              <TableRow><TableCell colSpan={7}>{empty}</TableCell></TableRow>
            )}
            {groups.map((group) => (
              <Fragment key={group.name ?? "__ungrouped"}>
                {group.name && (() => {
                  const pal = paletteFor(group.name);
                  return (
                    <TableRow key={`header-${group.name}`} className={`${pal.header} border-b border-border/30 hover:bg-transparent`}>
                      <TableCell colSpan={7} className="pl-6 py-2">
                        <div className="flex items-center gap-2">
                          <Users className={`h-3.5 w-3.5 ${pal.text}`} />
                          <span className={`text-xs font-bold uppercase tracking-wider ${pal.text}`}>{group.name}</span>
                          <span className={`ml-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${pal.badge}`}>
                            {group.entries.length} {group.entries.length === 1 ? "Person" : "Personen"}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })()}
                {group.entries.map((entry) => {
                  const days = daysUntilBirthday(entry.Datum);
                  const isToday = days === 0;
                  const pal = group.name ? paletteFor(group.name) : null;
                  return (
                    <TableRow
                      key={entry.id}
                      className={`group border-b border-border/30 transition-colors border-l-4
                        ${isToday ? "bg-amber-400/5 border-l-amber-400" : pal ? `${pal.bg} ${pal.border}` : "border-l-transparent hover:bg-white/30 dark:hover:bg-white/5"}`}
                    >
                      <TableCell className="font-semibold pl-5 py-4">{entry.Name}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{formatDate(entry.Datum)}</TableCell>
                      <TableCell className="text-muted-foreground text-sm max-w-[180px] truncate">{entry.Inhalt}</TableCell>
                      <TableCell className="text-muted-foreground text-sm max-w-[160px] truncate">
                        {entry.Adresse ? (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 shrink-0 opacity-50" />
                            {entry.Adresse}
                          </span>
                        ) : <span className="opacity-30">—</span>}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 text-xs font-bold">
                          {entry.Old}
                        </span>
                      </TableCell>
                      <TableCell className="text-center"><DaysBadge days={days} /></TableCell>
                      <TableCell>
                        <div className="flex gap-1 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          {actionButtons(entry)}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

      <EditBirthdayDialog entry={editing} existingGroups={existingGroups} onClose={() => setEditing(null)} onSaved={handleSaved} />
    </>
  );
}
