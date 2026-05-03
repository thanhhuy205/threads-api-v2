import z from "zod";

export const cloudinaryConfig = z.object({
    CLOUDINARY_CLOUD_NAME: z.string().min(1),
    CLOUDINARY_API_KEY: z.string().min(1),
    CLOUDINARY_API_SECRET: z.string().min(1),
    CLOUDINARY_URL: z.string().min(1),
    CLOUDINARY_UPLOAD_PRESET: z.string().min(1),
});