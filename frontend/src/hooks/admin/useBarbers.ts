import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  barbersService,
  CreateBarberPayload,
} from "@/services/admin/barbers.service";

export const useBarbers = () => {
  return useQuery({
    queryKey: ["admin", "barbers"],
    queryFn: () => barbersService.getAll(),
  });
};

export const useCreateBarber = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBarberPayload) => barbersService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "barbers"] });
    },
  });
};

export const useTransferSuperAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (barberId: string) =>
      barbersService.transferSuperAdmin(barberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "barbers"] });
    },
  });
};

export const useDeleteBarber = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (barberId: string) => barbersService.delete(barberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "barbers"] });
    },
  });
};
