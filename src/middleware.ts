import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  if (url.pathname.startsWith("/admin") || url.pathname.startsWith("/seller")) {
    const token = req.cookies.get("jwt")?.value;

    if (!token) {
      url.pathname = "/auth";
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}
