import type { UpdateProfileDto } from "@/schema/user.schema";
import { http } from "@/utils/http";

export const updateProfile = (data: UpdateProfileDto) =>
  http.patch<{
    name: string;
    bio: string;
    links: { title: string; url: string };
    isPrivate: boolean;
  }>(`/me/profile`, data);
