import { NextRequest, NextResponse } from "next/server";
import { query, calculateAge } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const numId = parseInt(id, 10);
    if (isNaN(numId)) return NextResponse.json({ error: "Ungültige ID." }, { status: 400 });

    const { datum, name, inhalt } = await req.json();
    if (!datum || !name?.trim() || !inhalt?.trim()) {
      return NextResponse.json({ error: "Alle Felder sind erforderlich." }, { status: 400 });
    }

    const age = calculateAge(datum);
    const d = new Date(datum);
    const monthDay = d.getMonth() * 100 + d.getDate();

    await query(
      "UPDATE geburtstage SET datum = $1, name = $2, inhalt = $3, old = $4, month_day = $5 WHERE id = $6",
      [datum, name.trim(), inhalt.trim(), age, monthDay, numId]
    );

    return NextResponse.json({ id, Datum: datum, Name: name.trim(), Inhalt: inhalt.trim(), Old: age });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Datenbankfehler" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const numId = parseInt(id, 10);
    if (isNaN(numId)) return NextResponse.json({ error: "Ungültige ID." }, { status: 400 });

    await query("DELETE FROM geburtstage WHERE id = $1", [numId]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Datenbankfehler" }, { status: 500 });
  }
}
