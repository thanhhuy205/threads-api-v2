import z from "zod";

export const openRouterConfig = z.object({
    OPEN_ROUTER_API_KEY: z.string(),
});