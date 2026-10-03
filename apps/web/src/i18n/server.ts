import "server-only";

import { getTranslations } from "next-intl/server";

type TranslationValues = Record<string, string | number | Date>;

export async function getT(namespace?: string) {
    const translate = await getTranslations(namespace);

    return (key: string, values?: TranslationValues) => {
        try {
            return translate(key, values);
        } catch {
            return key;
        }
    };
}