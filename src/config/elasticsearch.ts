import z from "zod";

export const elasticSearchConfig = z.object({
    node: z.string(),
})