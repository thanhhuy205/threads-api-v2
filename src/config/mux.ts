import z from "zod";

export const muxConfig = z.object({
    MUX_ACCESS_TOKEN_ID: z.string(),
    MUX_SECRET_KEY: z.string(),
});