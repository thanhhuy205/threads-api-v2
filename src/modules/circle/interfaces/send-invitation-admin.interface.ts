
import { RoleMembership } from "@prisma/client";

export type SendInvitationEmailAdminInterface = {
    username: string;
    role: RoleMembership;
    description?: string;
    inviterId: string;
    circlePublicId: string;
}
