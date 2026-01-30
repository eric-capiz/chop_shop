import axios from "axios";
import { BarberAvailability } from "@/types/admin/availability.types";

export const publicAvailabilityService = {
  getBarberAvailability: async (
    adminId?: string
  ): Promise<BarberAvailability> => {
    if (!adminId) {
      throw new Error("adminId (barber id) is required for availability");
    }
    const { data } = await axios.get<BarberAvailability>(
      `/api/availability?adminId=${adminId}`
    );
    return data;
  },

  getBookedSlots: async (adminId?: string) => {
    if (!adminId) {
      return { bookedSlots: [] };
    }
    const { data } = await axios.get(
      `/api/availability/booked-slots?adminId=${adminId}`
    );
    return data;
  },
};
