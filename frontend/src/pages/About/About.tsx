import { Link } from "react-router-dom";
import { barbers } from "@/data/dummyData";
import "./_about.scss";

const About = () => {
  return (
    <div className="about">
      <section className="about-header">
        <h1>Meet Our Barbers</h1>
        <p>Expert stylists ready to give you the perfect look</p>
      </section>

      <section className="barbers-grid">
        {barbers.map((barber) => (
          <Link
            to={`/barber/${barber.id}`}
            key={barber.id}
            className="barber-card"
          >
            <div className="barber-image">
              <img src={barber.profileImage} alt={barber.name} />
            </div>
            <div className="barber-info">
              <h3>{barber.name}</h3>
              <p className="specialty">{barber.specialties[0]}</p>
              <p className="experience">
                {barber.yearsOfExperience} years experience
              </p>
              <p className="bio-preview">
                {barber.bio.substring(0, 120)}...
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
