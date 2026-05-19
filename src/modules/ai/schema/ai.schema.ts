import { z } from "zod";

export const PostScoreSchema = z.object({
    score: z.number().min(0).max(10),
    label: z.enum([
        "Masterpiece",
        "Deep Talk",
        "Solid",
        "Neutral",
        "Noise",
        "Toxic",
    ]),
    reason: z.string(),
    confidence: z.number().min(0).max(1),
    isToxic: z.boolean(),
    isSpam: z.boolean(),
});