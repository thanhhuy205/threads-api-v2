import prisma from "@/config/prisma";
import { CreateCircleInput } from "@/modules/circle/interfaces/circle-service.interface";
import { buildPagination } from "@/shared/pagination/pagination";
import { $Enums, Circle, CircleInvitationStatus, Prisma, RoleMembership } from "@prisma/client";

type CircleRaw = {
    id: number;
    name: string;
    user_id: string;
    created_at: string;
    updated_at: string;
    visibility: string;
    create_by_id: string;
    member_count: number;
}


type CircleFormat = {
    id: number;
    name: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    visibility: $Enums.Visibility;
    createById: string;
    memberCount: number;
}
class CircleRepository implements IPagination<Prisma.CircleWhereInput, CircleFormat> {
    async findAll({ page, limit, where, orderBy }: { page: number; limit: number; where?: Prisma.CircleWhereInput | undefined; orderBy?: any; }): Promise<CircleFormat[]> {
        const { currentLimit, offset } = buildPagination({ page, limit });
        const circles: CircleRaw[] = await prisma.$queryRaw`
            SELECT c.* , COUNT(cm.circle_id) as member_count FROM circles as c  
            JOIN circle_members as cm ON c.id = cm.circle_id 
            GROUP BY cm.circle_id  
            ORDER BY COUNT(cm.circle_id) desc 
            LIMIT ${currentLimit} OFFSET ${offset}
            `;

        return circles.map(c => ({
            id: Number(c.id),
            name: c.name,
            userId: c.user_id,
            createdAt: new Date(c.created_at),
            updatedAt: new Date(c.updated_at),
            visibility: c.visibility as $Enums.Visibility,
            createById: c.create_by_id,
            memberCount: Number(c.member_count),
        }));
    }
    count(params: { where?: Prisma.CircleWhereInput | undefined; }): Promise<number> {
        return prisma.circle.count({
            where: params.where,
        });
    }

    async create(data: CreateCircleInput): Promise<Circle> {
        const result = await prisma.circle.create({
            data: {
                userId: data.userId,
                name: data.name,
                visibility: data.visibility,
                createById: data.createById,
                circleMembers: {
                    create: {
                        userId: data.userId,
                        role: RoleMembership.ADMIN
                    }
                }
            },
        });

        return result;
    }

    async findInvitation(circleId: number, userId: string) {
        const invitation = await prisma.circleInvitation.findFirst({
            where: {
                circleId,
                userId,
                status: CircleInvitationStatus.PENDING,
            },
        });
        return invitation;
    }

    async acceptInvitation(circleId: number, userId: string, tx: Prisma.TransactionClient) {
        const db = tx || prisma;
        await db.circleInvitation.updateMany({
            where: {
                circleId,
                userId,
                status: CircleInvitationStatus.PENDING,
            },
            data: {
                status: CircleInvitationStatus.ACCEPTED,
            },
        });
    }



}

export const circleRepository = new CircleRepository();