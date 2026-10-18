import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  techniciansService,
  CreateTechnicianPayload,
} from "@/services/admin/technicians.service";

export const useTechnicians = () => {
  return useQuery({
    queryKey: ["admin", "technicians"],
    queryFn: () => techniciansService.getAll(),
  });
};

export const useCreateTechnician = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTechnicianPayload) => techniciansService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "technicians"] });
    },
  });
};

export const useTransferSuperAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (technicianId: string) =>
      techniciansService.transferSuperAdmin(technicianId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "technicians"] });
    },
  });
};

export const useDeleteTechnician = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (technicianId: string) => techniciansService.delete(technicianId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "technicians"] });
    },
  });
};
