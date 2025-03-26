import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Ensure session persists across requests
//   await supabase.auth.getSession();

  return res;
}

export const config = {
  matcher: "/dashboard/:path*", // Apply middleware to protected routes
};
