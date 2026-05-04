import prisma from "@/config/prisma";
import { SendInvitationInput } from "@/modules/circle/interfaces/send-invitation.interface";
class CircleInvitationRepository {
    async createInvitation(data: SendInvitationInput, inviterId: string) {
        const invitation = await prisma.circleInvitation.create({
            data: {
                circleId: data.circleId,
                userId: data.userId,
                inviterId,
            },
        });

        return invitation;
    }
}
