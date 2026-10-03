const LOCALES = ["vi", "en"];

export function normalizePathname(pathname: string) {
    const segments = pathname.split("/").filter(Boolean);

    if (LOCALES.includes(segments[0])) {
        segments.shift();
    }
    return "/" + segments.join("/");
}