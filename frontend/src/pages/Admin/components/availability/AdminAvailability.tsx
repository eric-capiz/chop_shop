import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DateClickArg } from "@fullcalendar/interaction";
import { useAvailability, useUpdateDay } from "@/hooks/admin/useAvailability";
import { format } from "date-fns";
import EditDayModal from "./EditDayModal";
import "./_adminAvailability.scss";

const AdminAvailability = () => {
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const { data: availability, isLoading } = useAvailability();
  const updateDay = useUpdateDay();

  const events =
    availability?.schedule
      ?.filter((day) => day.isWorkingDay)
      .map((day) => {
        const startDate = new Date(day.workHours.start);
        const endDate = new Date(day.workHours.end);

        return {
          title: `${format(startDate, "h:mm a")} - ${format(
            endDate,
            "h:mm a"
          )}`,
          date: day.date.split("T")[0],
          classNames: ["working-day"],
        };
      }) || [];

  const handleDateClick = (arg: DateClickArg) => {
    const clickedDate = new Date(arg.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    clickedDate.setHours(0, 0, 0, 0);

    if (clickedDate >= today) {
      setSelectedDay(clickedDate);
    }
  };

  const getDayAvailability = (date: Date) => {
    if (!availability?.schedule) return null;
    const formattedDate = format(date, "yyyy-MM-dd");

    return availability.schedule.find(
      (day) => day.date.split("T")[0] === formattedDate
    );
  };

  return (
    <div className="admin-availability">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
        headerToolbar={{
          left: "prev",
          center: "title",
          right: "next",
        }}
        height="auto"
        selectable={false}
        editable={false}
        eventClick={(arg) => {
          const clickedDate = new Date(arg.event.start!);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          clickedDate.setHours(0, 0, 0, 0);

          if (clickedDate >= today) {
            setSelectedDay(clickedDate);
          }
        }}
      />

      {selectedDay && (
        <EditDayModal
          date={selectedDay}
          availability={getDayAvailability(selectedDay)}
          onClose={() => setSelectedDay(null)}
          onSave={async (hours) => {
            try {
              const dateToSave = format(selectedDay, "yyyy-MM-dd");

              await updateDay.mutateAsync({
                date: dateToSave,
                dayData: hours,
              });
              setSelectedDay(null);
            } catch (error) {
              console.error("Failed to update availability:", error);
            }
          }}
        />
      )}
    </div>
  );
};

export default AdminAvailability;
