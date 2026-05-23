import prisma from "@/config/prisma";
import { buildPagination } from "@/shared/pagination/cursor-pagination";
import { buildPagination as buildOffsetPagination } from "@/shared/pagination/pagination";
import { Prisma, RequestStatus } from "@prisma/client";

class CircleJoinRequestRepository implements ICursorPagination<
    Prisma.CircleJoinRequestWhereInput,
    any
> {
    async findAll({
        after,
        take,
        where,
        cursor,
        select,
        orderBy,
    }: {
        after?: string;
        take?: number;
        where?: Prisma.CircleJoinRequestWhereInput;
        cursor?: Prisma.CircleJoinRequestWhereUniqueInput;
        select?: Prisma.CircleJoinRequestSelect;
        orderBy?:
        | Prisma.CircleJoinRequestOrderByWithRelationInput
        | Prisma.CircleJoinRequestOrderByWithRelationInput[];
    }): Promise<any[]> {
        const { currentAfter, currentLimit } = buildPagination({ after, take });
        return prisma.circleJoinRequest.findMany({
            where: where ?? {},
            take: currentLimit + 1,
            skip: currentAfter ? 1 : 0,
            cursor: currentAfter ? cursor : undefined,
            select: select ?? {
                id: true,
                circleId: true,
                userId: true,
                status: true,
                circle: true,
            },
            orderBy: orderBy || { id: "desc" },
        });
    }

    async create(
        data: {
            circleId: number;
            userId: string;
            reason?: string;
        },
        tx: Prisma.TransactionClient = prisma,
    ) {
        return tx.circleJoinRequest.create({
            data,
        });
    }

    async findJoinRequestByCircleIdAndUserId(circleId: number, userId: string) {
        return prisma.circleJoinRequest.findFirst({
            where: {
                circleId,
                userId,
                status: RequestStatus.PENDING,
            },
        });
    }

    async updateStatus(id: number, status: RequestStatus, tx: Prisma.TransactionClient = prisma) {
        return tx.circleJoinRequest.update({
            where: { id },
            data: { status },
        });
    }


    async findPendingRequestByCircleId(circleIds: number[], userId: string) {
        return prisma.circleJoinRequest.findMany({
            where: {
                circleId: {
                    in: circleIds,
                },
                userId,
                status: RequestStatus.PENDING,
            },
        });
    }


    async findPendingRequestByCircleIdAndUserId(
        circleId: number,
        userId: string,
        tx: Prisma.TransactionClient = prisma,
    ) {
        return tx.circleJoinRequest.findFirst({
            where: {
                circleId,
                userId,
                status: RequestStatus.PENDING,
            },
        });
    }


    findByCircleIdPaginated({
        circleId,
        page,
        limit,
    }: {
        circleId: number;
        page: number;
        limit: number;
    }) {
        const { offset, currentLimit } = buildOffsetPagination({ page, limit });

        return prisma.circleJoinRequest.findMany({
            where: {
                circleId,
            },
            skip: offset,
            take: currentLimit,
            orderBy: [{ createdAt: "desc" }, { id: "desc" }],
            select: {
                id: true,
                circleId: true,
                userId: true,
                status: true,
                reason: true,
                createdAt: true,
                user: {
                    select: {
                        name: true,
                        username: true,
                        avatar: true,
                        bio: true,
                    },
                },
            },
        });
    }

    countByCircleId(circleId: number) {
        return prisma.circleJoinRequest.count({
            where: {
                circleId,
            },
        });
    }

    countPendingByCircleIdWithinRange(circleId: number, from: Date) {
        return prisma.circleJoinRequest.count({
            where: {
                circleId,
                status: RequestStatus.PENDING,
                createdAt: {
                    gte: from,
                },
            },
        });
    }

}

export const circleJoinRequestRepository = new CircleJoinRequestRepository();
