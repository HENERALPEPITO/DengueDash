import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { validateToken, verifyTokenSignature } from "./lib/token";
import { cookies } from "next/headers";

type refreshTokenResponse = {
  access: string;
};

export async function middleware(request: NextRequest, event: NextFetchEvent) {
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

  const isRefreshTokenExpired = await validateToken(refreshToken.value);

  // Verify if refresh token is expired
  if (isRefreshTokenExpired) {
    deleteCookies();
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Verify the signatures for both tokens
  const isAccessTokenSignatureValid = await verifyTokenSignature(
    accessToken.value
  );
  const isRefreshTokenSignatureValid = await verifyTokenSignature(
    refreshToken.value
  );
  if (!isAccessTokenSignatureValid || !isRefreshTokenSignatureValid) {
    deleteCookies();
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Return the default NextResponse if no refresh is required
  return NextResponse.next();
}

// Todo: Add more routes
// Todo: Implement different views for different user roles
// Eg. Admin => /admin/dashboard
// Eg. User => /user/dashboard
export const config = {
  matcher: [
    "/user/analytics/dashboard",
    "/user/analytics/forecasting",
    "/user/forms/case-report-form",
    "/user/data-tables/dengue-reports",
    // todo: this link does not work
    "/user/data-tables/dengue-reports/[id]",
  ],
};
