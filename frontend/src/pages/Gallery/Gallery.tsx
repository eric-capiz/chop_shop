import { galleryImages } from "@/data/gallery";
import "./_gallery.scss";

const Gallery = () => {
  return (
    <div className="luxe-gallery-page">
      <div className="luxe-section-inner">
        <span className="luxe-eyebrow luxe-eyebrow-center">Portfolio</span>
        <h1>
          Our <em>work</em>
        </h1>
        <p className="luxe-section-sub">
          Real sets from our studio chairs. Every photo is our own work —
          no stock, no filters, just artistry.
        </p>
        <div className="luxe-gallery-masonry">
          {galleryImages.map((g) => (
            <figure key={g.id} className="luxe-gallery-card">
              <img src={g.src} alt={g.alt} loading="lazy" />
              <figcaption>
                <span className="luxe-gallery-tag">{g.tag}</span>
                <span className="luxe-gallery-alt">{g.alt}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
