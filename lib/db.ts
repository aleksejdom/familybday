import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function query<T extends Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const { rows } = await pool.query(text, params);
  return rows as T[];
}

export async function initDb(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS geburtstage (
      id SERIAL PRIMARY KEY,
      datum TEXT NOT NULL,
      name TEXT NOT NULL,
      inhalt TEXT NOT NULL,
      old INTEGER NOT NULL,
      month_day INTEGER NOT NULL,
      adresse TEXT NOT NULL DEFAULT '',
      gruppe TEXT NOT NULL DEFAULT ''
    )
  `);
  await pool.query(`ALTER TABLE geburtstage ADD COLUMN IF NOT EXISTS adresse TEXT NOT NULL DEFAULT ''`);
  await pool.query(`ALTER TABLE geburtstage ADD COLUMN IF NOT EXISTS gruppe TEXT NOT NULL DEFAULT ''`);
}

export function calculateAge(dateString: string): number {
  const birth = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}
