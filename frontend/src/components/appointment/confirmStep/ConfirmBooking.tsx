import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import type { PublicBarber } from "@/types/barber.types";
import Toast from "@/components/common/Toast";
import { useAppointment } from "@/hooks/appointment/useAppointment";
import "./_confirmBooking.scss";

interface ConfirmBookingProps {
  bookingData: {
    barber: PublicBarber;
    appointmentDateTime: Date;
    service: {
      _id: string;
      name: string;
      duration?: number;
      price: number;
    };
    contactInfo: {
      name: string;
      email: string;
      phone: string;
    };
  };
  onStepChange: (step: number) => void;
}

const ConfirmBooking = ({ bookingData, onStepChange }: ConfirmBookingProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const { createAppointment } = useAppointment();

  const handleConfirm = async () => {
    const start = new Date(bookingData.appointmentDateTime);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const appointmentDate = new Date(start);
    appointmentDate.setUTCHours(0, 0, 0, 0);
    try {
      await createAppointment.mutateAsync({
        adminId: bookingData.barber._id,
        serviceId: bookingData.service._id,
        appointmentDate,
        timeSlot: { start, end },
        contactInfo: {
          email: bookingData.contactInfo.email,
          phone: bookingData.contactInfo.phone,
        },
      });
      setToast({
        message: `Appointment request sent to ${bookingData.barber.name}!`,
        type: "success",
      });
      setIsSubmitted(true);
      setTimeout(() => {
        navigate("/about");
      }, 3000);
    } catch (err: any) {
      setToast({
        message:
          err.response?.data?.message ?? "Booking failed. Please try again.",
        type: "error",
      });
    }
  };

  const profileImageUrl =
    typeof bookingData.barber.profileImage === "string"
      ? bookingData.barber.profileImage
      : bookingData.barber.profileImage?.url ?? "";

  return (
    <div className="confirm-booking">
      <div className="confirmation-header">
        <h2>Review Your Appointment</h2>
        <p className="verify-message">
          Please verify all details below. To make changes, click the
          corresponding section to go back to that step.
        </p>
      </div>

      <div className="confirmation-details">
        <section className="detail-section" onClick={() => onStepChange(1)}>
          <h3>Barber</h3>
          <div className="detail-content barber-detail">
            <img
              src={profileImageUrl}
              alt={bookingData.barber.name}
              className="barber-thumbnail"
            />
            <div>
              <p className="barber-name">{bookingData.barber.name}</p>
              <p className="barber-specialty">
                {bookingData.barber.specialties?.[0] ?? "Barber"}
              </p>
            </div>
          </div>
        </section>

        <section className="detail-section" onClick={() => onStepChange(2)}>
          <h3>Date & Time</h3>
          <div className="detail-content">
            <p className="date">
              {format(
                new Date(bookingData.appointmentDateTime),
                "MMMM d, yyyy"
              )}
            </p>
            <p className="time">
              {format(new Date(bookingData.appointmentDateTime), "h:mm a")}
            </p>
          </div>
        </section>

        <section className="detail-section" onClick={() => onStepChange(3)}>
          <h3>Service Details</h3>
          <div className="detail-content">
            <p className="service-name">{bookingData.service.name}</p>
            <div className="service-meta">
              {bookingData.service.duration != null && (
                <span className="duration">
                  {bookingData.service.duration} min
                </span>
              )}
              <span className="price">
                ${bookingData.service.price.toFixed(2)}
              </span>
            </div>
          </div>
        </section>

        <section className="detail-section" onClick={() => onStepChange(4)}>
          <h3>Contact Information</h3>
          <div className="detail-content">
            <p className="contact-name">{bookingData.contactInfo.name}</p>
            <p className="contact-detail">
              Email: {bookingData.contactInfo.email}
            </p>
            <p className="contact-detail">
              Phone: {bookingData.contactInfo.phone}
            </p>
          </div>
        </section>
      </div>

      <div className="confirmation-actions">
        <p className="confirmation-note">
          By clicking confirm, you agree to our booking terms and cancellation
          policy.
        </p>
        <button
          className="confirm-button"
          onClick={handleConfirm}
          disabled={createAppointment.isPending || isSubmitted}
        >
          {createAppointment.isPending
            ? "Sending request..."
            : isSubmitted
            ? "Request Sent!"
            : "Confirm Booking"}
        </button>
      </div>

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

export default ConfirmBooking;
