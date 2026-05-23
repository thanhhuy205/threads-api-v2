
import { RoleMembership } from "@prisma/client";

export type SendInvitationEmailAdminInterface = {
    email: string;
    role: RoleMembership;
    description?: string;
    inviterId: string;
    circlePublicId: string;
}
