import { Link } from "react-router-dom";
import { artists } from "@/data/artists";
import "./_artists.scss";

const ArtistsSection = () => {
  return (
    <section className="luxe-artists">
      <div className="luxe-section-inner">
        <span className="luxe-eyebrow luxe-eyebrow-center">The Studio</span>
        <h2>
          Meet our <em>nail artists</em>
        </h2>
        <p className="luxe-section-sub">
          Obsessive about detail, gentle with your natural nails, and
          genuinely excited about your vision.
        </p>
        <div className="luxe-artists-row">
          {artists.map((a) => (
            <Link
              key={a.id}
              to={`/technician/${a.id}`}
              className="luxe-artist-card"
            >
              <div className="luxe-artist-img">
                <img src={a.image} alt={a.name} loading="lazy" />
              </div>
              <h3>{a.name}</h3>
              <p className="luxe-artist-title">{a.title}</p>
              <p className="luxe-artist-specs">
                {a.specialties.slice(0, 2).join(" · ")}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArtistsSection;
