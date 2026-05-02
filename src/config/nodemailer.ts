import z from "zod";

export const nodemailerConfig = z.object({
    NODEMAILER_HOST: z.string().min(1),
    NODEMAILER_PORT: z.string().min(1).transform(Number),
    NODEMAILER_SECURE: z.string().min(1).transform((v) => v === 'true'),
    NODEMAILER_USER: z.string().min(1),
    NODEMAILER_PASS: z.string().min(1),
})