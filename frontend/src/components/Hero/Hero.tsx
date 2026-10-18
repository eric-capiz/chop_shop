import { Link } from "react-router-dom";
import "./_hero.scss";

const Hero = () => {
  return (
    <section className="luxe-hero">
      <div className="luxe-hero-inner">
        <div className="luxe-hero-copy">
          <span className="luxe-eyebrow">El Paso's Boutique Nail Studio</span>
          <h1>
            Nails that feel
            <em> like jewelry</em>
          </h1>
          <p className="luxe-lede">
            Hand-painted artistry, spa-grade care, and a studio designed for
            unwinding. This isn't a salon visit — it's a ritual.
          </p>
          <div className="luxe-hero-actions">
            <Link to="/book" className="luxe-btn luxe-btn-primary">
              Book Your Appointment
            </Link>
            <Link to="/our-work" className="luxe-btn luxe-btn-ghost">
              See Our Work
            </Link>
          </div>
          <div className="luxe-hero-meta">
            <span>★ 4.9 · 600+ happy clients</span>
          </div>
        </div>
        <div className="luxe-hero-media">
          <img
            src="https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80"
            alt="Elegant manicured nails at Luxe Nails studio"
          />
          <div className="luxe-hero-badge">
            <span className="luxe-hero-badge-num">8+</span>
            <span className="luxe-hero-badge-label">years of artistry</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
