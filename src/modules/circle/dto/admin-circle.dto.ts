import { RoleMembership } from "@prisma/client";
import z from "zod";

export const sendInvitationEmailSchema = z.object({
    email: z.string().email('Invalid email address'),
    role: z.enum([RoleMembership.ADMIN, RoleMembership.MEMBER, RoleMembership.OWNER], { message: 'Role must be either admin or member' }),
    description: z.string().max(255, 'Description must be at most 255 characters').optional(),
});

export type SendInvitationEmailDto = z.infer<typeof sendInvitationEmailSchema>;