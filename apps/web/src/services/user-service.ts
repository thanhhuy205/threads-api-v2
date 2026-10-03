import { http } from "@/utils/http";

export const userApi = {
  updateUser: (payload: FormData) => http.post("/auth/profile", payload),
};
