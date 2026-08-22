import { EMAIL_JOB_NAME, QUEUE_NAME } from '@/constants/queue';
import { ForgotPasswordProducer } from '../dto/forgot-password.dto';
import { CreateVerifyEmailProducer } from '../dto/verify-email.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class EmailProducer {
    constructor(@InjectQueue(QUEUE_NAME.EMAIL_QUEUE) private readonly queue: Queue) { }


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

    async sendInvitationEmail(payload: { email: string; token: string, username: string }) {
        await this.queue.add(EMAIL_JOB_NAME.SEND_INVITATION_EMAIL, {
            ...payload,
        });
    }
}
