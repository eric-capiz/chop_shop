import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { galleryService } from "@/services/admin/gallery.service";
import { useGalleryStore } from "@/store/admin/galleryStore";
import { GalleryItem } from "@/types/admin/gallery.types";

export const useGallery = () => {
  const setGallery = useGalleryStore((state) => state.setGallery);

  return useQuery({
    queryKey: ["gallery"],
    queryFn: () => galleryService.getGallery(),
    onSuccess: (data) => setGallery(data),
  });
};

export const useAddGalleryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => galleryService.addGalleryItem(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
  });
};

export const useUpdateGalleryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => galleryService.updateGalleryItem(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
  });
};

export const useDeleteGalleryItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => galleryService.deleteGalleryItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gallery"] });
    },
  });
};
