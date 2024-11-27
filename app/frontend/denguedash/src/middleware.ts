import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { validateToken } from "./lib/token";
import { cookies } from "next/headers";

type refreshTokenResponse = {
  access: string;
};

export async function middleware(request: NextRequest, event: NextFetchEvent) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token");
  const refreshToken = cookieStore.get("refresh_token");

  // Check if tokens exist
  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const isRefreshTokenExpired = await validateToken(refreshToken.value);

  // Verify if refresh token is expired
  if (isRefreshTokenExpired) {
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const isAccessTokenExpired = await validateToken(accessToken.value);
  if (isAccessTokenExpired) {
    const getAccessToken = fetch(
      process.env.NEXT_PUBLIC_DJANGO_URL + "token/refresh/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken.value }),
      }
    );
    event.waitUntil(getAccessToken);

    try {
      const response = await getAccessToken;
      const data: refreshTokenResponse = await response.json();

      const newAccessToken = data.access;
      if (newAccessToken) {
        // Create a new NextResponse to set the cookie
        const nextResponse = NextResponse.next();
        nextResponse.cookies.set("access_token", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });

        // Return the modified NextResponse
        return nextResponse;
      }
    } catch (error) {
      console.error("Error refreshing access token:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Return the default NextResponse if no refresh is required
  return NextResponse.next();
}

// Todo: Add more routes
// Todo: Implement different views for different user roles
// Eg. Admin => /admin/dashboard
// Eg. User => /user/dashboard
export const config = {
  matcher: ["/user/analytics/dashboard", "/user/forms/case-report-form"],
};
