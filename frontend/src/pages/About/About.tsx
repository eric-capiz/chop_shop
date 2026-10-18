import { Link } from "react-router-dom";
import { useTechniciansList } from "@/hooks/useTechnicians";
import "./_about.scss";

const About = () => {
  const { data: technicians, isLoading, error } = useTechniciansList();

  if (isLoading) return <div className="about">Loading technicians...</div>;
  if (error) return <div className="about">Failed to load technicians.</div>;
  if (!technicians?.length) return <div className="about">No technicians yet.</div>;

  return (
    <div className="about">
      <section className="about-header">
        <h1>Meet Our Nail Technicians</h1>
        <p>Expert stylists ready to give you the perfect look</p>
      </section>

      <section className="technicians-grid">
        {technicians.map((technician) => (
          <Link
            to={`/technician/${technician._id}`}
            key={technician._id}
            className="technician-card"
          >
            <div className="technician-image">
              <img
                src={technician.profileImage?.url || ""}
                alt={technician.name}
              />
            </div>
            <div className="technician-info">
              <h3>{technician.name}</h3>
              <p className="specialty">
                {technician.specialties?.[0] ?? "Technician"}
              </p>
              <p className="experience">
                {technician.yearsOfExperience ?? 0} years experience
              </p>
              <p className="bio-preview">
                {(technician.bio || "").substring(0, 120)}
                {(technician.bio?.length ?? 0) > 120 ? "..." : ""}
              </p>
              <span className="view-profile">View Profile</span>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
};

export default About;
