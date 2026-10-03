import { http } from "@/utils/http";

export interface UploadMediaResponse {
  success: boolean;
  message: string;
  data: {
    medias: {
      id: number;
      key: string;
      url: string;
      type?: "IMAGE" | "VIDEO" | string;
    }[];
  };
}

export interface UploadVideoUrlResponse {
  success: boolean;
  message: string;
  data: {
    url: string;
    timeout: number;
    status: "waiting" | string;
    id: string;
  };
}

export const uploadApi = {
  uploadAvatar: (avatar: FormData) =>
    http.post("/upload/avatar", avatar, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  uploadMedia: (media: FormData) =>
    http.post<UploadMediaResponse>("/upload/media", media, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  getUploadVideoUrl: () =>
    http.get<UploadVideoUrlResponse>("/upload/videos"),
};
