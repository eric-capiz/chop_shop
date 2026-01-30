import axios from "axios";
import type {
  PublicBarber,
  PublicService,
  PublicGalleryItem,
  PublicReview,
} from "@/types/barber.types";

export const barbersService = {
  getAll: async (): Promise<PublicBarber[]> => {
    const { data } = await axios.get<PublicBarber[]>("/api/barbers");
    return data;
  },

  getById: async (id: string): Promise<PublicBarber> => {
    const { data } = await axios.get<PublicBarber>(`/api/barbers/${id}`);
    return data;
  },

  getServices: async (barberId: string): Promise<PublicService[]> => {
    const { data } = await axios.get<PublicService[]>(
      `/api/barbers/${barberId}/services`
    );
    return data;
  },

  getGallery: async (barberId: string): Promise<PublicGalleryItem[]> => {
    const { data } = await axios.get<PublicGalleryItem[]>(
      `/api/barbers/${barberId}/gallery`
    );
    return data;
  },

  getReviews: async (barberId: string): Promise<PublicReview[]> => {
    const { data } = await axios.get<PublicReview[]>(
      `/api/barbers/${barberId}/reviews`
    );
    return data;
  },
};
