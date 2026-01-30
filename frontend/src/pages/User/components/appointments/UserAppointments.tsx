import { useState } from "react";
import { format } from "date-fns";
import { FaCalendarAlt } from "react-icons/fa";
import { useAppointment } from "@/hooks/appointment/useAppointment";
import Modal from "@/components/Modal/Modal";
import DateTimeSelection from "@/components/appointment/dateStep/DateTimeSelection";
import ReviewModal from "@/components/Modal/ReviewModal";
import Toast from "@/components/common/Toast";
import "./_userAppointments.scss";
import { useQueryClient } from "@tanstack/react-query";

type TabType = "pending" | "upcoming" | "past";

const UserAppointments = () => {
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);
  const [selectedDateTime, setSelectedDateTime] = useState<{
    date: Date;
    timeSlot: { start: Date; end: Date };
  } | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedAppointmentForReview, setSelectedAppointmentForReview] =
    useState<Appointment | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const {
    userAppointments,
    isLoadingUserAppointments,
    updateAppointmentStatus,
    rescheduleAppointment,
    createReview,
  } = useAppointment();

  const queryClient = useQueryClient();

  const handleCancel = (appointmentId: string) => {
    updateAppointmentStatus.mutate({
      appointmentId,
      status: "cancelled",
    });
  };

  const handleDateTimeSelect = (
    date: Date,
    timeSlot: { start: Date; end: Date },
  ) => {
    setSelectedDateTime({ date, timeSlot });
  };

  const handleRescheduleClick = (appointment: Appointment) => {
    if (appointment.rescheduleRequest) {
      return;
    }
    setSelectedAppointmentId(appointment._id);
    setIsRescheduleModalOpen(true);
  };

  const handleConfirmReschedule = () => {
    if (!selectedAppointmentId || !selectedDateTime) return;

    rescheduleAppointment.mutate(
      {
        appointmentId: selectedAppointmentId,
        rescheduleData: {
          proposedDate: selectedDateTime.date,
          proposedTimeSlot: selectedDateTime.timeSlot,
        },
      },
      {
        onSuccess: () => {
          setIsRescheduleModalOpen(false);
          setSelectedAppointmentId(null);
          setSelectedDateTime(null);
        },
      },
    );
  };

  const handleReviewSubmit = async (reviewData: {
    rating: number;
    feedback: string;
    image?: File;
  }) => {
    if (!selectedAppointmentForReview) return;

    try {
      await createReview.mutateAsync({
        appointmentId: selectedAppointmentForReview._id,
        ...reviewData,
      });

      setIsReviewModalOpen(false);
      setSelectedAppointmentForReview(null);
      setToast({
        message: "Review submitted successfully!",
        type: "success",
      });
    } catch (error) {
      setToast({
        message: error.response?.data?.message || "Failed to submit review",
        type: "error",
      });
    }
  };

  const filteredAppointments = {
    pending:
      userAppointments?.filter((apt) =>
        ["pending", "reschedule-pending"].includes(apt.status),
      ) || [],
    upcoming:
      userAppointments?.filter((apt) =>
        ["confirmed", "reschedule-confirmed"].includes(apt.status),
      ) || [],
    past:
      userAppointments?.filter((apt) =>
        [
          "completed",
          "cancelled",
          "no-show",
          "rejected",
          "reschedule-rejected",
        ].includes(apt.status),
      ) || [],
  };

  const getDisplayDate = (appointment) => {
    if (
      appointment.rescheduleRequest &&
      appointment.status === "reschedule-confirmed" &&
      appointment.rescheduleRequest.proposedDate
    ) {
      return new Date(
        appointment.rescheduleRequest.proposedDate,
      ).toLocaleDateString("en-US", { timeZone: "UTC" });
    }
    return new Date(appointment.appointmentDate).toLocaleDateString("en-US", {
      timeZone: "UTC",
    });
  };

  const getDisplayTime = (appointment) => {
    if (
      appointment.rescheduleRequest &&
      appointment.status === "reschedule-confirmed" &&
      appointment.rescheduleRequest.proposedTimeSlot
    ) {
      return format(
        new Date(appointment.rescheduleRequest.proposedTimeSlot.start),
        "h:mm a",
      );
    }
    return format(new Date(appointment.timeSlot.start), "h:mm a");
  };

  const renderAppointmentsTable = (appointments: typeof userAppointments) => {
    if (!appointments?.length) {
      return <div className="no-appointments">No appointments found</div>;
    }

    return (
      <div className="appointments-table">
        <table>
          <thead>
            <tr>
              <th>Service</th>
              <th>Barber</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              {(activeTab === "pending" ||
                activeTab === "upcoming" ||
                (activeTab === "past" &&
                  appointments.some(
                    (apt) => apt.status === "completed" && !apt.hasReview,
                  ))) && <th>Actions</th>}
              {activeTab === "past" && <th>Notes</th>}
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td data-label="Service">{appointment.serviceId.name}</td>
                <td data-label="Barber">
                  {typeof appointment.adminId === "object" &&
                  appointment.adminId?.name
                    ? appointment.adminId.name
                    : "-"}
                </td>
                <td data-label="Date">{getDisplayDate(appointment)}</td>
                <td data-label="Time">{getDisplayTime(appointment)}</td>
                <td data-label="Status">
                  <span className={`status-badge ${appointment.status}`}>
                    {appointment.status}
                  </span>
                </td>
                {activeTab !== "past" && (
                  <td data-label="Actions" className="actions">
                    <button
                      className="btn-cancel"
                      onClick={() => handleCancel(appointment._id)}
                      disabled={updateAppointmentStatus.isPending}
                    >
                      {updateAppointmentStatus.isPending
                        ? "Cancelling..."
                        : "Cancel"}
                    </button>
                    {!appointment.rescheduleRequest &&
                      ["pending", "confirmed"].includes(appointment.status) && (
                        <button
                          className="btn-reschedule"
                          onClick={() => handleRescheduleClick(appointment)}
                        >
                          <FaCalendarAlt /> Reschedule
                        </button>
                      )}
                  </td>
                )}
                {activeTab === "past" &&
                  appointment.status === "completed" &&
                  !appointment.hasReview && (
                    <td data-label="Actions" className="actions">
                      <button
                        className="btn-review"
                        onClick={() => {
                          setSelectedAppointmentForReview(appointment);
                          setIsReviewModalOpen(true);
                        }}
                      >
                        <span className="star-icon">⭐</span>
                        Add Review
                      </button>
                    </td>
                  )}

                {activeTab === "past" && appointment.status !== "completed" && (
                  <td data-label="Actions">-</td>
                )}
                {activeTab === "past" && (
                  <td data-label="Notes" className="notes-cell">
                    {["rejected", "reschedule-rejected"].includes(
                      appointment.status,
                    ) &&
                    appointment.rejectionDetails?.note &&
                    typeof appointment.rejectionDetails.note === "string" &&
                    appointment.rejectionDetails.note.length > 0
                      ? appointment.rejectionDetails.note
                      : "-"}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (isLoadingUserAppointments) {
    return <div className="loading-message">Loading appointments...</div>;
  }

  return (
    <div className="user-appointments">
      <div className="user-appointments__header">
        <h2>My Appointments</h2>
      </div>

      <div className="user-appointments__tabs">
        <button
          className={`tab ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          Pending ({filteredAppointments.pending.length})
        </button>
        <button
          className={`tab ${activeTab === "upcoming" ? "active" : ""}`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming ({filteredAppointments.upcoming.length})
        </button>
        <button
          className={`tab ${activeTab === "past" ? "active" : ""}`}
          onClick={() => setActiveTab("past")}
        >
          Past ({filteredAppointments.past.length})
        </button>
      </div>

      {renderAppointmentsTable(filteredAppointments[activeTab])}

      <Modal
        isOpen={isRescheduleModalOpen}
        onClose={() => {
          setIsRescheduleModalOpen(false);
          setSelectedAppointmentId(null);
          setSelectedDateTime(null);
        }}
        title="Reschedule Appointment"
      >
        <div className="reschedule-modal">
          <p className="reschedule-notice">
            Note: You can only reschedule an appointment once. If you need to
            make further changes, please cancel and book a new appointment.
          </p>

          {selectedDateTime && (
            <div className="selected-time">
              <h4>New Appointment Time:</h4>
              <p>
                Date: {new Date(selectedDateTime.date).toLocaleDateString()}
                <br />
                Time:{" "}
                {format(new Date(selectedDateTime.timeSlot.start), "h:mm a")}
              </p>
            </div>
          )}

          <DateTimeSelection
            onSelect={handleDateTimeSelect}
            isReschedule={true}
          />

          <div className="reschedule-actions">
            <button
              className="btn-confirm"
              onClick={handleConfirmReschedule}
              disabled={!selectedDateTime || rescheduleAppointment.isPending}
            >
              {rescheduleAppointment.isPending
                ? "Submitting..."
                : "Confirm Reschedule"}
            </button>
          </div>
        </div>
      </Modal>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setSelectedAppointmentForReview(null);
        }}
        onSubmit={handleReviewSubmit}
        isSubmitting={createReview.isPending}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default UserAppointments;
