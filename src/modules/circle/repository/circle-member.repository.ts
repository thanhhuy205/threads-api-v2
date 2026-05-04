import prisma from "@/config/prisma";
import { CircleMember, Prisma } from "@prisma/client";

class CircleMemberRepository implements IPagination<Prisma.CircleMemberWhereInput, CircleMember> {
    count(params: { where?: any; }): Promise<number> {
        throw new Error("Method not implemented.");
    }
    async findAll({ page, limit, where, orderBy }: { page: number; limit: number; where?: Prisma.CircleMemberWhereInput | undefined; orderBy?: any; }) {
        return [];
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
}

export const circleMemberRepository = new CircleMemberRepository();