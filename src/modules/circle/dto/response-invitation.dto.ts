import z from "zod";

export const responseInvitationSchema = z.object({
    circleId: z.number({ required_error: 'Circle ID is required', invalid_type_error: 'Circle ID must be a number' }),
    status: z.enum(['ACCEPTED', 'REJECTED'], {
        errorMap: () => ({ message: 'Status must be ACCEPTED or REJECTED' }),
    }),
});

export const respondJoinRequestSchema = z.object({
    userId: z.string({
        required_error: 'User ID is required',
        invalid_type_error: 'User ID must be a string',
    }).trim().min(1),
    isAccept: z.boolean({ required_error: 'isAccept is required', invalid_type_error: 'isAccept must be a boolean' }),
});

export type RespondJoinRequestDto = z.infer<typeof respondJoinRequestSchema>;
export type ResponseInvitationDto = z.infer<typeof responseInvitationSchema>;
