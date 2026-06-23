import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getDb, calculateAge } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Ungültige ID." }, { status: 400 });

    const { datum, name, inhalt } = await req.json();
    if (!datum || !name?.trim() || !inhalt?.trim()) {
      return NextResponse.json({ error: "Alle Felder sind erforderlich." }, { status: 400 });
    }

    const age = calculateAge(datum);
    const d = new Date(datum);
    const monthDay = d.getMonth() * 100 + d.getDate();
    const db = await getDb();

    await db.collection("geburtstage").updateOne(
      { _id: new ObjectId(id) },
      { $set: { Datum: datum, Name: name.trim(), Inhalt: inhalt.trim(), Old: age, monthDay } }
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
    if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Ungültige ID." }, { status: 400 });

    const db = await getDb();
    await db.collection("geburtstage").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Datenbankfehler" }, { status: 500 });
  }
}
