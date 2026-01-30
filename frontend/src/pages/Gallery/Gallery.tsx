import { Link } from "react-router-dom";
import { useBarbersList } from "@/hooks/useBarbers";
import { useBarberGallery, useBarberReviews } from "@/hooks/useBarbers";
import { format } from "date-fns";
import { FaStar } from "react-icons/fa";
import "./_gallery.scss";

const BarberWorkSection = ({ barberId }: { barberId: string }) => {
  const { data: topGallery = [] } = useBarberGallery(barberId);
  const { data: topReviews = [] } = useBarberReviews(barberId);
  const gallerySlice = topGallery.slice(0, 3);
  const reviewsSlice = topReviews.slice(0, 3);

  return (
    <>
      <div className="barber-gallery">
        <h3>Top cuts</h3>
        <div className="gallery-grid">
          {gallerySlice.map((item) => (
            <div key={item._id} className="gallery-item">
              <img src={item.image?.url || ""} alt={item.description || ""} />
              <div className="gallery-item-overlay">
                <p>{item.description || ""}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="barber-reviews">
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
  const { data: barbers, isLoading, error } = useBarbersList();

  if (isLoading) return <div className="gallery-page our-work-page">Loading...</div>;
  if (error) return <div className="gallery-page our-work-page">Failed to load.</div>;
  if (!barbers?.length) return <div className="gallery-page our-work-page">No barbers yet.</div>;

  return (
    <div className="gallery-page our-work-page">
      <h1>Our Work</h1>

      {barbers.map((barber) => (
        <section key={barber._id} className="barber-work-section">
          <div className="barber-section-header">
            <Link to={`/barber/${barber._id}`} className="barber-link">
              <img
                src={barber.profileImage?.url || ""}
                alt={barber.name}
                className="barber-thumb"
              />
              <h2>{barber.name}</h2>
            </Link>
            <Link to={`/barber/${barber._id}`} className="view-profile-link">
              View profile →
            </Link>
          </div>
          <div className="barber-section-content">
            <BarberWorkSection barberId={barber._id} />
          </div>
        </section>
      ))}
    </div>
  );
};

export default Gallery;
