import { Link } from "react-router-dom";
import "./_bookCta.scss";

const BookCta = () => {
  return (
    <section className="luxe-book-cta">
      <div className="luxe-book-cta-inner">
        <span className="luxe-eyebrow luxe-eyebrow-light">Ready when you are</span>
        <h2>
          Your dream nails are <em>one appointment away</em>
        </h2>
        <p>
          Pick your artist, choose your treatment, and we'll handle the
          rest. Complimentary consultation with every first visit.
        </p>
        <Link to="/book" className="luxe-btn luxe-btn-light">
          Reserve Your Chair
        </Link>
      </div>
    </section>
  );
};

export default BookCta;
