import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import NailGallery from "../NailGallery/NailGallery";
import "./_hero.scss";

const Hero = () => {
  const { isAuthenticated, isAdmin } = useAuthStore();
  const navigate = useNavigate();

  const showBookButton = isAuthenticated && !isAdmin;

  const handleBookNow = () => {
    navigate("/book");
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1>Luxe Nails</h1>
          <p>Beautiful nails. Professional care.</p>
          {showBookButton && (
            <button className="book-button" onClick={handleBookNow}>
              Book Now
            </button>
          )}
        </div>
        <NailGallery />
      </div>
    </section>
  );
};

export default Hero;
