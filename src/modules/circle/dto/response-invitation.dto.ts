import z from "zod";

export const responseInvitationSchema = z.object({
    circleId: z.number({ required_error: 'Circle ID is required', invalid_type_error: 'Circle ID must be a number' }),
    status: z.enum(['ACCEPTED', 'REJECTED'], {
        errorMap: () => ({ message: 'Status must be ACCEPTED or REJECTED' }),
    }),
});

export type ResponseInvitationDto = z.infer<typeof responseInvitationSchema>;