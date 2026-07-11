import { GroupType } from "@prisma/client";

export type CreateMessageGroupInput = {
  type: GroupType;
  members: string[];
};
