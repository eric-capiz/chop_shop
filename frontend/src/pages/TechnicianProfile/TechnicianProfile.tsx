import { useParams, useNavigate, Link } from "react-router-dom";
import { artists } from "@/data/artists";
import { services } from "@/data/services";
import { galleryImages } from "@/data/gallery";
import "./_technicianProfile.scss";

const TechnicianProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const artist = artists.find((a) => a.id === id);

  if (!artist) {
    return (
      <div className="luxe-artist-profile">
        <div className="luxe-section-inner luxe-center">
          <h2>Artist not found</h2>
          <button
            className="luxe-btn luxe-btn-primary"
            onClick={() => navigate("/about")}
          >
            View All Nail Artists
          </button>
        </div>
      </div>
    );
  }

  const artistServices = services.slice(0, 4);

  return (
    <div className="luxe-artist-profile">
      <section className="luxe-artist-hero">
        <div className="luxe-artist-hero-img">
          <img src={artist.image} alt={artist.name} />
        </div>
        <div className="luxe-artist-hero-copy">
          <span className="luxe-eyebrow">{artist.title}</span>
          <h1>{artist.name}</h1>
          <p className="luxe-artist-exp">
            {artist.yearsOfExperience} years of artistry
          </p>
          <div className="luxe-artist-specs">
            {artist.specialties.map((s) => (
              <span key={s} className="luxe-spec-tag">
                {s}
              </span>
            ))}
          </div>
          <p className="luxe-artist-bio">{artist.bio}</p>
          <Link to="/book" className="luxe-btn luxe-btn-primary">
            Book with {artist.name.split(" ")[0]}
          </Link>
        </div>
      </section>

      <section className="luxe-artist-services">
        <div className="luxe-section-inner">
          <h2>
            Signature <em>services</em>
          </h2>
          <div className="luxe-mini-services">
            {artistServices.map((s) => (
              <div key={s.id} className="luxe-mini-service">
                <div>
                  <h4>{s.name}</h4>
                  <span>{s.durationMin} min</span>
                </div>
                <span className="luxe-mini-price">${s.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="luxe-artist-work">
        <div className="luxe-section-inner">
          <h2>
            Recent <em>work</em>
          </h2>
          <div className="luxe-artist-work-grid">
            {galleryImages.slice(0, 4).map((g) => (
              <img key={g.id} src={g.src} alt={g.alt} loading="lazy" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TechnicianProfile;
