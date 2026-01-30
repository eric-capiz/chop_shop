import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { availabilityService } from "@/services/admin/availability.service";
import { useAuthStore } from "@/store/authStore";
import { getAvailabilityForBarber } from "@/data/dummyData";
import {
  MonthSetupData,
  DayUpdateData,
} from "@/types/admin/availability.types";

export const useAvailability = () => {
  const currentBarberId = useAuthStore((state) => state.currentBarberId);

  return useQuery({
    queryKey: ["availability", currentBarberId],
    queryFn: async () => {
      // Check if using mock barber
      const token = localStorage.getItem("token");
      if (token?.startsWith("mock-token-") && currentBarberId) {
        const dummyAvail = getAvailabilityForBarber(currentBarberId);
        if (dummyAvail) {
          const today = new Date();
          return {
            _id: `avail-${currentBarberId}`,
            adminId: currentBarberId,
            currentMonth: {
              month: today.getMonth() + 1,
              year: today.getFullYear(),
              isSet: true,
            },
            schedule: dummyAvail.schedule.map((day) => ({
              date: `${day.date}T00:00:00.000Z`,
              isWorkingDay: day.isWorkingDay,
              workHours: day.isWorkingDay
                ? {
                    start: `${day.date}T09:00:00.000Z`,
                    end: `${day.date}T18:00:00.000Z`,
                  }
                : null,
              timeSlots: day.timeSlots.map((slot) => ({
                startTime: `${day.date}T${slot.start}:00.000Z`,
                endTime: `${day.date}T${slot.end}:00.000Z`,
                isBooked: slot.isBooked,
                appointmentId: null,
              })),
            })),
          };
        }
      }

      return availabilityService.getAvailability();
    },
  });
};

export const useSetupMonth = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (monthData: MonthSetupData) => {
      const token = localStorage.getItem("token");
      if (token?.startsWith("mock-token-")) {
        console.log("Month setup simulated:", monthData);
        return { success: true };
      }
      return availabilityService.setupMonth(monthData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
  });
};

export const useUpdateDay = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      date,
      dayData,
    }: {
      date: string;
      dayData: DayUpdateData;
    }) => {
      const token = localStorage.getItem("token");
      if (token?.startsWith("mock-token-")) {
        console.log("Day update simulated:", date, dayData);
        return { success: true };
      }
      return availabilityService.updateDay(date, dayData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
  });
};
