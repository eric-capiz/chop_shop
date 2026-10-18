import { useTechniciansList } from "@/hooks/useTechnicians";
import type { PublicTechnician } from "@/types/technician.types";
import "./_barberSelection.scss";

interface TechnicianSelectionProps {
  onSelect: (technician: PublicTechnician) => void;
  selectedBarberId?: string;
}

const TechnicianSelection = ({ onSelect, selectedBarberId }: TechnicianSelectionProps) => {
  const { data: technicians, isLoading, error } = useTechniciansList();

  if (isLoading) return <div className="technician-selection">Loading technicians...</div>;
  if (error) return <div className="technician-selection">Failed to load technicians.</div>;
  if (!technicians?.length) return <div className="technician-selection">No technicians available.</div>;

  return (
    <div className="technician-selection">
      <h2>Choose Your Technician</h2>
      <div className="technicians-grid">
        {technicians.map((technician) => (
          <button
            key={technician._id}
            className={`technician-option ${selectedBarberId === technician._id ? "selected" : ""}`}
            onClick={() => onSelect(technician)}
          >
            <div className="technician-image">
              <img src={technician.profileImage?.url || ""} alt={technician.name} />
            </div>
            <div className="technician-info">
              <h3>{technician.name}</h3>
              <p className="specialty">{technician.specialties?.[0] ?? "Technician"}</p>
              <p className="experience">{technician.yearsOfExperience ?? 0} yrs exp</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TechnicianSelection;
