export type CircleJoinStatus = "JOINED" | "PENDING" | "NONE";

type CircleListItem = {
  id: number;
  [key: string]: unknown;
};

type JoinStatusMapInput = {
  joinedCircleIdSet: Set<number>;
  pendingCircleIdSet: Set<number>;
};

export const mapCircleWithJoinStatus = <T extends CircleListItem>(
  circle: T,
  { joinedCircleIdSet, pendingCircleIdSet }: JoinStatusMapInput,
): T & { joinStatus: CircleJoinStatus } => {
  const joinStatus: CircleJoinStatus = joinedCircleIdSet.has(circle.id)
    ? "JOINED"
    : pendingCircleIdSet.has(circle.id)
      ? "PENDING"
      : "NONE";

  return {
    ...circle,
    joinStatus,
  };
};
