import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const isProtectedRoute =
    url.pathname.startsWith("/admin") || url.pathname.startsWith("/seller");

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const token = req.cookies.get("jwt")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/auth", url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/seller/:path*"],
};
