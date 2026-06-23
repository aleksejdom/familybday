import { NextRequest, NextResponse } from "next/server";
import { getDb, calculateAge } from "@/lib/db";

export async function GET() {
  try {
    const db = await getDb();
    const docs = await db
      .collection("geburtstage")
      .find({})
      .sort({ monthDay: 1 })
      .toArray();

    const entries = docs.map((d) => ({
      id: d._id.toString(),
      Datum: d.Datum,
      Name: d.Name,
      Inhalt: d.Inhalt,
      Old: d.Old,
    }));

    return NextResponse.json(entries);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Datenbankfehler" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { datum, name, inhalt } = await req.json();

    if (!datum || !name?.trim() || !inhalt?.trim()) {
      return NextResponse.json({ error: "Alle Felder sind erforderlich." }, { status: 400 });
    }

    const age = calculateAge(datum);
    const db = await getDb();

    const existing = await db.collection("geburtstage").findOne({
      Datum: datum,
      Name: name.trim(),
      Inhalt: inhalt.trim(),
    });

    if (existing) {
      return NextResponse.json({ error: "Dieser Eintrag existiert bereits." }, { status: 409 });
    }

    // monthDay for sorting by month/day ignoring year
    const d = new Date(datum);
    const monthDay = d.getMonth() * 100 + d.getDate();

    const result = await db.collection("geburtstage").insertOne({
      Datum: datum,
      Name: name.trim(),
      Inhalt: inhalt.trim(),
      Old: age,
      monthDay,
    });

    return NextResponse.json({
      id: result.insertedId.toString(),
      Datum: datum,
      Name: name.trim(),
      Inhalt: inhalt.trim(),
      Old: age,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Datenbankfehler" }, { status: 500 });
  }
}
