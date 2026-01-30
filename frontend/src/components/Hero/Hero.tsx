import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import HaircutGallery from "../HaircutGallery/HaircutGallery";
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
          <h1>Chop Shop</h1>
          <p>Multiple barbers. One great experience.</p>
          {showBookButton && (
            <button className="book-button" onClick={handleBookNow}>
              Book Now
            </button>
          )}
        </div>
        <HaircutGallery />
      </div>
    </section>
  );
};

export default Hero;
