export type UpdatePostCommand = {
  content?: string;
  isPinned?: boolean;
  dateRangeFrom?: Date | null;
  dateRangeTo?: Date | null;
  scheduledTimeFrom?: string | null;
  scheduledTimeTo?: string | null;
};
