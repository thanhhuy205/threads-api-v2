import prisma from "@/config/prisma";
import { CreateCircleInput } from "@/modules/circle/interfaces/circle-service.interface";
import { buildPagination } from "@/shared/pagination/pagination";
import { $Enums, Circle, CircleInvitationStatus, Prisma, RoleMembership } from "@prisma/client";

class CircleRepository implements IPagination<Prisma.CircleWhereInput, Circle> {
    async findAll({ page, limit, where, orderBy }: { page: number; limit: number; where?: Prisma.CircleWhereInput | undefined; orderBy?: any; }): Promise<{ name: string; id: number; userId: string; createdAt: Date; updatedAt: Date; visibility: $Enums.Visibility; createById: string; }[]> {
        const { currentLimit, offset } = buildPagination({ page, limit });
        const circles = await prisma.$queryRaw`
            SELECT 
                c.*,
                COUNT(cm.id) as member_count
            FROM circles c
            LEFT JOIN circle_members cm ON c.id = cm.circle_id
            WHERE c.visibility != 'CIRCLE' 
            GROUP BY c.id
            ORDER BY member_count DESC
            LIMIT ${currentLimit} OFFSET ${offset}
            `;
        return circles as any;
    }
    count(params: { where?: Prisma.CircleWhereInput | undefined; }): Promise<number> {
        throw new Error("Method not implemented.");
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