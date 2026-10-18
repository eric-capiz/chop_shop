import { Link } from "react-router-dom";
import { galleryImages } from "@/data/gallery";
import "./_galleryStrip.scss";

const GalleryStrip = () => {
  return (
    <section className="luxe-gallery-strip">
      <div className="luxe-section-inner">
        <div className="luxe-gallery-head">
          <div>
            <span className="luxe-eyebrow">Fresh Sets</span>
            <h2>
              Straight from <em>the studio</em>
            </h2>
          </div>
          <Link to="/our-work" className="luxe-link">
            View gallery →
          </Link>
        </div>
      </div>
      <div className="luxe-gallery-scroll">
        {galleryImages.map((g) => (
          <figure key={g.id} className="luxe-gallery-item">
            <img src={g.src} alt={g.alt} loading="lazy" />
            <figcaption>{g.tag}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
};

export default GalleryStrip;
