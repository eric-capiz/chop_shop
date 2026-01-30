import { useQuery } from "@tanstack/react-query";
import { barbersService } from "@/services/barbers.service";

export const useBarbersList = () => {
  return useQuery({
    queryKey: ["barbers"],
    queryFn: () => barbersService.getAll(),
  });
};

export const useBarberById = (id: string | undefined, enabled = true) => {
  return useQuery({
    queryKey: ["barber", id],
    queryFn: () => barbersService.getById(id!),
    enabled: !!id && enabled,
  });
};

export const useBarberServices = (
  barberId: string | undefined,
  enabled = true,
) => {
  return useQuery({
    queryKey: ["barberServices", barberId],
    queryFn: () => barbersService.getServices(barberId!),
    enabled: !!barberId && enabled,
  });
};

export const useBarberGallery = (
  barberId: string | undefined,
  enabled = true,
) => {
  return useQuery({
    queryKey: ["barberGallery", barberId],
    queryFn: () => barbersService.getGallery(barberId!),
    enabled: !!barberId && enabled,
  });
};

export const useBarberReviews = (
  barberId: string | undefined,
  enabled = true,
) => {
  return useQuery({
    queryKey: ["barberReviews", barberId],
    queryFn: () => barbersService.getReviews(barberId!),
    enabled: !!barberId && enabled,
  });
};
