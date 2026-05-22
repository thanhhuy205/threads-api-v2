import z from "zod";

export const elasticSearchConfig = z.object({
    BONSAI_URL: z.string(),
})