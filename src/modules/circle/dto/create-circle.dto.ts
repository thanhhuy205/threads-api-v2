import { Visibility } from "@prisma/client";

export interface CreateCircleDto {
    name: string;
    visibility?: Visibility;
}