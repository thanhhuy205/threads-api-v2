import ejs from 'ejs';
import path from 'path';
import configService from '../src/config/config';
import { EMAIL_JOB_NAME, QUEUE_NAME } from '../src/constants/queue';
import { baseLogger } from '../src/middlewares/logger';
import { ForgotPasswordProducer } from '../src/modules/job/email/dto/forgot-password.dto';
import { nodemailerService } from '../src/modules/nodemailer/service/nodemailer.service';
import { createWorker } from '../src/providers/bullmq.provider';
class EmailWorker {
    private readonly worker = createWorker(QUEUE_NAME.EMAIL_QUEUE, async (job) => {
        switch (job.name) {
            case EMAIL_JOB_NAME.SEND_VERIFICATION_EMAIL:
                return this.sendVerificationEmail(job.data);
            case EMAIL_JOB_NAME.SEND_FORGOT_PASSWORD_EMAIL:
                return this.sendForgotPasswordEmail(job.data);

            case EMAIL_JOB_NAME.SEND_INVITATION_EMAIL:
                return this.sendInvitationEmail(job.data);
            default:
                throw new Error(`Unknown job name: ${job.name}`);
        }
    })


    async sendVerificationEmail(data: { email: string; token: string, originUrl: string }) {
        const verifyLink = `${data.originUrl}/verify-email?token=${data.token}`;
        const html = await ejs.renderFile(
            path.join(process.cwd(), './template/verify-email.ejs'),
            {
                appName: 'Threads',
                verifyUrl: verifyLink,
                expiresInMinutes: configService.RESEND_VERIFY_EMAIL_TOKEN_EXPIRES_IN_TEXT,
                currentYear: new Date().getFullYear(),
            }
        );
        await nodemailerService.sendMail(data.email, 'Verify your email', html, {});
        baseLogger.info(`Sent verification email to: ${data.email}`);
    }


    async sendForgotPasswordEmail(data: ForgotPasswordProducer) {
        const resetLink = `${configService.FRONTEND_URL}/reset-password?token=${data.token}`;
        const html = await ejs.renderFile(
            path.join(process.cwd(), './template/forgot-password.ejs'),
            {
                appName: 'Threads',
                resetUrl: resetLink,
                expiresInMinutes: configService.RESET_PASSWORD_TOKEN_EXPIRES_IN_TEXT,
                currentYear: new Date().getFullYear(),
            }
        );
        await nodemailerService.sendMail(data.email, 'Reset your password', html, {});
        baseLogger.info(`Sent forgot password email to: ${data.email}`);
    }

    async sendInvitationEmail(data: { email: string; token: string, username: string }) {
        const invitationLink = `${configService.FRONTEND_URL}/join-group?token=${data.token}`;
        const html = await ejs.renderFile(
            path.join(process.cwd(), './template/invitation-email.ejs'),
            {
                appName: 'Threads',
                invitationUrl: invitationLink,
                username: data.username,
                currentYear: new Date().getFullYear(),
            }
        );
        await nodemailerService.sendMail(data.email, 'You are invited to join Threads', html, {});
        baseLogger.info(`Sent invitation email to: ${data.email}`);
    }
};

export const emailWorker = new EmailWorker();