import { useQuery } from "@tanstack/react-query";
import { publicAvailabilityService } from "@/services/appointment/availability.service";

export const useBookingAvailability = (barberId?: string) => {
  return useQuery({
    queryKey: ["booking-availability", barberId],
    queryFn: async () => {
      if (!barberId) {
        return {
          adminId: "",
          currentMonth: { month: 0, year: 0, isSet: false },
          schedule: [],
          bookedSlots: [],
        };
      }
      const [availability, bookedSlots] = await Promise.all([
        publicAvailabilityService.getBarberAvailability(barberId),
        publicAvailabilityService.getBookedSlots(barberId),
      ]);
      return {
        ...availability,
        bookedSlots: bookedSlots.bookedSlots ?? [],
      };
    },
    enabled: !!barberId,
  });
};
