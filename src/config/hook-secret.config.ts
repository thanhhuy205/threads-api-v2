import z from "zod";

export const hookSecretKeyConfig = z.object({
    HOOK_SECRET_KEY: z.string().default('default_hook_secret_key'),
});