import { auth } from "@/lib/auth";
import { initDb } from "@/lib/db";
import { toNextJsHandler } from "better-auth/next-js";

await initDb();

export const { GET, POST, PATCH, PUT, DELETE } = toNextJsHandler(auth);
