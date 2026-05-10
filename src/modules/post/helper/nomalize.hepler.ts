export const normalizeTopic = (topic?: string): string | undefined => {
    if (!topic) {
        return undefined;
    }

    const normalized = topic.trim().replace(/\s+/g, " ").toLowerCase();
    return normalized || undefined;
}
