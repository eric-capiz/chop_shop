import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "@/services/admin/profile.service";
import { useProfileStore } from "@/store/admin/profileStore";
import { useAuthStore } from "@/store/authStore";
import { BarberProfile } from "@/types/auth.types";
import { getBarberById } from "@/data/dummyData";

// Convert dummy barber to profile format
const dummyBarberToProfile = (barberId: string): BarberProfile | null => {
  const barber = getBarberById(barberId);
  if (!barber) return null;

  return {
    _id: barber.id,
    name: barber.name,
    username: barber.username,
    email: `${barber.username}@chopshop.com`,
    role: "admin",
    bio: barber.bio,
    specialties: barber.specialties,
    yearsOfExperience: barber.yearsOfExperience,
    profileImage: {
      url: barber.profileImage,
      publicId: `dummy-${barber.id}`,
    },
    socialMedia: barber.socialMedia,
  } as BarberProfile;
};

export const useProfile = () => {
  const setProfile = useProfileStore((state) => state.setProfile);
  const currentBarberId = useAuthStore((state) => state.currentBarberId);

  return useQuery({
    queryKey: ["barberProfile", currentBarberId],
    queryFn: async () => {
      // Check if using mock barber
      const token = localStorage.getItem("token");
      if (token?.startsWith("mock-token-") && currentBarberId) {
        const dummyProfile = dummyBarberToProfile(currentBarberId);
        if (dummyProfile) return dummyProfile;
      }

      // Fall back to real API
      return profileService.getProfile();
    },
    onSuccess: (data) => {
      setProfile(data);
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const currentBarberId = useAuthStore((state) => state.currentBarberId);

  return useMutation({
    mutationFn: async (data: Partial<BarberProfile>) => {
      // Mock update for dummy barbers
      const token = localStorage.getItem("token");
      if (token?.startsWith("mock-token-") && currentBarberId) {
        const currentProfile = dummyBarberToProfile(currentBarberId);
        return { ...currentProfile, ...data } as BarberProfile;
      }

      return profileService.updateProfile(data);
    },
    onSuccess: (data) => {
      updateProfile(data);
      queryClient.invalidateQueries({ queryKey: ["barberProfile"] });
    },
  });
};

export const useUpdateProfileImage = () => {
  const queryClient = useQueryClient();
  const updateProfile = useProfileStore((state) => state.updateProfile);
  const currentBarberId = useAuthStore((state) => state.currentBarberId);

  return useMutation({
    mutationFn: async (file: File) => {
      // Mock update for dummy barbers - just return current profile
      const token = localStorage.getItem("token");
      if (token?.startsWith("mock-token-") && currentBarberId) {
        const currentProfile = dummyBarberToProfile(currentBarberId);
        // In a real scenario, we'd upload the file. For demo, just return existing profile.
        console.log("Image upload simulated for:", file.name);
        return currentProfile as BarberProfile;
      }

      return profileService.updateProfileImage(file);
    },
    onSuccess: (data) => {
      updateProfile(data);
      queryClient.invalidateQueries({ queryKey: ["barberProfile"] });
    },
  });
};
