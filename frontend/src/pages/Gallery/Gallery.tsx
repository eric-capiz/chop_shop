import { Link } from "react-router-dom";
import { useTechniciansList } from "@/hooks/useTechnicians";
import { useTechnicianGallery, useTechnicianReviews } from "@/hooks/useTechnicians";
import { format } from "date-fns";
import { FaStar } from "react-icons/fa";
import "./_gallery.scss";

const BarberWorkSection = ({ technicianId }: { technicianId: string }) => {
  const { data: topGallery = [] } = useTechnicianGallery(technicianId);
  const { data: topReviews = [] } = useTechnicianReviews(technicianId);
  const gallerySlice = topGallery.slice(0, 3);
  const reviewsSlice = topReviews.slice(0, 3);

  return (
    <>
      <div className="technician-gallery">
        <h3>Top cuts</h3>
        <div className="gallery-grid">
          {gallerySlice.map((item) => (
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
      </div>
      <div className="technician-reviews">
        <h3>Top reviews</h3>
        {reviewsSlice.length > 0 ? (
          <div className="reviews-grid">
            {reviewsSlice.map((review) => (
              <div key={review._id} className="review-card">
                <div className="review-header">
                  <h4>{review.userId?.name ?? "Guest"}</h4>
                  <div className="rating">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={
                          i < review.rating ? "star-filled" : "star-empty"
                        }
                      />
                    ))}
                  </div>
                </div>
                <p className="review-text">{review.feedback}</p>
                {review.image?.url && (
                  <div className="review-image">
                    <img src={review.image.url} alt="Review" />
                  </div>
                )}
                <div className="review-date">
                  {format(new Date(review.createdAt), "MMM d, yyyy")}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-reviews">No reviews yet.</p>
        )}
      </div>
    </>
  );
};

const Gallery = () => {
  const { data: technicians, isLoading, error } = useTechniciansList();

  if (isLoading) return <div className="gallery-page our-work-page">Loading...</div>;
  if (error) return <div className="gallery-page our-work-page">Failed to load.</div>;
  if (!technicians?.length) return <div className="gallery-page our-work-page">No technicians yet.</div>;

  return (
    <div className="gallery-page our-work-page">
      <h1>Our Work</h1>

      {technicians.map((technician) => (
        <section key={technician._id} className="technician-work-section">
          <div className="technician-section-header">
            <Link to={`/technician/${technician._id}`} className="technician-link">
              <img
                src={technician.profileImage?.url || ""}
                alt={technician.name}
                className="technician-thumb"
              />
              <h2>{technician.name}</h2>
            </Link>
            <Link to={`/technician/${technician._id}`} className="view-profile-link">
              View profile →
            </Link>
          </div>
          <div className="technician-section-content">
            <BarberWorkSection technicianId={technician._id} />
          </div>
        </section>
      ))}
    </div>
  );
};

export default Gallery;
