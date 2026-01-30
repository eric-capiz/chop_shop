import { useQuery } from "@tanstack/react-query";
import { publicAvailabilityService } from "@/services/appointment/availability.service";
import { getAvailabilityForBarber } from "@/data/dummyData";

export const useBookingAvailability = (barberId?: string) => {
  return useQuery({
    queryKey: ["booking-availability", barberId],
    queryFn: async () => {
      // If we have a barber ID and are in demo mode, use dummy data
      if (barberId) {
        const dummyAvail = getAvailabilityForBarber(barberId);
        if (dummyAvail) {
          return {
            adminId: barberId,
            currentMonth: {
              month: new Date().getMonth() + 1,
              year: new Date().getFullYear(),
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
            bookedSlots: dummyAvail.schedule.flatMap((day) =>
              day.timeSlots
                .filter((slot) => slot.isBooked)
                .map((slot) => ({
                  date: new Date(`${day.date}T${slot.start}:00`).toISOString(),
                  start: slot.start,
                  end: slot.end,
                })),
            ),
          };
        }
      }

      // Real API: require barberId for availability and booked slots
      if (!barberId) {
        return {
          adminId: "",
          currentMonth: { month: 0, year: 0, isSet: false },
          schedule: [],
          bookedSlots: [],
        };
      }
      try {
        const [availability, bookedSlots] = await Promise.all([
          publicAvailabilityService.getBarberAvailability(barberId),
          publicAvailabilityService.getBookedSlots(barberId),
        ]);

        return {
          ...availability,
          bookedSlots: bookedSlots.bookedSlots ?? [],
        };
      } catch (error) {
        console.error("Error fetching availability:", error);
        throw error;
      }
    },
    enabled: !!barberId, // Only fetch when we have a barber (booking flow or dummy)
  });
};
