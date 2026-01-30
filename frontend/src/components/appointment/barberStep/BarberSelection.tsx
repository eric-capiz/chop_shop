import { barbers, Barber } from "@/data/dummyData";
import "./_barberSelection.scss";

interface BarberSelectionProps {
  onSelect: (barber: Barber) => void;
  selectedBarberId?: string;
}

const BarberSelection = ({ onSelect, selectedBarberId }: BarberSelectionProps) => {
  return (
    <div className="barber-selection">
      <h2>Choose Your Barber</h2>
      <div className="barbers-grid">
        {barbers.map((barber) => (
          <button
            key={barber.id}
            className={`barber-option ${selectedBarberId === barber.id ? "selected" : ""}`}
            onClick={() => onSelect(barber)}
          >
            <div className="barber-image">
              <img src={barber.profileImage} alt={barber.name} />
            </div>
            <div className="barber-info">
              <h3>{barber.name}</h3>
              <p className="specialty">{barber.specialties[0]}</p>
              <p className="experience">{barber.yearsOfExperience} yrs exp</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BarberSelection;
