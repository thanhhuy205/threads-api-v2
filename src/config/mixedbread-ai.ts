import z from "zod";

export const mixedbreadAIConfig = z.object({
    MIXEDBREEDER_API_KEY: z.string().min(1),
});