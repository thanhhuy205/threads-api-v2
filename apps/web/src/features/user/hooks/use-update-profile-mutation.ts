import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "../api/update-profile";
import type { UpdateProfileDto } from "@/schema/user.schema";

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileDto) => updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      // You can invalidate specific user queries if needed
    },
  });
};
