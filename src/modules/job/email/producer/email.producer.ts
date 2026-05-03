import { EMAIL_JOB_NAME, QUEUE_NAME } from '@/constants/queue';
import { ForgotPasswordProducer } from '@/modules/job/email/dto/forgot-password.dto';
import { CreateVerifyEmailProducer } from '@/modules/job/email/dto/verify-email.dto';
import { createQueue } from '@/providers/bullmq.provider';
class EmailProducer {
    private readonly queue = createQueue(QUEUE_NAME.EMAIL_QUEUE);

    constructor() {
    }


    async sendVerifyEmail(payload: CreateVerifyEmailProducer) {
        await this.queue.add(EMAIL_JOB_NAME.SEND_VERIFICATION_EMAIL, {
            ...payload,
        });
    }

    async sendForgotPasswordEmail(payload: ForgotPasswordProducer) {
        await this.queue.add(EMAIL_JOB_NAME.SEND_FORGOT_PASSWORD_EMAIL, {
            ...payload,
        });
    }
}

export const emailProducer = new EmailProducer();