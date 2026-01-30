import { create } from "zustand";
import { Service } from "@/types/admin/services.types";

interface ServicesStore {
  services: Service[];
  setServices: (services: Service[]) => void;
}

export const useServicesStore = create<ServicesStore>((set) => ({
  services: [],
  setServices: (services) => set({ services }),
}));
