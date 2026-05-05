import prisma from "@/config/prisma";
import { SendInvitationInput } from "@/modules/circle/interfaces/send-invitation.interface";
import { buildPagination } from "@/shared/pagination/pagination";
import { Prisma } from "@prisma/client";
class CircleInvitationRepository implements IPagination<Prisma.CircleInvitationWhereInput, any> {
    findAll({ page, limit, where, props: { } }: { page: number; limit: number; where?: Prisma.CircleInvitationWhereInput | undefined; props?: any; }): Promise<any[]> {
        const { currentLimit, offset } = buildPagination({ page, limit });
        return prisma.circleInvitation.findMany({
            where: where ?? {},
            take: currentLimit,
            skip: offset,

        });
    }
    count(params: { where?: Prisma.CircleInvitationWhereInput | undefined; props?: any; }): Promise<number> {
        return prisma.circleInvitation.count({
            where: params.where ?? {},
        });
    }
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
export const circleInvitationRepository = new CircleInvitationRepository();