import z from "zod";

export const mongodbConfig = z.object({
    MONGODB_URI: z.string().url(),
    MONGODB_PASSWORD: z.string().min(1),
    MONGODB_USER: z.string().min(1),
    MONGODB_NAME: z.string().min(1),
});