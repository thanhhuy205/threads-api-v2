import "server-only";

import { resolveAppUrl } from "@/lib/http/resolve-app-url";
import { cookies } from "next/headers";

type ServerQueryValue = string | number | boolean | null | undefined;

type ServerGetOptions = {
    auth?: boolean;
    cache?: "no-store" | "force-cache";
    params?: Record<string, ServerQueryValue>;
    revalidate?: number;
    tags?: string[];
};

const toBffPath = (path: string) => {
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return normalized.startsWith("/api/") ? normalized : `/api${normalized}`;
};

const buildUrl = async (path: string, params?: Record<string, ServerQueryValue>) => {
    const appUrl = await resolveAppUrl();
    const url = new URL(`${appUrl}${toBffPath(path)}`);

    Object.entries(params ?? {}).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") return;
        url.searchParams.set(key, String(value));
    });

    return url.toString();
};

const buildCacheOptions = ({
    cache,
    revalidate,
    tags,
}: Pick<ServerGetOptions, "cache" | "revalidate" | "tags">) => {
    const hasNextOptions =
        revalidate !== undefined || (tags !== undefined && tags.length > 0);

    if (cache === "no-store" || (!cache && !hasNextOptions)) {
        return { cache: "no-store" as const };
    }

    const next =
        hasNextOptions
            ? {
                ...(revalidate !== undefined ? { revalidate } : {}),
                ...(tags?.length ? { tags } : {}),
            }
            : undefined;

    return {
        ...(cache ? { cache } : {}),
        ...(next ? { next } : {}),
    };
};

export const serverGetJson = async <T>(
    path: string,
    { auth = true, cache, params, revalidate, tags }: ServerGetOptions = {},
): Promise<T | null> => {
    const headers = new Headers({
        Accept: "application/json",
    });

    if (auth) {
        const cookieHeader = (await cookies()).toString();

        if (cookieHeader) {
            headers.set("Cookie", cookieHeader);
        }
    }

    try {
        const response = await fetch(await buildUrl(path, params), {
            method: "GET",
            headers,
            ...buildCacheOptions({ cache, revalidate, tags }),
        });

        if (!response.ok) return null;

        return (await response.json()) as T;
    } catch {
        return null;
    }
};
