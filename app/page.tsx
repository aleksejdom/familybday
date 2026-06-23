export const dynamic = "force-dynamic";

import { query, initDb } from "@/lib/db";
import { BirthdayPageClient } from "@/components/birthday-page-client";
import { Birthday } from "@/components/edit-birthday-dialog";
import { CalendarDays, Users, PartyPopper } from "lucide-react";

async function getBirthdays(): Promise<Birthday[]> {
  try {
    await initDb();
    const rows = await query<{ id: number; datum: string; name: string; inhalt: string; old: number; adresse: string; gruppe: string }>(
      "SELECT id, datum, name, inhalt, old, adresse, gruppe FROM geburtstage ORDER BY month_day ASC"
    );
    return rows.map((r) => ({
      id: r.id.toString(),
      Datum: r.datum,
      Name: r.name,
      Inhalt: r.inhalt,
      Old: r.old,
      Adresse: r.adresse ?? "",
      Gruppe: r.gruppe ?? "",
    }));
  } catch {
    return [];
  }
}

function daysUntilBirthday(dateString: string): number {
  const today = new Date();
  const birth = new Date(dateString);
  const next = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  if (next < today) next.setFullYear(today.getFullYear() + 1);
  return Math.ceil((next.getTime() - today.getTime()) / 86400000);
}

const PALETTE = [
  { badge: "bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-400" },
  { badge: "bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400" },
  { badge: "bg-violet-500/15 border border-violet-500/30 text-violet-600 dark:text-violet-400" },
  { badge: "bg-rose-500/15 border border-rose-500/30 text-rose-600 dark:text-rose-400" },
  { badge: "bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400" },
  { badge: "bg-cyan-500/15 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400" },
  { badge: "bg-orange-500/15 border border-orange-500/30 text-orange-600 dark:text-orange-400" },
  { badge: "bg-pink-500/15 border border-pink-500/30 text-pink-600 dark:text-pink-400" },
];

function paletteFor(name: string) {
  let hash = 0;
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xfffffff;
  return PALETTE[hash % PALETTE.length];
}

function ageOnNextBirthday(dateString: string): number {
  const today = new Date();
  const birth = new Date(dateString);
  const next = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  if (next < today) return today.getFullYear() + 1 - birth.getFullYear();
  return today.getFullYear() - birth.getFullYear();
}

export default async function Home() {
  const birthdays = await getBirthdays();
  const soonCount = birthdays.filter((b) => daysUntilBirthday(b.Datum) <= 30).length;
  const todayCount = birthdays.filter((b) => daysUntilBirthday(b.Datum) === 0).length;
  const soonList = birthdays
    .map((b) => ({ ...b, days: daysUntilBirthday(b.Datum), turnsAge: ageOnNextBirthday(b.Datum) }))
    .filter((b) => b.days > 0 && b.days <= 30)
    .sort((a, b) => a.days - b.days);

  return (
    <main className="container max-w-6xl mx-auto px-4 sm:px-6 py-10">

      {/* ── Hero ── */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight gradient-text leading-tight mb-2">
          Geburtstags&shy;kalender
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg font-medium">
          Nie wieder einen Geburtstag vergessen.{" "}
          <span className="text-sm font-normal opacity-60">by Domowets</span>
        </p>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8">
        <div className="glass rounded-2xl p-3 sm:p-5">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
            <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate">
              Gesamt
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold">{birthdays.length}</p>
        </div>
        <div className="glass rounded-2xl p-3 sm:p-5">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
            <CalendarDays className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate">
              Bald
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold">{soonCount}</p>
        </div>
        <div className="glass rounded-2xl p-3 sm:p-5">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
            <PartyPopper className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate">
              Heute
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold">{todayCount}</p>
        </div>
      </div>

      {/* ── Bald ── */}
      {soonList.length > 0 && (
        <div className="glass rounded-2xl p-4 sm:p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Bald — nächste 30 Tage
            </span>
          </div>
          <ul className="space-y-2">
            {soonList.map((b) => {
              const pal = b.Gruppe ? paletteFor(b.Gruppe) : null;
              return (
                <li key={b.id} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="shrink-0 w-14 text-center text-xs font-bold text-primary bg-primary/10 rounded-lg py-1">
                      {b.days === 1 ? "morgen" : `${b.days}T`}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-medium truncate">{b.Name}</span>
                      {b.Gruppe && pal && (
                        <span className={`inline-flex items-center gap-1 self-start mt-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${pal.badge}`}>
                          <Users className="h-2.5 w-2.5" />
                          {b.Gruppe}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="shrink-0 text-sm text-muted-foreground">
                    wird {b.turnsAge}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <BirthdayPageClient initialData={birthdays} />
    </main>
  );
}
