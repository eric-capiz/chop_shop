import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { availabilityService } from "@/services/admin/availability.service";
import {
  MonthSetupData,
  DayUpdateData,
} from "@/types/admin/availability.types";

export const useAvailability = () => {
  return useQuery({
    queryKey: ["availability"],
    queryFn: () => availabilityService.getAvailability(),
  });
};

export const useSetupMonth = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (monthData: MonthSetupData) =>
      availabilityService.setupMonth(monthData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
  });
};

export const useUpdateDay = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      date,
      dayData,
    }: {
      date: string;
      dayData: DayUpdateData;
    }) => availabilityService.updateDay(date, dayData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
  });
};
