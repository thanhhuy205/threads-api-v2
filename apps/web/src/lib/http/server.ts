import "server-only";
import { resolveAppUrl } from "@/lib/http/resolve-app-url";
import { cookies } from "next/headers";

type ServerFetchInit = RequestInit & {
    auth?: boolean;
    next?: {
        revalidate?: number;
        tags?: string[];
    };
};

const toBffPath = (path: string) => {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return normalized.startsWith("/api/") ? normalized : `/api${normalized}`;
};

const buildCacheOptions = (init?: Pick<ServerFetchInit, "cache" | "next">) => {
    const hasNextOptions =
        init?.next?.revalidate !== undefined ||
        (init?.next?.tags !== undefined && init.next.tags.length > 0);

    if (init?.cache === "no-store" || (!init?.cache && !hasNextOptions)) {
        return { cache: "no-store" as const };
    }

    return {
        ...(init?.cache ? { cache: init.cache } : {}),
        ...(init?.next ? { next: init.next } : {}),
    };
};

export async function serverFetch(
    path: string,
    init?: ServerFetchInit
) {
    const { auth = true, headers, cache, next, ...requestInit } = init ?? {};
    const appUrl = await resolveAppUrl();
    const requestHeaders = new Headers(headers);

    if (!requestHeaders.has("Content-Type")) {
        requestHeaders.set("Content-Type", "application/json");
    }

    if (auth) {
        const cookieHeader = (await cookies()).toString();

        if (cookieHeader) {
            requestHeaders.set("Cookie", cookieHeader);
        }
    }

    return fetch(`${appUrl}${toBffPath(path)}`, {
        ...requestInit,
        headers: requestHeaders,
        ...buildCacheOptions({ cache, next }),
    });
}
