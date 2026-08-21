import ejs from 'ejs';
import path from 'path';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import configService from '@libs/core/config/config';
import { EMAIL_JOB_NAME, QUEUE_NAME } from '@libs/core/constants/queue';
import { ForgotPasswordProducer } from '@api/modules/job/email/dto/forgot-password.dto';
import { sendMail } from '@libs/mailer';
import { Job } from 'bullmq';

@Processor(QUEUE_NAME.EMAIL_QUEUE)
export class EmailWorker extends WorkerHost {
    private readonly logger = new Logger(EmailWorker.name, { timestamp: true });
    async process(job: Job<any, any, string>): Promise<any> {
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
    }


    async sendVerificationEmail(data: { email: string; token: string, originUrl: string }) {
        const verifyLink = `${data.originUrl}/verify-email?token=${data.token}`;
        const html = await ejs.renderFile(
            path.join(process.cwd(), './template/verify-email.ejs'),
            {
                appName: 'Threads',
                verifyUrl: verifyLink,
                expiresInMinutes: configService.JWT_CONFIG.RESEND_VERIFY_EMAIL_TOKEN_EXPIRES_IN_TEXT,
                currentYear: new Date().getFullYear(),
            }
        );
        await sendMail(data.email, 'Verify your email', html);
        this.logger.log(`Sent verification email to: ${data.email}`);
    }


    async sendForgotPasswordEmail(data: ForgotPasswordProducer) {
        const resetLink = `${configService.APP_CONFIG.FRONTEND_URL}/reset-password?token=${data.token}`;
        const html = await ejs.renderFile(
            path.join(process.cwd(), './template/forgot-password.ejs'),
            {
                appName: 'Threads',
                resetUrl: resetLink,
                expiresInMinutes: configService.JWT_CONFIG.RESET_PASSWORD_TOKEN_EXPIRES_IN_TEXT,
                currentYear: new Date().getFullYear(),
            }
        );
        await sendMail(data.email, 'Reset your password', html);
        this.logger.log(`Sent forgot password email to: ${data.email}`);
    }

    async sendInvitationEmail(data: { email: string; token: string, username: string }) {
        const invitationLink = `${configService.APP_CONFIG.FRONTEND_URL}/join-group?token=${data.token}`;
        const html = await ejs.renderFile(
            path.join(process.cwd(), './template/invitation-email.ejs'),
            {
                appName: 'Threads',
                invitationUrl: invitationLink,
                username: data.username,
                currentYear: new Date().getFullYear(),
            }
        );
        await sendMail(data.email, 'You are invited to join Threads', html);
        this.logger.log(`Sent invitation email to: ${data.email}`);
    }
}
