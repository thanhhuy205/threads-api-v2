export type CircleJoinStatus = "JOINED" | "PENDING" | "NONE" | "INVITED";

type CircleListItem = {
  id: number;
  [key: string]: unknown;
};

type JoinStatusMapInput = {
  joinedCircleIdSet: Set<number>;
  pendingCircleIdSet: Set<number>;
  invitedCircleIdSet: Set<number>;
};

export const mapCircleWithJoinStatus = <T extends CircleListItem>(
  circle: T,
  { joinedCircleIdSet, pendingCircleIdSet, invitedCircleIdSet }: JoinStatusMapInput,
): T & { joinStatus: CircleJoinStatus } => {
  const joinStatus: CircleJoinStatus = joinedCircleIdSet.has(circle.id)
    ? "JOINED"
    : pendingCircleIdSet.has(circle.id)
      ? "PENDING"
      : invitedCircleIdSet.has(circle.id)
        ? "INVITED"
        : "NONE";

  return {
    ...circle,
    joinStatus,
  };
};
