import { Link } from "react-router-dom";
import { useBarbersList } from "@/hooks/useBarbers";
import "./_about.scss";

const About = () => {
  const { data: barbers, isLoading, error } = useBarbersList();

  if (isLoading) return <div className="about">Loading barbers...</div>;
  if (error) return <div className="about">Failed to load barbers.</div>;
  if (!barbers?.length) return <div className="about">No barbers yet.</div>;

  return (
    <div className="about">
      <section className="about-header">
        <h1>Meet Our Barbers</h1>
        <p>Expert stylists ready to give you the perfect look</p>
      </section>

      <section className="barbers-grid">
        {barbers.map((barber) => (
          <Link
            to={`/barber/${barber._id}`}
            key={barber._id}
            className="barber-card"
          >
            <div className="barber-image">
              <img
                src={barber.profileImage?.url || ""}
                alt={barber.name}
              />
            </div>
            <div className="barber-info">
              <h3>{barber.name}</h3>
              <p className="specialty">
                {barber.specialties?.[0] ?? "Barber"}
              </p>
              <p className="experience">
                {barber.yearsOfExperience ?? 0} years experience
              </p>
              <p className="bio-preview">
                {(barber.bio || "").substring(0, 120)}
                {(barber.bio?.length ?? 0) > 120 ? "..." : ""}
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
