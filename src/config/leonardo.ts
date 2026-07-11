import z from "zod";

export const leonardoConfig = z.object({
    LEONARDO_API_KEY: z.string().min(1, "Leonardo API key is required"),
    LEONARDO_WEBHOOK_API_KEY: z.string().min(1, "Leonardo webhook key is required"),
});
