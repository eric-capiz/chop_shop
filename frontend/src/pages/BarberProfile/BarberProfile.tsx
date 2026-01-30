import { useParams, useNavigate } from "react-router-dom";
import {
  getBarberById,
  getServicesForBarber,
  getGalleryForBarber,
} from "@/data/dummyData";
import { useAuthStore } from "@/store/authStore";
import "./_barberProfile.scss";

const BarberProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const canBook = isAuthenticated && !isAdmin;

  const barber = id ? getBarberById(id) : undefined;
  const services = id ? getServicesForBarber(id) : [];
  const gallery = id ? getGalleryForBarber(id) : [];

  if (!barber) {
    return (
      <div className="barber-profile">
        <div className="not-found">
          <h2>Barber not found</h2>
          <button onClick={() => navigate("/about")}>View All Barbers</button>
        </div>
      </div>
    );
  }

  const handleBookNow = () => {
    navigate(`/book?barber=${barber.id}`);
  };

  return (
    <div className="barber-profile">
      {/* Hero Section */}
      <section className="profile-hero">
        <div className="profile-image">
          <img src={barber.profileImage} alt={barber.name} />
        </div>
        <div className="profile-intro">
          <h1>{barber.name}</h1>
          <p className="experience">
            {barber.yearsOfExperience} Years of Experience
          </p>
          <div className="specialties">
            {barber.specialties.map((specialty, index) => (
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

      {/* Bio Section */}
      <section className="profile-bio">
        <h2>About Me</h2>
        <p>{barber.bio}</p>
      </section>

      {/* Gallery Section */}
      <section className="profile-gallery">
        <h2>My Work</h2>
        <div className="gallery-grid">
          {gallery.map((item) => (
            <div key={item._id} className="gallery-item">
              <img src={item.image.url} alt={item.description} />
              <div className="gallery-overlay">
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="profile-services">
        <h2>Services & Pricing</h2>
        <div className="services-grid">
          {services.map((service) => (
            <div key={service._id} className="service-card">
              <div className="service-header">
                <h3>{service.name}</h3>
                <span className="price">${service.price}</span>
              </div>
              <p>{service.description}</p>
              <span className="duration">{service.duration} min</span>
            </div>
          ))}
        </div>
      </section>

      {/* Payment */}
      <section className="profile-payment">
        <h2>Payment</h2>
        <p className="payment-note">{barber.payment.note}</p>
        <div className="payment-methods">
          <div className="payment-item">
            <span className="label">Cash App:</span>
            <span className="value">{barber.payment.cashApp}</span>
          </div>
          <div className="payment-item">
            <span className="label">Zelle:</span>
            <a href={`mailto:${barber.payment.zelleEmail}`} className="value">
              {barber.payment.zelleEmail}
            </a>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="profile-contact">
        <h2>Contact</h2>
        <p className="contact-note">Text or call to book or ask questions.</p>
        <a href={`tel:${barber.contactPhone.replace(/\D/g, "")}`} className="contact-phone">
          {barber.contactPhone}
        </a>
      </section>

      {/* Social Media */}
      <section className="profile-social">
        <h2>Follow Me</h2>
        <div className="social-links">
          {barber.socialMedia.instagram && (
            <a
              href={`https://instagram.com/${barber.socialMedia.instagram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {barber.socialMedia.instagram}
            </a>
          )}
          {barber.socialMedia.facebook && (
            <a
              href={`https://facebook.com/${barber.socialMedia.facebook}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {barber.socialMedia.facebook}
            </a>
          )}
          {barber.socialMedia.twitter && (
            <a
              href={`https://twitter.com/${barber.socialMedia.twitter.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {barber.socialMedia.twitter}
            </a>
          )}
        </div>
      </section>

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
