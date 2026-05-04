import { CircleMember, Prisma } from "@prisma/client";

class CircleMemberRepository implements IPagination<Prisma.CircleMemberWhereInput, CircleMember> {
    count(params: { where?: any; }): Promise<number> {
        throw new Error("Method not implemented.");
    }
    async findAll({ page, limit, where, orderBy }: { page: number; limit: number; where?: Prisma.CircleMemberWhereInput | undefined; orderBy?: any; }) {
        return [];
    }
}

export const circleMemberRepository = new CircleMemberRepository();