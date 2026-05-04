import { Visibility } from "@prisma/client";

export interface CreateCircleInput {
    name: string;
    visibility: Visibility;
    createById: string;
    userId: string;
}