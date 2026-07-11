import z from "zod";

export const cloudflareConfig = z.object({
    R2_ENDPOINT: z.string().url(),
    R2_BUCKET_NAME: z.string().min(1),
    R2_TOKEN_VALUE: z.string().min(1),
    R2_ACCOUNT_ID: z.string().min(1),
    R2_ACCESS_KEY_ID: z.string().min(1),
    R2_SECRET_ACCESS_KEY: z.string().min(1),
    S3_ENDPOINT: z.string().url(),
});