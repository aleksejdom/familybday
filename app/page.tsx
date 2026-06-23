export const dynamic = "force-dynamic";

import { getDb } from "@/lib/db";
import { BirthdayPageClient } from "@/components/birthday-page-client";
import { Birthday } from "@/components/edit-birthday-dialog";
import { CalendarDays, Users, PartyPopper } from "lucide-react";

async function getBirthdays(): Promise<Birthday[]> {
  try {
    const db = await getDb();
    const docs = await db.collection("geburtstage").find({}).sort({ monthDay: 1 }).toArray();
    return docs.map((d) => ({
      id: d._id.toString(),
      Datum: d.Datum as string,
      Name: d.Name as string,
      Inhalt: d.Inhalt as string,
      Old: d.Old as number,
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

export default async function Home() {
  const birthdays = await getBirthdays();
  const soonCount = birthdays.filter((b) => daysUntilBirthday(b.Datum) <= 30).length;
  const todayCount = birthdays.filter((b) => daysUntilBirthday(b.Datum) === 0).length;

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

      <BirthdayPageClient initialData={birthdays} />
    </main>
  );
}
