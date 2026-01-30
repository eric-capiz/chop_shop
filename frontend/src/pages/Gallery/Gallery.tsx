import { Link } from "react-router-dom";
import {
  barbers,
  getTopGalleryForBarber,
  getReviewsForBarber,
} from "@/data/dummyData";
import { format } from "date-fns";
import { FaStar } from "react-icons/fa";
import "./_gallery.scss";

const Gallery = () => {
  return (
    <div className="gallery-page our-work-page">
      <h1>Our Work</h1>

      {barbers.map((barber) => {
        const topGallery = getTopGalleryForBarber(barber.id, 3);
        const topReviews = getReviewsForBarber(barber.id, 3);

        return (
          <section key={barber.id} className="barber-work-section">
            <div className="barber-section-header">
              <Link to={`/barber/${barber.id}`} className="barber-link">
                <img
                  src={barber.profileImage}
                  alt={barber.name}
                  className="barber-thumb"
                />
                <h2>{barber.name}</h2>
              </Link>
              <Link to={`/barber/${barber.id}`} className="view-profile-link">
                View profile →
              </Link>
            </div>

            <div className="barber-section-content">
              <div className="barber-gallery">
                <h3>Top cuts</h3>
                <div className="gallery-grid">
                  {topGallery.map((item) => (
                    <div key={item._id} className="gallery-item">
                      <img src={item.image.url} alt={item.description} />
                      <div className="gallery-item-overlay">
                        <p>{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="barber-reviews">
                <h3>Top reviews</h3>
                {topReviews.length > 0 ? (
                  <div className="reviews-grid">
                    {topReviews.map((review) => (
                      <div key={review._id} className="review-card">
                        <div className="review-header">
                          <h4>{review.userId.name}</h4>
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
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default Gallery;
