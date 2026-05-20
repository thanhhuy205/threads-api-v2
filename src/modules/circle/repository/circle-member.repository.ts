import prisma from "@/config/prisma";
import { buildPagination } from "@/shared/pagination/cursor-pagination";
import { $Enums, CircleMember, Prisma } from "@prisma/client";

class CircleMemberRepository implements ICursorPagination<Prisma.CircleMemberWhereInput, CircleMember> {
    findAll({ after, take, where, cursor }: {
        after?: string; take?: number; where?: Prisma.CircleMemberWhereInput | undefined; cursor?: Prisma.CircleMemberWhereUniqueInput | undefined;
    }): Promise<{ id: number; circleId: number; userId: string; createdAt: Date; role: $Enums.RoleMembership; }[]> {
        const { currentAfter, currentLimit } = buildPagination({ after, take });

        return prisma.circleMember.findMany({
            where,
            take: currentLimit ? currentLimit + 1 : undefined,
            skip: currentAfter ? 1 : 0,
            select: {
                id: true,
                circleId: true,
                userId: true,
                createdAt: true,
                role: true,
                user: {
                    select: {
                        name: true,
                        username: true,
                        avatar: true,
                        bio: true,
                    },
                },
            },
            cursor: currentAfter ? cursor : undefined,
        });
    }


    findMembersByCircleIdAndUserId(circleId: number, userId: string | undefined, take: number): Promise<CircleMember[]> {
        return this.findAll({
            after: userId ? userId : undefined,
            take,
            where: {
                circleId,
            },
            cursor: userId ? { circleId_userId: { circleId, userId } } : undefined,
        });

    }

    async create(data: { circleId: number; userId: string; }, tx: Prisma.TransactionClient): Promise<CircleMember> {
        const db = tx || prisma;
        const result = await db.circleMember.create({
            data: {
                circleId: data.circleId,
                userId: data.userId,
            },
        });

        return result;
    }


    async findByCircleId(circleId: number, userId: string): Promise<CircleMember[]> {
        const members = await prisma.circleMember.findMany({
            where: {
                circleId,
                userId,
            },
        });
        return members;
    }
    async findRoleByCircleId(circleId: number, userId: string): Promise<CircleMember | null> {
        const member = await prisma.circleMember.findFirst({
            where: {
                circleId,
                userId,
            },
        });
        return member;
    }

    async findMembershipsByCircleIds(circleIds: number[], userId: string) {
        if (!circleIds.length) {
            return [];
        }

        return prisma.circleMember.findMany({
            where: {
                userId,
                circleId: {
                    in: circleIds,
                },
            },
            select: {
                circleId: true,
            },
        });
    }
}

export const circleMemberRepository = new CircleMemberRepository();
