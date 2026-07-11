export interface ResponseInvitationInput {
    circleId: number;
    userId: string;
    status: 'ACCEPTED' | 'REJECTED';
}