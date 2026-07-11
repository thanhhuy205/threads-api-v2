export const dailyQuestActionValues = [
  "POST_CREATED",
  "POST_DELETED",
  "LIKE_CREATED",
  "FLOW_FOLLOWER_CREATED",
  "FOLLOW_FOLLOWING_CREATED",
  "QUOTE_CREATED",
  "QUOTE_DELETED",
  "SHARE_CREATED",
  "SHARE_DELETED",
  "INVITE_SENT",
  "INVITE_ACCEPTED",
  "JOIN_CIRCLE",
  "LEAVE_CIRCLE",
] as const;

export type DailyQuestActionValue = (typeof dailyQuestActionValues)[number];

export type DailyQuestActionOption = {
  value: DailyQuestActionValue;
  label: string;
  unit: string;
};

export const dailyQuestActionOptions: DailyQuestActionOption[] = [
  {
    value: "POST_CREATED",
    label: "Đăng bài",
    unit: "bài",
  },
  {
    value: "POST_DELETED",
    label: "Xoá bài",
    unit: "bài",
  },
  {
    value: "LIKE_CREATED",
    label: "Thích bài",
    unit: "lượt",
  },
  {
    value: "FLOW_FOLLOWER_CREATED",
    label: "Có người theo dõi",
    unit: "người",
  },
  {
    value: "FOLLOW_FOLLOWING_CREATED",
    label: "Theo dõi người dùng",
    unit: "người",
  },
  {
    value: "QUOTE_CREATED",
    label: "Quote bài",
    unit: "bài",
  },
  {
    value: "QUOTE_DELETED",
    label: "Xoá quote",
    unit: "bài",
  },
  {
    value: "SHARE_CREATED",
    label: "Chia sẻ bài",
    unit: "lượt",
  },
  {
    value: "SHARE_DELETED",
    label: "Xoá chia sẻ",
    unit: "lượt",
  },
  {
    value: "INVITE_SENT",
    label: "Gửi lời mời",
    unit: "lời mời",
  },
  {
    value: "INVITE_ACCEPTED",
    label: "Chấp nhận lời mời",
    unit: "lời mời",
  },
  {
    value: "JOIN_CIRCLE",
    label: "Được duyệt vào nhóm",
    unit: "nhóm",
  },
  {
    value: "LEAVE_CIRCLE",
    label: "Rời nhóm",
    unit: "nhóm",
  },
];
