import z from "zod";

export const mixedbreadAIConfig = z.object({
    MIXEDBREAD_API_KEY: z.string().min(1),
});