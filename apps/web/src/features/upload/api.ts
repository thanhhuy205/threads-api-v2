import type {
  UploadMediaResponse,
  UploadVideoUrlResponse,
} from "@/services/upload-service";
import { uploadApi } from "@/services/upload-service";
import { useMutation } from "@tanstack/react-query";

export type UploadResponse = UploadMediaResponse;
export type UploadVideoResponse = UploadVideoUrlResponse;

export const uploadMedia = async (files: File[]): Promise<UploadResponse> => {
  if (files.length > 5) {
    throw new Error("Chỉ được phép upload tối đa 5 ảnh.");
  }
  if (
    files.some(
      (file) =>
        !file.type.startsWith("image/") && !file.type.startsWith("video/"),
    )
  ) {
    throw new Error("Chỉ hỗ trợ upload file image/*. hoặc video");
  }

  const formData = new FormData();
  files.forEach((file) => {
    formData.append("medias", file);
  });

  const response = await uploadApi.uploadMedia(formData);
  return response;
};

export const useUploadMediaMutation = () =>
  useMutation({
    mutationFn: uploadMedia,
  });

export const getUploadVideoUrl = async (): Promise<UploadVideoResponse> =>
  uploadApi.getUploadVideoUrl();

export const useUploadVideoUrlMutation = () =>
  useMutation({
    mutationFn: getUploadVideoUrl,
  });
