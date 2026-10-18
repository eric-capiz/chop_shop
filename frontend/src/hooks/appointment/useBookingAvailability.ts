import { useQuery } from "@tanstack/react-query";
import { publicAvailabilityService } from "@/services/appointment/availability.service";

export const useBookingAvailability = (technicianId?: string) => {
  return useQuery({
    queryKey: ["booking-availability", technicianId],
    queryFn: async () => {
      if (!technicianId) {
        return {
          adminId: "",
          currentMonth: { month: 0, year: 0, isSet: false },
          schedule: [],
          bookedSlots: [],
        };
      }
      const [availability, bookedSlots] = await Promise.all([
        publicAvailabilityService.getBarberAvailability(technicianId),
        publicAvailabilityService.getBookedSlots(technicianId),
      ]);
      return {
        ...availability,
        bookedSlots: bookedSlots.bookedSlots ?? [],
      };
    },
    enabled: !!technicianId,
  });
};
