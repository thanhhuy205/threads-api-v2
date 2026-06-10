import prisma from "@/config/prisma";
import { buildPagination } from "@/shared/pagination/cursor-pagination";
import { buildPagination as buildOffsetPagination } from "@/shared/pagination/pagination";
import { $Enums, CircleMember, Prisma, RoleMembership } from "@prisma/client";

export type CircleMemberListType = "manage" | "default";

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

    findMembersByCircleIdPaginated({
        circleId,
        page,
        limit,
        type,
    }: {
        circleId: number;
        page: number;
        limit: number;
        type: CircleMemberListType;
    }) {
        const { offset, currentLimit } = buildOffsetPagination({ page, limit });

        return prisma.circleMember.findMany({
            where: {
                circleId,
                role: type === "manage"
                    ? { in: [RoleMembership.OWNER, RoleMembership.ADMIN] }
                    : undefined,
            },
            skip: offset,
            take: currentLimit,
            orderBy: [{ createdAt: "desc" }, { id: "desc" }],
            select: {
                createdAt: true,
                role: true,
                user: {
                    select: {
                        username: true,
                    },
                },
            },
        });
    }

    countMembersByCircleId(circleId: number, type: CircleMemberListType) {
        return prisma.circleMember.count({
            where: {
                circleId,
                role: type === "manage"
                    ? { in: [RoleMembership.OWNER, RoleMembership.ADMIN] }
                    : undefined,
            },
        });
    }

    kickMemberByCircleIdAndUserId(
        circleId: number,
        userId: string,
        tx: Prisma.TransactionClient = prisma,
    ) {
        return tx.circleMember.deleteMany({
            where: {
                circleId,
                userId,
            },
        });
    }

    countMembersByCircleIdWithinRange(circleId: number, from: Date) {
        return prisma.circleMember.count({
            where: {
                circleId,
                createdAt: {
                    gte: from,
                },
            },
        });
    }
}

export const circleMemberRepository = new CircleMemberRepository();
