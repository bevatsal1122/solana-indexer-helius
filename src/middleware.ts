import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  return res;
}

export const config = {
  matcher: "/dashboard/:path*", // Apply middleware to protected routes
};
