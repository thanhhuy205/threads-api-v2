import configService from '@libs/core/config/config';
import nodemailer, { type SendMailOptions } from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: configService.NODEMAILER_CONFIG.NODEMAILER_HOST,
  port: configService.NODEMAILER_CONFIG.NODEMAILER_PORT,
  secure: configService.NODEMAILER_CONFIG.NODEMAILER_SECURE,
  auth: {
    user: configService.NODEMAILER_CONFIG.NODEMAILER_USER,
    pass: configService.NODEMAILER_CONFIG.NODEMAILER_PASS,
  },
});

export function sendMail(
  to: string,
  subject: string,
  html: string,
  options: SendMailOptions = {},
) {
  return transporter.sendMail({
    from: `"Threads API" <${configService.NODEMAILER_CONFIG.NODEMAILER_USER}>`,
    to,
    subject,
    html,
    ...options,
  });
}
