import { cookieSpecs, serializeCookie } from "@/app/api/_auth-cookies";
import { configService } from "@/config";
import { ApiResponse } from "@/lib/http/api-response";
import type { ZodTypeAny } from "zod";

const REFRESH_TOKEN_HEADER = "x-refresh-token";
const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "host",
  "content-length",
  "cookie",
  "authorization",
  REFRESH_TOKEN_HEADER,
]);

const resolveUpstreamUrl = (path: string) => {
  const base = configService.backendUrl;
  if (!base) throw new Error("Missing API base URL. Set BACKEND_URL.");

  return `${base.replace(/\/+$/, "")}${path}`;
};

const toJson = async (source: Request | Response): Promise<unknown> => {
  try {
    return await source.json();
  } catch {
    return null;
  }
};

const readStringField = (obj: unknown, key: string): string | null => {
  if (!obj || typeof obj !== "object") return null;
  const value = (obj as Record<string, unknown>)[key];
  return typeof value === "string" ? value : null;
};

type AuthTokens = { accessToken: string | null; refreshToken: string | null };
const EMPTY_TOKENS: AuthTokens = { accessToken: null, refreshToken: null };

const parseCookieHeader = (header: string): Map<string, string> => {
  const map = new Map<string, string>();
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    map.set(
      part.slice(0, eq).trim(),
      decodeURIComponent(part.slice(eq + 1).trim()),
    );
  }
  return map;
};

export const getRequestAuthTokens = (request: Request): AuthTokens => {
  const header = request.headers.get("cookie");
  if (!header) return EMPTY_TOKENS;
  const cookies = parseCookieHeader(header);
  return {
    accessToken: cookies.get(configService.accessTokenCookieName) ?? null,
    refreshToken: cookies.get(configService.refreshTokenCookieName) ?? null,
  };
};

const getTokensFromPayload = (payload: unknown): AuthTokens => {
  const data =
    payload && typeof payload === "object"
      ? (payload as { data?: unknown }).data
      : null;
  return {
    accessToken: readStringField(data, "accessToken"),
    refreshToken: readStringField(data, "refreshToken"),
  };
};

export const setAuthCookies = (headers: Headers, tokens: AuthTokens) => {
  const { access, refresh } = cookieSpecs();
  if (tokens.accessToken)
    headers.append(
      "set-cookie",
      serializeCookie(access.name, tokens.accessToken, access.maxAge),
    );
  if (tokens.refreshToken)
    headers.append(
      "set-cookie",
      serializeCookie(refresh.name, tokens.refreshToken, refresh.maxAge),
    );
};

const clearAuthCookies = (headers: Headers) => {
  const { access, refresh } = cookieSpecs();
  for (const { name } of [access, refresh]) {
    headers.append("set-cookie", serializeCookie(name, "", 0));
  }
};

export const validateBody = async <TSchema extends ZodTypeAny>(
  request: Request,
  schema: TSchema,
) => {
  const body = await toJson(request);
  if (body === null) {
    return {
      ok: false as const,
      response: ApiResponse.error("Invalid JSON body", { status: 400 }),
    };
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return {
      ok: false as const,
      response: ApiResponse.validation(parsed.error.flatten()),
    };
  }
  return { ok: true as const, data: parsed.data };
};

type ProxyResponseOptions = {
  syncAuthCookies?: boolean;
  clearAuthCookies?: boolean;
  redactAuthPayload?: boolean;
};

const redactAuthTokens = (payload: unknown) => {
  if (!payload || typeof payload !== "object" || !("data" in payload))
    return payload;
  const { data, ...rest } = payload as { data?: unknown };
  if (!data || typeof data !== "object" || Array.isArray(data)) return payload;
  const safeData = { ...(data as Record<string, unknown>) };
  delete safeData.accessToken;
  delete safeData.refreshToken;
  return { ...rest, data: safeData };
};

const toProxyResponse = async (
  upstream: Response,
  headers: Headers,
  opts: ProxyResponseOptions,
) => {
  const contentType = upstream.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    if (opts.clearAuthCookies) clearAuthCookies(headers);
    if (contentType) headers.set("content-type", contentType);
    return new Response(upstream.body, {
      status: upstream.status,
      headers,
    });
  }

  const payload = await toJson(upstream);

  if (payload === null) {
    return ApiResponse.error("Invalid JSON response from upstream", {
      status: 502,
      headers,
    });
  }

  if (opts.syncAuthCookies) {
    const tokens = getTokensFromPayload(payload);
    setAuthCookies(headers, tokens);
  }
  if (opts.clearAuthCookies) clearAuthCookies(headers);

  return Response.json(
    opts.redactAuthPayload ? redactAuthTokens(payload) : payload,
    {
      status: upstream.status,
      headers,
    },
  );
};

type ForwardOptions = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  authorization?: string | null;
  refreshToken?: string | null;
  body?: unknown;
  headers?: HeadersInit;
  syncAuthCookies?: boolean;
  clearAuthCookies?: boolean;
  redactAuthPayload?: boolean;
};

export const forwardAuthRequest = async (options: ForwardOptions) => {
  const headers = new Headers({
    Accept: "application/json",
    ...Object.fromEntries(new Headers(options.headers)),
  });

  if (options.authorization)
    headers.set("Authorization", options.authorization); // set bearer token
  if (options.refreshToken)
    headers.set(REFRESH_TOKEN_HEADER, options.refreshToken); // set x-refresh-token

  const init: RequestInit = {
    method: options.method,
    headers,
    cache: "no-store",
  };

  if (options.body !== undefined) {
    init.body = JSON.stringify(options.body);
    headers.set("Content-Type", "application/json");
  }

  const responseHeaders = new Headers(headers);

  try {
    const response = await fetch(resolveUpstreamUrl(options.path), init);
    return toProxyResponse(response, responseHeaders, options);
  } catch {
    return ApiResponse.error("Upstream auth service unavailable", {
      status: 502,
      headers: responseHeaders,
    });
  }
};

const createForwardHeaders = (request: Request) => {
  const headers = new Headers();

  request.headers.forEach((value, key) => {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) headers.set(key, value);
  });

  return headers;
};

export const forwardProxyRequest = async (request: Request, path: string) => {
  const tokens = getRequestAuthTokens(request);

  const pathname = path.startsWith("/") ? path : `/${path}`; // fallback path

  const upstreamPath = `${pathname}${new URL(request.url).search}`; // server be

  const baseHeader = createForwardHeaders(request);

  if (tokens.accessToken && !baseHeader.has("Authorization")) {
    baseHeader.set("Authorization", `Bearer ${tokens.accessToken}`);
  }

  const hasBody = request.method !== "GET" && request.method !== "HEAD";

  const body = hasBody ? await request.arrayBuffer() : undefined;

  try {
    const callUpstream = (accessToken: string | null) => {
      const headers = new Headers(baseHeader);

      if (accessToken)
        headers.set("Authorization", `Bearer ${accessToken}`);
      return fetch(resolveUpstreamUrl(upstreamPath), {
        method: request.method,
        headers,
        body: body && body.byteLength > 0 ? body.slice(0) : undefined,
        cache: "no-store",
      });
    };
    const responseHeaders = new Headers();
    const upstream = await callUpstream(tokens.accessToken);
    return toProxyResponse(upstream, responseHeaders, {});
  } catch {
    return ApiResponse.error("Upstream API service unavailable", {
      status: 502,
    });
  }
};
