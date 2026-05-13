import { Visibility } from "@prisma/client";

export interface CreateCircleInput {
    name: string;
    description: string;
    visibility: Visibility;
    createById: string;
}