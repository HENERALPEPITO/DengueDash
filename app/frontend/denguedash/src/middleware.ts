import { NextRequest, NextResponse } from "next/server";
import {
  getIsAdminFromToken,
  validateToken,
  verifyTokenSignature,
} from "./lib/token";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token");
  const refreshToken = cookieStore.get("refresh_token");

  const deleteCookies = () => {
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
  };

  // Check if tokens exist
  if (!accessToken || !refreshToken) {
    deleteCookies();
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Verify the signature of refresh token
  const isRefreshTokenSignatureValid = await verifyTokenSignature(
    refreshToken.value,
    "REFRESH" // FOR DEBUGGING PURPOSES
  );
  if (!isRefreshTokenSignatureValid) {
    deleteCookies();
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Verify if refresh token is expired
  const isRefreshTokenExpired = await validateToken(refreshToken.value);
  if (isRefreshTokenExpired) {
    deleteCookies();
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const adminPath = "/admin";
  const userPath = "/user";
  const adminDashboardPath = "/admin/analytics/dashboard";
  const userDashboardPath = "/user/analytics/dashboard";

  const isAdmin = await getIsAdminFromToken(accessToken.value);
  if (request.nextUrl.pathname.startsWith(adminPath) && !isAdmin) {
    return NextResponse.redirect(new URL(userDashboardPath, request.url));
  }
  if (request.nextUrl.pathname.startsWith(userPath) && isAdmin) {
    return NextResponse.redirect(new URL(adminDashboardPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
};
