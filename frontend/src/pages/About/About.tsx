import { Link } from "react-router-dom";
import { artists } from "@/data/artists";
import "./_about.scss";

const About = () => {
  return (
    <div className="about">
      <section className="about-hero">
        <div className="about-hero-inner">
          <span className="luxe-eyebrow">Our Story</span>
          <h1>
            A studio built for <em>the love of nails</em>
          </h1>
          <p>
            Luxe Nails began with a simple belief: a nail appointment
            should feel like a retreat, not a rush job. Our artists
            train in the latest techniques — from Japanese gel to
            hand-painted art — and every service starts with the health
            of your natural nails.
          </p>
        </div>
        <div className="about-hero-img">
          <img src="https://images.unsplash.com/photo-1600948836101-f9ffda59d250?w=800&q=80" alt="Inside the Luxe Nails studio" />
        </div>
      </section>

      <section className="about-artists">
        <div className="luxe-section-inner">
          <span className="luxe-eyebrow luxe-eyebrow-center">The Team</span>
          <h2>
            Meet our <em>nail artists</em>
          </h2>
          <div className="about-artists-grid">
            {artists.map((artist) => (
              <Link
                to={`/technician/${artist.id}`}
                key={artist.id}
                className="about-artist-card"
              >
                <div className="about-artist-img">
                  <img src={artist.image} alt={artist.name} loading="lazy" />
                </div>
                <h3>{artist.name}</h3>
                <p className="about-artist-title">{artist.title}</p>
                <p className="about-artist-exp">
                  {artist.yearsOfExperience} years of experience
                </p>
                <p className="about-artist-bio">
                  {artist.bio.substring(0, 140)}...
                </p>
                <span className="about-artist-link">View profile →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
