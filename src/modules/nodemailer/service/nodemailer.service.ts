import { transporter } from "@/providers/nodemailer.provider";
import { TransportOptions } from "nodemailer";

class NodemailerService {
    private readonly transporter = transporter;

    async sendMail(to: string, subject: string, html: string, options: TransportOptions) {
        try {
            const info = await this.transporter.sendMail({
                from: `"Threads API" <${process.env.NODEMAILER_USER}>`,
                to,
                subject,
                html,
                ...options,
            });
            console.log('Email sent: %s', info.messageId);
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}

export const nodemailerService = new NodemailerService();