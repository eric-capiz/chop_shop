import { useBarbersList } from "@/hooks/useBarbers";
import type { PublicBarber } from "@/types/barber.types";
import "./_barberSelection.scss";

interface BarberSelectionProps {
  onSelect: (barber: PublicBarber) => void;
  selectedBarberId?: string;
}

const BarberSelection = ({ onSelect, selectedBarberId }: BarberSelectionProps) => {
  const { data: barbers, isLoading, error } = useBarbersList();

  if (isLoading) return <div className="barber-selection">Loading barbers...</div>;
  if (error) return <div className="barber-selection">Failed to load barbers.</div>;
  if (!barbers?.length) return <div className="barber-selection">No barbers available.</div>;

  return (
    <div className="barber-selection">
      <h2>Choose Your Barber</h2>
      <div className="barbers-grid">
        {barbers.map((barber) => (
          <button
            key={barber._id}
            className={`barber-option ${selectedBarberId === barber._id ? "selected" : ""}`}
            onClick={() => onSelect(barber)}
          >
            <div className="barber-image">
              <img src={barber.profileImage?.url || ""} alt={barber.name} />
            </div>
            <div className="barber-info">
              <h3>{barber.name}</h3>
              <p className="specialty">{barber.specialties?.[0] ?? "Barber"}</p>
              <p className="experience">{barber.yearsOfExperience ?? 0} yrs exp</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BarberSelection;
