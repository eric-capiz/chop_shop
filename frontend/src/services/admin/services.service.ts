import axios from "axios";
import { Service } from "@/types/admin/services.types";

export const servicesService = {
  getServices: async (): Promise<Service[]> => {
    const { data } = await axios.get<Service[]>("/api/admin/services");
    return data;
  },

  addService: async (
    serviceData: Omit<Service, "_id" | "isActive">
  ): Promise<Service> => {
    const { data } = await axios.post<Service>(
      "/api/admin/services",
      serviceData
    );
    return data;
  },

  updateService: async (
    id: string,
    serviceData: Partial<Service>
  ): Promise<Service> => {
    const { data } = await axios.put<Service>(
      `/api/admin/services/${id}`,
      serviceData
    );
    return data;
  },

  deleteService: async (id: string): Promise<void> => {
    await axios.delete(`/api/admin/services/${id}`);
  },
};
