import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const WP_DEAD_PREFIXES = [
  "/wp-admin",
  "/wp-content",
  "/wp-includes",
];

const WP_DEAD_EXACT = [
  "/wp-login.php",
  "/wp-register.php",
  "/xmlrpc.php",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isDeadPrefix = WP_DEAD_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  const isDeadExact = WP_DEAD_EXACT.includes(pathname);

  if (isDeadPrefix || isDeadExact) {
    return new NextResponse(null, { status: 410 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/wp-admin/:path*",
    "/wp-content/:path*",
    "/wp-includes/:path*",
    "/wp-login.php",
    "/wp-register.php",
    "/xmlrpc.php",
  ],
};
