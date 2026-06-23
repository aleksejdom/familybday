import { NextRequest, NextResponse } from "next/server";
import { query, initDb, calculateAge } from "@/lib/db";

export async function GET() {
  try {
    await initDb();
    const rows = await query<{ id: number; datum: string; name: string; inhalt: string; old: number; adresse: string; gruppe: string }>(
      "SELECT id, datum, name, inhalt, old, adresse, gruppe FROM geburtstage ORDER BY month_day ASC"
    );
    return NextResponse.json(rows.map((r) => ({
      id: r.id.toString(),
      Datum: r.datum,
      Name: r.name,
      Inhalt: r.inhalt,
      Old: r.old,
      Adresse: r.adresse ?? "",
      Gruppe: r.gruppe ?? "",
    })));
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Datenbankfehler" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await initDb();
    const { datum, name, inhalt, adresse = "", gruppe = "" } = await req.json();

    if (!datum || !name?.trim() || !inhalt?.trim()) {
      return NextResponse.json({ error: "Alle Felder sind erforderlich." }, { status: 400 });
    }

    const existing = await query(
      "SELECT id FROM geburtstage WHERE datum = $1 AND name = $2 AND inhalt = $3",
      [datum, name.trim(), inhalt.trim()]
    );
    if (existing.length > 0) {
      return NextResponse.json({ error: "Dieser Eintrag existiert bereits." }, { status: 409 });
    }

    const age = calculateAge(datum);
    const d = new Date(datum);
    const monthDay = d.getMonth() * 100 + d.getDate();

    const result = await query<{ id: number }>(
      "INSERT INTO geburtstage (datum, name, inhalt, old, month_day, adresse, gruppe) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      [datum, name.trim(), inhalt.trim(), age, monthDay, adresse.trim(), gruppe.trim()]
    );

    return NextResponse.json({
      id: result[0].id.toString(),
      Datum: datum,
      Name: name.trim(),
      Inhalt: inhalt.trim(),
      Old: age,
      Adresse: adresse.trim(),
      Gruppe: gruppe.trim(),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Datenbankfehler" }, { status: 500 });
  }
}
