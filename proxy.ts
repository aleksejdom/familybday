import { NextRequest, NextResponse } from "next/server";
import { betterFetch } from "@better-fetch/fetch";

interface Session {
  session: { id: string; userId: string } | null;
  user: { id: string; email: string } | null;
}

const publicPaths = ["/sign-in", "/sign-up", "/api/auth"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic =
    publicPaths.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon");

  if (isPublic) return NextResponse.next();

  const { data: session } = await betterFetch<Session>(
    "/api/auth/get-session",
    {
      baseURL: request.nextUrl.origin,
      headers: { cookie: request.headers.get("cookie") ?? "" },
    }
  );

  if (!session?.session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\.png$|.*\\.ico$).*)"],
};
