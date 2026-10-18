import { Link } from "react-router-dom";
import { services } from "@/data/services";
import "./_services.scss";

const ServicesSection = () => {
  const featured = services.slice(0, 6);

  return (
    <section className="luxe-services">
      <div className="luxe-section-inner">
        <span className="luxe-eyebrow luxe-eyebrow-center">Our Menu</span>
        <h2>
          Treatments crafted <em>for you</em>
        </h2>
        <p className="luxe-section-sub">
          Every service begins with a consultation and ends with nails
          you're obsessed with.
        </p>
        <div className="luxe-services-grid">
          {featured.map((s) => (
            <article key={s.id} className="luxe-service-card">
              <div className="luxe-service-img">
                <img src={s.image} alt={s.name} loading="lazy" />
                <span className="luxe-service-price">${s.price}</span>
              </div>
              <div className="luxe-service-body">
                <h3>{s.name}</h3>
                <p>{s.description}</p>
                <span className="luxe-service-duration">
                  {s.durationMin} min
                </span>
              </div>
            </article>
          ))}
        </div>
        <div className="luxe-center">
          <Link to="/book" className="luxe-btn luxe-btn-primary">
            Book Your Treatment
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
