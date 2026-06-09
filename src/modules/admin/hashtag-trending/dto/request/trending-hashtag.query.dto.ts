import { MAX_LIMIT } from "@/constants/pagination";
import { z } from "zod";

export const trendingHashtagQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(MAX_LIMIT).default(10),
});

export type TrendingHashtagQueryDto = z.infer<
  typeof trendingHashtagQuerySchema
>;
