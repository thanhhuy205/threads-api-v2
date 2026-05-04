import prisma from "@/config/prisma";
import { CreateCircleInput } from "@/modules/circle/interfaces/circle-service.interface";
import { $Enums, Circle, Prisma, RoleMembership } from "@prisma/client";

class CircleRepository implements IPagination<Prisma.CircleWhereInput, Circle> {
    findAll({ page, limit, where, orderBy }: { page: number; limit: number; where?: Prisma.CircleWhereInput | undefined; orderBy?: any; }): Promise<{ name: string; id: number; userId: string; createdAt: Date; updatedAt: Date; visibility: $Enums.Visibility; createById: string; }[]> {
        throw new Error("Method not implemented.");
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


}

export const circleRepository = new CircleRepository();