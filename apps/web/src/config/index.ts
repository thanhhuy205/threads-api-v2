const parseEnvInt = (value: string | undefined, fallback: number): number => {
  if (value === undefined) return fallback;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
};

export const configService = {
  get backendUrl(): string {
    return process.env.BACKEND_URL ?? "";
  },
  get nextPublicBaseUrl(): string {
    return process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  },
  get nodeEnv(): string {
    return process.env.NODE_ENV ?? "development";
  },
  get isProd(): boolean {
    return this.nodeEnv === "production";
  },
  get isDev(): boolean {
    return this.nodeEnv === "development";
  },
  get soketiKey(): string {
    return process.env.NEXT_PUBLIC_SOKETI_KEY || "9bb6c219";
  },
  get soketiHost(): string {
    return process.env.NEXT_PUBLIC_SOKETI_HOST || "soketi.huydarealest.dev";
  },
  get soketiPort(): number {
    return parseEnvInt(process.env.NEXT_PUBLIC_SOKETI_PORT, 443);
  },
  get accessTokenCookieName(): string {
    return process.env.ACCESS_TOKEN_COOKIE_NAME ?? "__Host-at";
  },
  get refreshTokenCookieName(): string {
    return process.env.REFRESH_TOKEN_COOKIE_NAME ?? "__Host-rt";
  },
  get accessTokenCookieMaxAge(): number {
    return parseEnvInt(process.env.ACCESS_TOKEN_COOKIE_MAX_AGE, 60 * 14);
  },
  get refreshTokenCookieMaxAge(): number {
    return parseEnvInt(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE, 60 * 60 * 24 * 7);
  },
} as const;
