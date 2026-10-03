import type { CreatePostDto, CreatePostResponse } from "@/types/post";
import { http } from "@/utils/http";

export const postThread = async (payload: CreatePostDto) =>
    http.post<CreatePostResponse>("/posts", payload);
