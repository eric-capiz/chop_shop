import { useState } from "react";
import { format } from "date-fns";
import { FaTimes, FaClock } from "react-icons/fa";
import Select from "react-select";
import { ScheduleDay } from "@/types/admin/availability.types";

interface EditDayModalProps {
  date: Date;
  availability: ScheduleDay | null;
  onClose: () => void;
  onSave: (hours: {
    startTime: string | null;
    endTime: string | null;
  }) => Promise<void>;
}

// Only on-the-hour options (no :15, :30, :45)
const generateTimeOptions = () => {
  const times = [];
  for (let hour = 0; hour < 24; hour++) {
    const period = hour < 12 ? "AM" : "PM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const hourStr = hour.toString().padStart(2, "0");
    const displayTime = `${displayHour}:00 ${period}`;
    const value = `${hourStr}:00`;
    times.push({ label: displayTime, value });
  }
  return times;
};

const EditDayModal = ({
  date,
  availability,
  onClose,
  onSave,
}: EditDayModalProps) => {
  const [isWorking, setIsWorking] = useState(
    availability?.isWorkingDay ?? false
  );
  // Parse work hours as Date to get local time (handles UTC-stored ISO strings)
  const [startTime, setStartTime] = useState(() => {
    if (!availability?.workHours?.start) return "09:00";
    const d = new Date(availability.workHours.start);
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  });
  const [endTime, setEndTime] = useState(() => {
    if (!availability?.workHours?.end) return "18:00";
    const d = new Date(availability.workHours.end);
    return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
  });
  const [isSaving, setIsSaving] = useState(false);
  const [timeError, setTimeError] = useState<string | null>(null);

  const timeOptions = generateTimeOptions();

  const customStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: "#1a1a1a",
      borderColor: "#B8860B",
      "&:hover": {
        borderColor: "#DAA520",
      },
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: "#1a1a1a",
      marginTop: 0,
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused ? "#2a2a2a" : "#1a1a1a",
      color: state.isFocused ? "#DAA520" : "#C0C0C0",
      "&:hover": {
        backgroundColor: "#2a2a2a",
      },
    }),
    singleValue: (base: any) => ({
      ...base,
      color: "#C0C0C0",
    }),
    dropdownIndicator: (base: any) => ({
      ...base,
      color: "#B8860B",
    }),
    menuList: (base: any) => ({
      ...base,
      maxHeight: "200px",
    }),
  };

  const validateTimes = (start: string, end: string): boolean => {
    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);

    const startMinutes = startHour * 60 + startMinute;
    const endMinutes = endHour * 60 + endMinute;

    if (endMinutes <= startMinutes) {
      setTimeError("End time must be after start time");
      return false;
    }

    setTimeError(null);
    return true;
  };

  const handleStartTimeChange = (option: any) => {
    if (option) {
      setStartTime(option.value);
      validateTimes(option.value, endTime);
    }
  };

  const handleEndTimeChange = (option: any) => {
    if (option) {
      setEndTime(option.value);
      validateTimes(startTime, option.value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isWorking && !validateTimes(startTime, endTime)) {
      return;
    }

    setIsSaving(true);

    try {
      if (!isWorking) {
        await onSave({ startTime: null, endTime: null });
      } else {
        // Build Date in barber's local time, then send as ISO (UTC).
        // This ensures work hours stay correct regardless of server timezone.
        const [startH, startM] = startTime.split(":").map(Number);
        const [endH, endM] = endTime.split(":").map(Number);
        const startDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          startH,
          startM,
          0
        );
        const endDate = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          endH,
          endM,
          0
        );

        await onSave({
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        });
      }
    } catch (error) {
      console.error("Failed to save availability:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content availability-modal">
        <div className="modal-header">
          <h3>
            <FaClock /> Set Availability for {format(date, "MMMM d, yyyy")}
          </h3>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="availability-form">
          <div className="working-toggle">
            <label>
              <input
                type="checkbox"
                checked={isWorking}
                onChange={(e) => setIsWorking(e.target.checked)}
              />
              Available for appointments
            </label>
          </div>

          {isWorking && (
            <div className="time-inputs">
              <div className="form-group">
                <label htmlFor="startTime">Start Time</label>
                <Select
                  id="startTime"
                  options={timeOptions}
                  value={timeOptions.find(
                    (option) => option.value === startTime
                  )}
                  onChange={handleStartTimeChange}
                  styles={customStyles}
                  menuPlacement="bottom"
                />
              </div>

              <div className="form-group">
                <label htmlFor="endTime">End Time</label>
                <Select
                  id="endTime"
                  options={timeOptions}
                  value={timeOptions.find((option) => option.value === endTime)}
                  onChange={handleEndTimeChange}
                  styles={customStyles}
                  menuPlacement="bottom"
                />
              </div>

              {timeError && (
                <div
                  className="error-message"
                  style={{ color: "#ff4444", marginTop: "0.5rem" }}
                >
                  {timeError}
                </div>
              )}
            </div>
          )}

          <div className="modal-actions">
            <button type="submit" className="btn-save" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Availability"}
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDayModal;
