import { useQuery } from "@tanstack/react-query";
import { techniciansService } from "@/services/technicians.service";

export const useTechniciansList = () => {
  return useQuery({
    queryKey: ["technicians"],
    queryFn: () => techniciansService.getAll(),
  });
};

export const useTechnicianById = (id: string | undefined, enabled = true) => {
  return useQuery({
    queryKey: ["technician", id],
    queryFn: () => techniciansService.getById(id!),
    enabled: !!id && enabled,
  });
};

export const useTechnicianServices = (
  technicianId: string | undefined,
  enabled = true,
) => {
  return useQuery({
    queryKey: ["technicianServices", technicianId],
    queryFn: () => techniciansService.getServices(technicianId!),
    enabled: !!technicianId && enabled,
  });
};

export const useTechnicianGallery = (
  technicianId: string | undefined,
  enabled = true,
) => {
  return useQuery({
    queryKey: ["technicianGallery", technicianId],
    queryFn: () => techniciansService.getGallery(technicianId!),
    enabled: !!technicianId && enabled,
  });
};

export const useTechnicianReviews = (
  technicianId: string | undefined,
  enabled = true,
) => {
  return useQuery({
    queryKey: ["technicianReviews", technicianId],
    queryFn: () => techniciansService.getReviews(technicianId!),
    enabled: !!technicianId && enabled,
  });
};
