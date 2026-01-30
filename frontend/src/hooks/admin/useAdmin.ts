import { useQuery } from "@tanstack/react-query";
import { profileService } from "@/services/admin/profile.service";

export const useAdmin = () => {
  return useQuery({
    queryKey: ["admin"],
    queryFn: () => profileService.getProfile(),
    enabled: !!localStorage.getItem("token"),
  });
};
