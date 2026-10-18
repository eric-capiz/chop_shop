import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import TechnicianSelection from "@/components/appointment/technicianStep/TechnicianSelection";
import DateTimeSelection from "@/components/appointment/dateStep/DateTimeSelection";
import ServiceSelection from "@/components/appointment/serviceStep/ServiceSelection";
import ContactInfo from "@/components/appointment/contactStep/ContactInfo";
import ConfirmBooking from "@/components/appointment/confirmStep/ConfirmBooking";
import { useTechnicianById } from "@/hooks/useTechnicians";
import type { PublicTechnician } from "@/types/technician.types";
import "./_bookingPage.scss";

interface Service {
  _id: string;
  name: string;
  duration?: number;
  price: number;
}

interface BookingData {
  technician: PublicTechnician | null;
  appointmentDateTime: Date | null;
  service: {
    _id: string;
    name: string;
    duration?: number;
    price: number;
  } | null;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
  } | null;
}

const initialBookingState: BookingData = {
  technician: null,
  appointmentDateTime: null,
  service: null,
  contactInfo: null,
};

const getStepTitle = (step: number) => {
  switch (step) {
    case 1:
      return "Choose Technician";
    case 2:
      return "Select Date & Time";
    case 3:
      return "Choose Service";
    case 4:
      return "Contact Info";
    case 5:
      return "Confirm";
    default:
      return "";
  }
};

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const preSelectedBarberId = searchParams.get("technician");

  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>(initialBookingState);
  const [maxVisitedStep, setMaxVisitedStep] = useState(1);

  const { data: preSelectedBarber } = useTechnicianById(
    preSelectedBarberId || undefined,
    !!preSelectedBarberId
  );

  useEffect(() => {
    if (preSelectedBarberId && preSelectedBarber) {
      setBookingData((prev) => ({ ...prev, technician: preSelectedBarber }));
      setCurrentStep(2);
      setMaxVisitedStep(2);
    }
  }, [preSelectedBarberId, preSelectedBarber]);

  const handleBarberSelect = (technician: PublicTechnician) => {
    setBookingData((prev) => ({
      ...prev,
      technician,
    }));
    setCurrentStep(2);
    setMaxVisitedStep(Math.max(maxVisitedStep, 2));
  };

  const handleDateTimeSelect = (
    date: Date,
    timeSlot: { start: Date; end: Date }
  ) => {
    setBookingData((prev) => ({
      ...prev,
      appointmentDateTime: timeSlot.start,
    }));
    setCurrentStep(3);
    setMaxVisitedStep(Math.max(maxVisitedStep, 3));
  };

  const handleServiceSelect = (selectedService: Service) => {
    setBookingData((prev) => ({
      ...prev,
      service: selectedService,
    }));
    setCurrentStep(4);
    setMaxVisitedStep(Math.max(maxVisitedStep, 4));
  };

  const handleContactInfoSubmit = (contactInfo: BookingData["contactInfo"]) => {
    setBookingData((prev) => ({
      ...prev,
      contactInfo,
    }));
    setCurrentStep(5);
    setMaxVisitedStep(Math.max(maxVisitedStep, 5));
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <TechnicianSelection
            onSelect={handleBarberSelect}
            selectedBarberId={bookingData.technician?._id}
          />
        );
      case 2:
        return (
          <DateTimeSelection
            onSelect={handleDateTimeSelect}
            technicianId={bookingData.technician?._id}
          />
        );
      case 3:
        return (
          <ServiceSelection
            onSelect={handleServiceSelect}
            technicianId={bookingData.technician?._id}
          />
        );
      case 4:
        return <ContactInfo onSubmit={handleContactInfoSubmit} />;
      case 5:
        return bookingData.technician &&
          bookingData.appointmentDateTime &&
          bookingData.service &&
          bookingData.contactInfo ? (
          <ConfirmBooking
            bookingData={{
              technician: bookingData.technician,
              appointmentDateTime: bookingData.appointmentDateTime,
              service: bookingData.service,
              contactInfo: bookingData.contactInfo,
            }}
            onStepChange={setCurrentStep}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className="booking-page">
      <div className="booking-container">
        <div className="booking-header">
          <h1>Book Your Appointment</h1>
          {bookingData.technician && (
            <p className="selected-technician">with {bookingData.technician.name}</p>
          )}
        </div>

        <div className="booking-steps">
          {[1, 2, 3, 4, 5].map((step) => (
            <button
              key={step}
              onClick={() => {
                if (step < 5 && step <= maxVisitedStep) {
                  setCurrentStep(step);
                }
              }}
              className={`step ${currentStep === step ? "active" : ""} ${
                step < 5 && step <= maxVisitedStep ? "clickable" : ""
              }`}
              disabled={step === 5 || step > maxVisitedStep}
            >
              {step}. {getStepTitle(step)}
            </button>
          ))}
        </div>

        <div className="step-content">{renderCurrentStep()}</div>
      </div>
    </div>
  );
};

export default BookingPage;
