import axios from "axios";
import type {
  PublicTechnician,
  PublicService,
  PublicGalleryItem,
  PublicReview,
} from "@/types/technician.types";

export const techniciansService = {
  getAll: async (): Promise<PublicTechnician[]> => {
    const { data } = await axios.get<PublicTechnician[]>("/api/technicians");
    return data;
  },

  getById: async (id: string): Promise<PublicTechnician> => {
    const { data } = await axios.get<PublicTechnician>(`/api/technicians/${id}`);
    return data;
  },

  getServices: async (technicianId: string): Promise<PublicService[]> => {
    const { data } = await axios.get<PublicService[]>(
      `/api/technicians/${technicianId}/services`
    );
    return data;
  },

  getGallery: async (technicianId: string): Promise<PublicGalleryItem[]> => {
    const { data } = await axios.get<PublicGalleryItem[]>(
      `/api/technicians/${technicianId}/gallery`
    );
    return data;
  },

  getReviews: async (technicianId: string): Promise<PublicReview[]> => {
    const { data } = await axios.get<PublicReview[]>(
      `/api/technicians/${technicianId}/reviews`
    );
    return data;
  },
};
