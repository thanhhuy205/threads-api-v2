import { z } from 'zod';

export const sendInvitationSchema = z.object({
    circleId: z.number(),
    userId: z.string(),
});

export type SendInvitationDto = z.infer<typeof sendInvitationSchema>;