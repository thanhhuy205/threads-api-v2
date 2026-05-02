import z from "zod";

export const mixedbreadAIConfig = z.object({
    MIXEDBREAD_API_KEY: z.string().min(1),
    MIXEDBREAD_MODEL_NAME: z.string().min(1),
});