import prisma from "@/config/prisma";
import { buildPagination } from "@/shared/pagination/cursor-pagination";
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

}

export const circleJoinRequestRepository = new CircleJoinRequestRepository();
