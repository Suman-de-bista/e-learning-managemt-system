import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function tryRefresh(request: NextRequest): Promise<Headers | null> {
  const refreshCookie = request.cookies.get("refresh_token");
  if (!refreshCookie?.value) {
    return null;
  }

  const res = await fetch(`${BASE_URL}/auths/refresh`, {
    method: "POST",
    headers: { cookie: request.headers.get("cookie") ?? "" },
  });

  if (!res.ok) {
    return null;
  }

  return res.headers;
}

function withForwardedCookies(response: NextResponse, refreshedHeaders: Headers | null) {
  const setCookies = refreshedHeaders?.getSetCookie?.() ?? [];
  for (const cookie of setCookies) {
    response.headers.append("set-cookie", cookie);
  }
  return response;
}

function clearAuthCookies(response: NextResponse) {
  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");
  return response;
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tokenCookie = request.cookies.get("access_token");
  const hadRefreshCookie = !!request.cookies.get("refresh_token")?.value;
  let hasAccessToken = !!tokenCookie?.value;
  let refreshedHeaders: Headers | null = null;
  let refreshFailed = false;

  if (!hasAccessToken && hadRefreshCookie) {
    refreshedHeaders = await tryRefresh(request);
    hasAccessToken = !!refreshedHeaders;
    refreshFailed = !hasAccessToken;
  }

  // If user has token and tries to access login, redirect to dashboard
  if ((pathname === "/" || pathname === "/register") && hasAccessToken) {
    return withForwardedCookies(
      NextResponse.redirect(new URL("/dashboard", request.url)),
      refreshedHeaders,
    );
  }

  // If neither access nor refresh token got us a session, redirect to login
  if (pathname.startsWith("/dashboard") && !hasAccessToken) {
    const response = NextResponse.redirect(new URL("/", request.url));
    return refreshFailed ? clearAuthCookies(response) : response;
  }

  return withForwardedCookies(NextResponse.next(), refreshedHeaders);
}

export const config = {
  matcher: ["/", "/register", "/dashboard/:path*"],
};
