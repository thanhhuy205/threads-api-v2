export interface ForgotPasswordProducer {
    userId: string;
    email: string;
    token: string;
}