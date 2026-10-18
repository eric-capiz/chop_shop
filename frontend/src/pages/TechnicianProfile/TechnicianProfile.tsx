import { useParams, useNavigate } from "react-router-dom";
import {
  useTechnicianById,
  useTechnicianServices,
  useTechnicianGallery,
} from "@/hooks/useTechnicians";
import { useAuthStore } from "@/store/authStore";
import "./_technicianProfile.scss";

const TechnicianProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const canBook = isAuthenticated && !isAdmin;

  const { data: technician, isLoading, error } = useTechnicianById(id);
  const { data: services = [] } = useTechnicianServices(id);
  const { data: gallery = [] } = useTechnicianGallery(id);

  if (isLoading) return <div className="technician-profile">Loading...</div>;
  if (error || !technician) {
    return (
      <div className="technician-profile">
        <div className="not-found">
          <h2>Technician not found</h2>
          <button onClick={() => navigate("/about")}>View All Technicians</button>
        </div>
      </div>
    );
  }

  const profileImageUrl = technician.profileImage?.url || "";
  const socialMedia = technician.socialMedia || {
    instagram: "",
    facebook: "",
    twitter: "",
  };

  const handleBookNow = () => {
    navigate(`/book?technician=${technician._id}`);
  };

  return (
    <div className="technician-profile">
      <section className="profile-hero">
        <div className="profile-image">
          <img src={profileImageUrl} alt={technician.name} />
        </div>
        <div className="profile-intro">
          <h1>{technician.name}</h1>
          <p className="experience">
            {technician.yearsOfExperience ?? 0} Years of Experience
          </p>
          <div className="specialties">
            {(technician.specialties || []).map((specialty, index) => (
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

      {technician.bio && (
        <section className="profile-bio">
          <h2>About Me</h2>
          <p>{technician.bio}</p>
        </section>
      )}

      <section className="profile-gallery">
        <h2>My Work</h2>
        <div className="gallery-grid">
          {gallery.map((item) => (
            <div key={item._id} className="gallery-item">
              <div className="gallery-item-image">
                <img src={item.image?.url || ""} alt={item.description || ""} />
              </div>
              <div className="gallery-item-info">
                <p>{item.description || ""}</p>
                {item.tags?.length ? (
                  <div className="gallery-item-tags">
                    {item.tags.map((tag, i) => (
                      <span key={i} className="tag">#{tag}</span>
                    ))}
                  </div>
                ) : null}
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
            Book an Appointment with {technician.name.split(" ")[0]}
          </button>
        </section>
      )}
    </div>
  );
};

export default TechnicianProfile;
