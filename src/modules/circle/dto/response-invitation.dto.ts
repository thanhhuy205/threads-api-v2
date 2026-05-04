import z from "zod";

export const responseInvitationSchema = z.object({
    circleId: z.number(),
    status: z.enum(['ACCEPTED', 'REJECTED']),
});

export type ResponseInvitationDto = z.infer<typeof responseInvitationSchema>;