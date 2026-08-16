import { transporter } from "@/providers/nodemailer.provider";
import configService from '@/config/config';
import { TransportOptions } from "nodemailer";

class NodemailerService {
    private readonly transporter = transporter;
    
    async sendMail(to: string, subject: string, html: string, options: TransportOptions) {
        try {
            const info = await this.transporter.sendMail({
                from: `"Threads API" <${configService.NODEMAILER_CONFIG.NODEMAILER_USER}>`,
                to,
                subject,
                html,
                ...options,
            });        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}

export const nodemailerService = new NodemailerService();
