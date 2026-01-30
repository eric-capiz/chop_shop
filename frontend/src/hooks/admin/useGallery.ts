import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { galleryService } from "@/services/admin/gallery.service";
import { useGalleryStore } from "@/store/admin/galleryStore";
import { useAuthStore } from "@/store/authStore";
import { galleryItems as dummyGallery } from "@/data/dummyData";
import { GalleryItem } from "@/types/admin/gallery.types";

export const useGallery = () => {
  const setGallery = useGalleryStore((state) => state.setGallery);
  const currentBarberId = useAuthStore((state) => state.currentBarberId);

  return useQuery({
    queryKey: ["gallery", currentBarberId],
    queryFn: async () => {
      // In demo mode, always use dummy data
      // (either logged in as mock barber or public viewing)
      const token = localStorage.getItem("token");
      const useDummyData =
        !token ||
        token.startsWith("mock-token-") ||
        token.startsWith("mock-user-");

      if (useDummyData) {
        // Return dummy gallery items
        return dummyGallery.map((g) => ({
          _id: g._id,
          adminId: currentBarberId || g.barberId,
          image: g.image,
          description: g.description,
          tags: g.tags,
          isActive: g.isActive,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })) as GalleryItem[];
      }

      return galleryService.getGallery();
    },
    onSuccess: (data) => setGallery(data),
  });
};

export const useAddGalleryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const token = localStorage.getItem("token");
      if (token?.startsWith("mock-token-")) {
        console.log("Gallery add simulated");
        return {
          _id: `mock-gallery-${Date.now()}`,
          image: { url: "https://via.placeholder.com/400", publicId: "mock" },
          description: formData.get("description") || "",
          tags: [],
          isActive: true,
        } as GalleryItem;
      }
      return galleryService.addGalleryItem(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
  });
};

export const useUpdateGalleryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => {
      const token = localStorage.getItem("token");
      if (token?.startsWith("mock-token-")) {
        console.log("Gallery update simulated:", id);
        return { _id: id } as GalleryItem;
      }
      return galleryService.updateGalleryItem(id, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
  });
};

export const useDeleteGalleryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("token");
      if (token?.startsWith("mock-token-")) {
        console.log("Gallery delete simulated:", id);
        return;
      }
      return galleryService.deleteGalleryItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
  });
};
