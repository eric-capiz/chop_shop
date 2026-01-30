import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useBookingAvailability } from "@/hooks/appointment/useBookingAvailability";
import type { DateSelectArg } from "@fullcalendar/core";
import { format, isAfter, startOfDay } from "date-fns";
import "./_dateTimeSelection.scss";

interface DateTimeSelectionProps {
  onSelect: (date: Date, timeSlot: { start: Date; end: Date }) => void;
  isReschedule?: boolean;
  barberId?: string;
}

interface BookedSlot {
  date: string;
}

const DateTimeSelection = ({
  onSelect,
  isReschedule = false,
  barberId,
}: DateTimeSelectionProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const { data: availability, isLoading } = useBookingAvailability(barberId);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setSelectedDate(selectInfo.start);
  };

  const isTimeSlotBooked = (
    selectedSlot: { start: Date },
    bookedSlots: BookedSlot[]
  ) => {
    const selectedTimeUTC = selectedSlot.start.toISOString();
    return bookedSlots.some(
      (bookedSlot) => bookedSlot.date === selectedTimeUTC
    );
  };

  const getAvailableTimeSlots = (date: Date) => {
    if (!availability) {
      return [];
    }

    const now = new Date();
    const selectedDateStart = startOfDay(date);
    const isToday =
      selectedDateStart.getDate() === now.getDate() &&
      selectedDateStart.getMonth() === now.getMonth() &&
      selectedDateStart.getFullYear() === now.getFullYear();

    const scheduleDay = availability.schedule.find((day) => {
      const dayDate = day.date.split("T")[0];
      const selectedDate = format(date, "yyyy-MM-dd");
      return dayDate === selectedDate;
    });

    if (!scheduleDay?.isWorkingDay || !scheduleDay.workHours) {
      return [];
    }

    const workStartParts = scheduleDay.workHours.start.split("T")[1].split(":");
    const workEndParts = scheduleDay.workHours.end.split("T")[1].split(":");

    const workStart = new Date(date);
    const workEnd = new Date(date);

    workStart.setHours(
      parseInt(workStartParts[0]),
      parseInt(workStartParts[1]),
      0
    );
    workEnd.setHours(parseInt(workEndParts[0]), parseInt(workEndParts[1]), 0);

    const slots = [];
    let currentTime = new Date(workStart);

    while (currentTime <= workEnd) {
      const slotEnd = new Date(currentTime.getTime() + 30 * 60000);
      const slot = {
        start: new Date(currentTime),
        end: slotEnd,
      };

      const isSlotBooked = isTimeSlotBooked(slot, availability.bookedSlots);

      if ((!isToday || isAfter(slot.start, now)) && !isSlotBooked) {
        slots.push(slot);
      }

      currentTime = new Date(currentTime.getTime() + 30 * 60000);
    }

    return slots;
  };

  if (isLoading) return <div>Loading availability...</div>;

  return (
    <div className="date-time-selection">
      <div className="calendar-container">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          selectable={true}
          select={handleDateSelect}
          headerToolbar={{
            left: "prev",
            center: "title",
            right: "next",
          }}
          validRange={{
            start: new Date(),
            end: new Date(new Date().setMonth(new Date().getMonth() + 2)),
          }}
          selectConstraint={{
            start: "00:00",
            end: "24:00",
            dows:
              availability?.schedule
                .filter((day) => day.isWorkingDay)
                .map((day) => new Date(day.date).getDay()) || [],
          }}
          dateClick={({ date }) => setSelectedDate(date)}
          longPressDelay={0}
          eventLongPressDelay={0}
          selectLongPressDelay={0}
          height="auto"
          fixedWeekCount={false}
        />
      </div>

      {selectedDate && (
        <div className="time-slots">
          <h3>Available Times for {format(selectedDate, "MMMM d, yyyy")}</h3>
          <div className="slots-grid">
            {getAvailableTimeSlots(selectedDate).length > 0 ? (
              getAvailableTimeSlots(selectedDate).map((slot, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (isReschedule) {
                      setSelectedSlot(slot);
                      onSelect(selectedDate, slot);
                    } else {
                      onSelect(selectedDate, slot);
                    }
                  }}
                  className={`time-slot-button ${
                    isReschedule && selectedSlot === slot ? "selected" : ""
                  }`}
                >
                  {format(slot.start, "h:mm a")}
                </button>
              ))
            ) : (
              <div className="no-slots-message">
                Barber is completely booked or unavailable.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateTimeSelection;
