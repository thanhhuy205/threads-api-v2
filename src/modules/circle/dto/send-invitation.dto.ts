import { z } from 'zod';

export const sendInvitationSchema = z.object({
    circleId: z.number({ required_error: 'Circle ID is required', invalid_type_error: 'Circle ID must be a number' }),
    userId: z.string().min(1, 'User ID is required'),
});

export type SendInvitationDto = z.infer<typeof sendInvitationSchema>;