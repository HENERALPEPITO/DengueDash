import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // todo: verify user authentication
  // middleware cannot support axios
  // search for basic fetch
  const isAuthenticated = request.cookies.get("access_token");

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/user/dashboard"],
};
