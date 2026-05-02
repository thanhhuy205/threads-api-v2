import { EMAIL_JOB_NAME, QUEUE_NAME } from '../src/constants/queue';
import { nodemailerService } from '../src/modules/nodemailer/service/nodemailer.service';
import { createWorker } from '../src/providers/bullmq.provider';
class EmailWorker {
    private readonly worker = createWorker(QUEUE_NAME.EMAIL_QUEUE, async (job) => {
        switch (job.name) {
            case EMAIL_JOB_NAME.SEND_VERIFICATION_EMAIL:
                return this.sendVerificationEmail(job.data);
            case EMAIL_JOB_NAME.SEND_FORGOT_PASSWORD_EMAIL:
                return this.sendForgotPasswordEmail(job.data);
            default:
                throw new Error(`Unknown job name: ${job.name}`);
        }
    })


    async sendVerificationEmail(data: { email: string; token: string }) {
        await nodemailerService.sendMail(data.email, 'Verify your email', `<p>Please verify your email by clicking the link below:</p>
                   <a href="${process.env.FRONTEND_URL}/verify-email?token=${data.token}">Verify Email</a>`, {});
        console.log(`Sent verification email to: ${data.email}`);
    }


    async sendForgotPasswordEmail(data: { email: string; token: string }) {
        await nodemailerService.sendMail(data.email, 'Reset your password', `<p>You can reset your password by clicking the link below:</p>
                   <a href="${process.env.FRONTEND_URL}/reset-password?token=${data.token}">Reset Password</a>`, {});
        console.log(`Sent forgot password email to: ${data.email}`);
    }
};

export const emailWorker = new EmailWorker();