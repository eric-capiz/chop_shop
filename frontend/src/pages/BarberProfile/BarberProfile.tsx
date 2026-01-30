import { useParams, useNavigate } from "react-router-dom";
import {
  useBarberById,
  useBarberServices,
  useBarberGallery,
} from "@/hooks/useBarbers";
import { useAuthStore } from "@/store/authStore";
import "./_barberProfile.scss";

const BarberProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const canBook = isAuthenticated && !isAdmin;

  const { data: barber, isLoading, error } = useBarberById(id);
  const { data: services = [] } = useBarberServices(id);
  const { data: gallery = [] } = useBarberGallery(id);

  if (isLoading) return <div className="barber-profile">Loading...</div>;
  if (error || !barber) {
    return (
      <div className="barber-profile">
        <div className="not-found">
          <h2>Barber not found</h2>
          <button onClick={() => navigate("/about")}>View All Barbers</button>
        </div>
      </div>
    );
  }

  const profileImageUrl = barber.profileImage?.url || "";
  const socialMedia = barber.socialMedia || {
    instagram: "",
    facebook: "",
    twitter: "",
  };

  const handleBookNow = () => {
    navigate(`/book?barber=${barber._id}`);
  };

  return (
    <div className="barber-profile">
      <section className="profile-hero">
        <div className="profile-image">
          <img src={profileImageUrl} alt={barber.name} />
        </div>
        <div className="profile-intro">
          <h1>{barber.name}</h1>
          <p className="experience">
            {barber.yearsOfExperience ?? 0} Years of Experience
          </p>
          <div className="specialties">
            {(barber.specialties || []).map((specialty, index) => (
              <span key={index} className="specialty-tag">
                {specialty}
              </span>
            ))}
          </div>
          {canBook && (
            <button className="book-cta" onClick={handleBookNow}>
              Book Me
            </button>
          )}
        </div>
      </section>

      {barber.bio && (
        <section className="profile-bio">
          <h2>About Me</h2>
          <p>{barber.bio}</p>
        </section>
      )}

      <section className="profile-gallery">
        <h2>My Work</h2>
        <div className="gallery-grid">
          {gallery.map((item) => (
            <div key={item._id} className="gallery-item">
              <img src={item.image?.url || ""} alt={item.description || ""} />
              <div className="gallery-overlay">
                <p>{item.description || ""}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="profile-services">
        <h2>Services & Pricing</h2>
        <div className="services-grid">
          {services.map((service) => (
            <div key={service._id} className="service-card">
              <div className="service-header">
                <h3>{service.name}</h3>
                <span className="price">${service.price}</span>
              </div>
              {service.description && <p>{service.description}</p>}
            </div>
          ))}
        </div>
      </section>

      {(socialMedia.instagram || socialMedia.facebook || socialMedia.twitter) && (
        <section className="profile-social">
          <h2>Follow Me</h2>
          <div className="social-links">
            {socialMedia.instagram && (
              <a
                href={
                  socialMedia.instagram.startsWith("http")
                    ? socialMedia.instagram
                    : `https://instagram.com/${socialMedia.instagram.replace("@", "")}`
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                {socialMedia.instagram}
              </a>
            )}
            {socialMedia.facebook && (
              <a
                href={
                  socialMedia.facebook.startsWith("http")
                    ? socialMedia.facebook
                    : `https://facebook.com/${socialMedia.facebook}`
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                {socialMedia.facebook}
              </a>
            )}
            {socialMedia.twitter && (
              <a
                href={
                  socialMedia.twitter.startsWith("http")
                    ? socialMedia.twitter
                    : `https://twitter.com/${socialMedia.twitter.replace("@", "")}`
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                {socialMedia.twitter}
              </a>
            )}
          </div>
        </section>
      )}

      {canBook && (
        <section className="profile-cta">
          <button className="book-cta-large" onClick={handleBookNow}>
            Book an Appointment with {barber.name.split(" ")[0]}
          </button>
        </section>
      )}
    </div>
  );
};

export default BarberProfile;
