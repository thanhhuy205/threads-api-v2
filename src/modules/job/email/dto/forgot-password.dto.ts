export interface ForgotPasswordProducer {
    userId: string;
    email: string;
    tokenHash: string;
}