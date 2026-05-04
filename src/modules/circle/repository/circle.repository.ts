import { $Enums, Circle, Prisma } from "@prisma/client";

class CircleRepository implements IPagination<Prisma.CircleWhereInput, Circle> {
    findAll({ page, limit, where, orderBy }: { page: number; limit: number; where?: Prisma.CircleWhereInput | undefined; orderBy?: any; }): Promise<{ name: string; id: number; userId: string; createdAt: Date; updatedAt: Date; visibility: $Enums.Visibility; createById: string; }[]> {
        throw new Error("Method not implemented.");
    }
    count(params: { where?: Prisma.CircleWhereInput | undefined; }): Promise<number> {
        throw new Error("Method not implemented.");
    }

}

export const circleRepository = new CircleRepository();