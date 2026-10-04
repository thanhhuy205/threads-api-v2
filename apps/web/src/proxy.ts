import { cookieSpecs, serializeCookie } from "@/app/api/_auth-cookies";
import { requestRefreshToken } from "@/app/api/_refresh-token";
import { configService } from "@/config";
import { routing } from "@/i18n/routing";
import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";

const intlMiddleware = createMiddleware(routing);
const SUPPORTED_LOCALES = new Set(routing.locales);
const LOCALE_HEADER_NAME = "X-NEXT-INTL-LOCALE";

const PRIVATE_PATH_PREFIXES = [
  "/activity",
  "/growth",
  "/profile",
  "/search",
  "/settings",
  "/"
] as const;

type AuthTokens = {
  accessToken: string | null;
  refreshToken: string | null;
};

type RefreshedTokens = {
  accessToken: string;
  refreshToken?: string;
  sessionId?: string;
};

const isPathUnder = (
  pathname: string,
  prefixes: readonly string[],
  locale: string,
) =>
  prefixes.some(
    (prefix) =>
      pathname === prefix || pathname.startsWith(`${prefix}/${locale}`),
  );

const resolveLocalePath = (pathname: string) => {
  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0];

  if (!locale || !SUPPORTED_LOCALES.has(locale as "en" | "vi")) {
    return null;
  }

  const pathWithoutLocale = `/${segments.slice(1).join("/")}`;

  return {
    locale,
    pathname: pathWithoutLocale === "/" ? "/" : pathWithoutLocale || "/",
  };
};

const getRequestAuthTokens = (request: NextRequest): AuthTokens => ({
  accessToken:
    request.cookies.get(configService.accessTokenCookieName)?.value ?? null,
  refreshToken:
    request.cookies.get(configService.refreshTokenCookieName)?.value ?? null,
});

const setAuthCookies = (headers: Headers, tokens: RefreshedTokens) => {
  const { access, refresh } = cookieSpecs();

  headers.append(
    "set-cookie",
    serializeCookie(access.name, tokens.accessToken, access.maxAge),
  );

  if (tokens.refreshToken) {
    headers.append(
      "set-cookie",
      serializeCookie(refresh.name, tokens.refreshToken, refresh.maxAge),
    );
  }
};

const clearAuthCookies = (headers: Headers) => {
  const { access, refresh } = cookieSpecs();

  headers.append("set-cookie", serializeCookie(access.name, "", 0));
  headers.append("set-cookie", serializeCookie(refresh.name, "", 0));
};

const copyLocaleCookies = (target: NextResponse, source: NextResponse) => {
  for (const cookie of source.cookies.getAll()) {
    target.cookies.set({ ...cookie });
  }
};

const copyLocaleHeader = (target: NextResponse, source: NextResponse) => {
  const linkHeader = source.headers.get("link");
  if (linkHeader) {
    target.headers.set("link", linkHeader);
  }
};

const buildCookieHeader = (request: NextRequest, tokens: RefreshedTokens) => {
  const cookies = new Map(
    request.cookies
      .getAll()
      .map((cookie) => [cookie.name, cookie.value] as const),
  );

  cookies.set(configService.accessTokenCookieName, tokens.accessToken);

  if (tokens.refreshToken !== undefined) {
    cookies.set(configService.refreshTokenCookieName, tokens.refreshToken);
  }

  return Array.from(cookies.entries())
    .map(([name, value]) => `${name}=${encodeURIComponent(value)}`)
    .join("; ");
};

const buildDownstreamHeaders = (
  request: NextRequest,
  locale: string,
  tokens?: RefreshedTokens,
) => {
  const headers = new Headers(request.headers);
  headers.set(LOCALE_HEADER_NAME, locale);

  if (tokens) {
    headers.set("cookie", buildCookieHeader(request, tokens));

    if (tokens.sessionId) {
      headers.set("x-session-id", tokens.sessionId);
    }
  }

  return headers;
};

export async function proxy(request: NextRequest) {
  const localePath = resolveLocalePath(request.nextUrl.pathname);
  const intlResponse = intlMiddleware(request);

  if (!localePath) {
    return intlResponse;
  }

  const { locale, pathname } = localePath;
  const tokens = getRequestAuthTokens(request);
  const isPrivateRoute = isPathUnder(pathname, PRIVATE_PATH_PREFIXES, locale);
  if (isPrivateRoute) {
    if (!tokens.accessToken) {
      if (!tokens.refreshToken) {
        return intlResponse;
      }
      const refreshed = await requestRefreshToken(tokens.refreshToken);
      if (!refreshed?.accessToken) {
        clearAuthCookies(intlResponse.headers);
        return intlResponse;
      }

      const response = NextResponse.next({
        request: {
          headers: buildDownstreamHeaders(request, locale, refreshed),
        },
      });
      copyLocaleCookies(response, intlResponse);
      copyLocaleHeader(response, intlResponse);
      setAuthCookies(response.headers, refreshed);
      return response;
    }

    return intlResponse;
  }

  return intlResponse;
}

export default proxy;

export const config = {
  matcher: ["/", "/(en|vi)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
