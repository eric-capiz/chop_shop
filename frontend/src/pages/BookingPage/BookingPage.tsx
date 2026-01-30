import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import BarberSelection from "@/components/appointment/barberStep/BarberSelection";
import DateTimeSelection from "@/components/appointment/dateStep/DateTimeSelection";
import ServiceSelection from "@/components/appointment/serviceStep/ServiceSelection";
import ContactInfo from "@/components/appointment/contactStep/ContactInfo";
import ConfirmBooking from "@/components/appointment/confirmStep/ConfirmBooking";
import { useBarberById } from "@/hooks/useBarbers";
import type { PublicBarber } from "@/types/barber.types";
import "./_bookingPage.scss";

interface Service {
  _id: string;
  name: string;
  duration?: number;
  price: number;
}

interface BookingData {
  barber: PublicBarber | null;
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
  barber: null,
  appointmentDateTime: null,
  service: null,
  contactInfo: null,
};

const getStepTitle = (step: number) => {
  switch (step) {
    case 1:
      return "Choose Barber";
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
  const preSelectedBarberId = searchParams.get("barber");

  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>(initialBookingState);
  const [maxVisitedStep, setMaxVisitedStep] = useState(1);

  const { data: preSelectedBarber } = useBarberById(
    preSelectedBarberId || undefined,
    !!preSelectedBarberId
  );

  useEffect(() => {
    if (preSelectedBarberId && preSelectedBarber) {
      setBookingData((prev) => ({ ...prev, barber: preSelectedBarber }));
      setCurrentStep(2);
      setMaxVisitedStep(2);
    }
  }, [preSelectedBarberId, preSelectedBarber]);

  const handleBarberSelect = (barber: PublicBarber) => {
    setBookingData((prev) => ({
      ...prev,
      barber,
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
          <BarberSelection
            onSelect={handleBarberSelect}
            selectedBarberId={bookingData.barber?._id}
          />
        );
      case 2:
        return (
          <DateTimeSelection
            onSelect={handleDateTimeSelect}
            barberId={bookingData.barber?._id}
          />
        );
      case 3:
        return (
          <ServiceSelection
            onSelect={handleServiceSelect}
            barberId={bookingData.barber?._id}
          />
        );
      case 4:
        return <ContactInfo onSubmit={handleContactInfoSubmit} />;
      case 5:
        return bookingData.barber &&
          bookingData.appointmentDateTime &&
          bookingData.service &&
          bookingData.contactInfo ? (
          <ConfirmBooking
            bookingData={{
              barber: bookingData.barber,
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
          {bookingData.barber && (
            <p className="selected-barber">with {bookingData.barber.name}</p>
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
