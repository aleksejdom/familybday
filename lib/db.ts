import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB ?? "bday";

let client: MongoClient;
let db: Db;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
}

export async function getDb(): Promise<Db> {
  if (db) return db;

  if (!globalThis._mongoClient) {
    globalThis._mongoClient = new MongoClient(uri);
    await globalThis._mongoClient.connect();
  }

  client = globalThis._mongoClient;
  db = client.db(dbName);
  return db;
}

export function calculateAge(dateString: string): number {
  const birth = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}
