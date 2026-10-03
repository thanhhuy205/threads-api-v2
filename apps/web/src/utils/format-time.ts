import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

export const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "";
  }
  return formatDistanceToNow(date, { addSuffix: true, locale: vi });
};


export const formatTimeHourMinute = (date?: Date | null) => {
  if (!date) return null;

  const hour = String(date.getUTCHours()).padStart(2, '0');
  const minute = String(date.getUTCMinutes()).padStart(2, '0');

  return `${hour}:${minute}`;
};