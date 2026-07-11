import { RoleMembership } from "@prisma/client";
import z from "zod";

export const sendInvitationManageSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username must be at most 50 characters'),
    role: z.enum([RoleMembership.ADMIN, RoleMembership.MEMBER, RoleMembership.OWNER], { message: 'Role must be either admin or member' }),
    description: z.string().max(255, 'Description must be at most 255 characters').optional(),
});

export type SendInvitationManageDto = z.infer<typeof sendInvitationManageSchema>;