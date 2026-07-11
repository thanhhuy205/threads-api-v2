import configService from "@/config/config";
import nodemailer from "nodemailer";
export const transporter = nodemailer.createTransport({
    host: configService.NODEMAILER_HOST,
    port: configService.NODEMAILER_PORT,
    secure: configService.NODEMAILER_SECURE,
    auth: {
        user: configService.NODEMAILER_USER,
        pass: configService.NODEMAILER_PASS,
    },
});