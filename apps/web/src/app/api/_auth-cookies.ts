import { configService } from "@/config";

type CookieSpec = { name: string; maxAge: number };

export const cookieSpecs = (): { access: CookieSpec; refresh: CookieSpec } => ({
  access: {
    name: configService.accessTokenCookieName,
    maxAge: configService.accessTokenCookieMaxAge,
  },
  refresh: {
    name: configService.refreshTokenCookieName,
    maxAge: configService.refreshTokenCookieMaxAge,
  },
});

export const serializeCookie = (
  name: string,
  value: string,
  maxAge: number,
) => {
  const secure =
    name.startsWith("__Host-") || configService.isProd ? "; Secure" : "";
  const encoded = encodeURIComponent(value);
  return `${name}=${encoded}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax${secure}`;
};
