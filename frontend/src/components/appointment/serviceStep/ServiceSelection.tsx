import { useBarberServices } from "@/hooks/useBarbers";
import type { PublicService } from "@/types/barber.types";
import "./_serviceSelection.scss";

interface ServiceSelectionProps {
  barberId?: string;
  onSelect: (service: {
    _id: string;
    name: string;
    duration?: number;
    price: number;
  }) => void;
}

const ServiceSelection = ({ barberId, onSelect }: ServiceSelectionProps) => {
  const { data: services, isLoading } = useBarberServices(barberId);

  if (isLoading) return <div className="service-selection">Loading services...</div>;
  if (!barberId) return <div className="service-selection">Select a barber first.</div>;
  if (!services?.length) return <div className="service-selection">No services for this barber.</div>;

  const handleServiceClick = (service: PublicService) => {
    onSelect({
      _id: service._id,
      name: service.name,
      duration: service.duration,
      price: service.price,
    });
  };

  return (
    <div className="service-selection">
      <div className="services-grid">
        {services.map((service) => (
          <button
            key={service._id}
            className="service-card"
            onClick={() => handleServiceClick(service)}
          >
            <h3 className="service-name">{service.name}</h3>
            <div className="service-details">
              {service.duration != null && (
                <span className="service-duration">{service.duration} min</span>
              )}
              <span className="service-price">${service.price}</span>
            </div>
            {service.description && (
              <p className="service-description">{service.description}</p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelection;
