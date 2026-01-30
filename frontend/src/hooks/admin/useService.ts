import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { servicesService } from "@/services/admin/services.service";
import { Service } from "@/types/admin/services.types";
import { useAuthStore } from "@/store/authStore";
import { services as dummyServices, getServicesForBarber } from "@/data/dummyData";

export const useServices = () => {
  const currentBarberId = useAuthStore((state) => state.currentBarberId);

  return useQuery({
    queryKey: ["services", currentBarberId],
    queryFn: async () => {
      // In demo mode, always use dummy data
      const token = localStorage.getItem("token");
      const useDummyData = !token || token.startsWith("mock-token-") || token.startsWith("mock-user-");
      
      if (useDummyData) {
        // Return dummy services
        return dummyServices.map((s) => ({
          _id: s._id,
          name: s.name,
          description: s.description,
          duration: s.duration,
          price: s.price,
          category: s.category,
          isActive: s.isActive,
        })) as Service[];
      }

      return servicesService.getServices();
    },
  });
};

export const useAddService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Service>) => {
      const token = localStorage.getItem("token");
      if (token?.startsWith("mock-token-")) {
        // Mock add - just return the data with a fake ID
        console.log("Service add simulated:", data);
        return { ...data, _id: `mock-service-${Date.now()}` } as Service;
      }
      return servicesService.addService(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      serviceData,
    }: {
      id: string;
      serviceData: Partial<Service>;
    }) => {
      const token = localStorage.getItem("token");
      if (token?.startsWith("mock-token-")) {
        console.log("Service update simulated:", id, serviceData);
        return { ...serviceData, _id: id } as Service;
      }
      return servicesService.updateService(id, serviceData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("token");
      if (token?.startsWith("mock-token-")) {
        console.log("Service delete simulated:", id);
        return;
      }
      return servicesService.deleteService(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
};
