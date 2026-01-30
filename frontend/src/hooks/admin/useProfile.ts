import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/services/admin/profile.service";
import { useProfileStore } from "@/store/admin/profileStore";
import { BarberProfile } from "@/types/auth.types";

export const useProfile = () => {
  const setProfile = useProfileStore((state) => state.setProfile);

  return useQuery({
    queryKey: ["barberProfile"],
    queryFn: () => profileService.getProfile(),
    onSuccess: (data) => {
      setProfile(data);
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const updateProfile = useProfileStore((state) => state.updateProfile);

  return useMutation({
    mutationFn: (data: Partial<BarberProfile>) => profileService.updateProfile(data),
    onSuccess: (data) => {
      updateProfile(data);
      queryClient.invalidateQueries({ queryKey: ["barberProfile"] });
    },
  });
};

export const useUpdateProfileImage = () => {
  const queryClient = useQueryClient();
  const updateProfile = useProfileStore((state) => state.updateProfile);

  return useMutation({
    mutationFn: (file: File) => profileService.updateProfileImage(file),
    onSuccess: (data) => {
      updateProfile(data);
      queryClient.invalidateQueries({ queryKey: ["barberProfile"] });
    },
  });
};
