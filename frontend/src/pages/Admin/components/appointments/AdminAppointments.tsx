import { useState } from "react";
import { format } from "date-fns";
import { useAppointment } from "@/hooks/appointment/useAppointment";
import type { Appointment } from "@/types/appointment/appointment.types";
import "./_adminAppointments.scss";
import RejectionModal from "@/components/Modal/RejectionModal";

type TabType = "pending" | "upcoming" | "past";

const AdminAppointments = () => {
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  const {
    adminAppointments,
    isLoadingAdminAppointments,
    updateAppointmentStatus,
    respondToReschedule,
  } = useAppointment();

  const filteredAppointments = {
    pending:
      adminAppointments?.filter((apt) =>
        ["pending", "reschedule-pending"].includes(apt.status),
      ) || [],
    upcoming:
      adminAppointments?.filter((apt) =>
        ["confirmed", "reschedule-confirmed"].includes(apt.status),
      ) || [],
    past:
      adminAppointments?.filter((apt) =>
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
      appointment.status.includes("reschedule") &&
      appointment.rescheduleRequest
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
      appointment.status.includes("reschedule") &&
      appointment.rescheduleRequest
    ) {
      return format(
        new Date(appointment.rescheduleRequest.proposedTimeSlot.start),
        "h:mm a",
      );
    }
    return format(new Date(appointment.timeSlot.start), "h:mm a");
  };

  const handleConfirm = (appointment: Appointment) => {
    if (appointment.status === "reschedule-pending") {
      respondToReschedule.mutate({
        appointmentId: appointment._id,
        status: "confirm",
      });
    } else {
      updateAppointmentStatus.mutate({
        appointmentId: appointment._id,
        status: "confirmed",
      });
    }
  };

  const handleReject = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsRejectionModalOpen(true);
  };

  const handleRejectionConfirm = async (note: string) => {
    if (!selectedAppointment?._id) return;

    if (selectedAppointment.status === "reschedule-pending") {
      respondToReschedule.mutate({
        appointmentId: selectedAppointment._id,
        status: "reject",
        rejectionDetails: {
          note,
        },
      });
    } else {
      updateAppointmentStatus.mutate({
        appointmentId: selectedAppointment._id,
        status: "rejected",
        rejectionDetails: {
          note,
          rejectedAt: new Date().toISOString(),
        },
      });
    }

    setIsRejectionModalOpen(false);
    setSelectedAppointment(null);
  };

  const handleComplete = (appointment: Appointment) => {
    updateAppointmentStatus.mutate({
      appointmentId: appointment._id,
      status: "completed",
    });
  };

  const renderAppointmentsTable = (appointments: typeof adminAppointments) => {
    if (!appointments?.length) {
      return <div className="no-appointments">No appointments found</div>;
    }

    return (
      <div className="appointments-table">
        <table>
          <thead>
            <tr>
              <th>Client</th>
              <th>Contact Info</th>
              <th>Service</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              {(activeTab === "pending" || activeTab === "upcoming") && (
                <th>Actions</th>
              )}
              {activeTab === "past" && <th>Rejection Note</th>}
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment._id}>
                <td data-label="Client">{appointment.userId.name}</td>
                <td data-label="Contact Info">
                  <div>
                    <div>📧 {appointment.contactInfo.email}</div>
                    <div>📱 {appointment.contactInfo.phone}</div>
                  </div>
                </td>
                <td data-label="Service">{appointment.serviceId.name}</td>
                <td data-label="Date">{getDisplayDate(appointment)}</td>
                <td data-label="Time">{getDisplayTime(appointment)}</td>
                <td data-label="Status">
                  <span className={`status-badge ${appointment.status}`}>
                    {appointment.status}
                  </span>
                </td>
                {activeTab === "pending" && renderActions(appointment)}
                {activeTab === "upcoming" && renderUpcomingActions(appointment)}
                {activeTab === "past" && (
                  <td data-label="Rejection Note" className="rejection-note">
                    {["rejected", "reschedule-rejected"].includes(
                      appointment.status,
                    ) &&
                    appointment.rejectionDetails?.note &&
                    typeof appointment.rejectionDetails.note === "string" &&
                    appointment.rejectionDetails.note.length > 0
                      ? appointment.rejectionDetails.note
                      : null}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderActions = (appointment: Appointment) => {
    if (!["pending", "reschedule-pending"].includes(appointment.status)) {
      return null;
    }

    const isProcessing =
      updateAppointmentStatus.isPending || respondToReschedule.isPending;

    return (
      <td data-label="Actions" className="actions">
        <button
          className="btn-confirm"
          onClick={() => handleConfirm(appointment)}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Confirm"}
        </button>
        <button
          className="btn-reject"
          onClick={() => handleReject(appointment)}
          disabled={isProcessing}
        >
          <span className="reject-icon">✕</span> Reject
        </button>
      </td>
    );
  };

  const renderUpcomingActions = (appointment: Appointment) => {
    if (!["confirmed", "reschedule-confirmed"].includes(appointment.status)) {
      return null;
    }

    return (
      <td data-label="Actions" className="actions">
        <button
          className="btn-complete"
          onClick={() => handleComplete(appointment)}
          disabled={updateAppointmentStatus.isPending}
        >
          {updateAppointmentStatus.isPending ? "Processing..." : "Complete"}
        </button>
      </td>
    );
  };

  if (isLoadingAdminAppointments) {
    return <div className="loading-message">Loading appointments...</div>;
  }

  return (
    <div className="admin-appointments">
      <div className="admin-appointments__header">
        <h2>Appointments</h2>
      </div>

      <div className="admin-appointments__tabs">
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

      <RejectionModal
        isOpen={isRejectionModalOpen}
        onClose={() => {
          setIsRejectionModalOpen(false);
          setSelectedAppointment(null);
        }}
        onConfirm={handleRejectionConfirm}
        appointmentType={selectedAppointment?.status || "pending"}
      />
    </div>
  );
};

export default AdminAppointments;
