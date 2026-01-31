import { useState } from "react";
import { format } from "date-fns";
import { FaEdit, FaTrash, FaStar } from "react-icons/fa";
import { useUserReviews } from "@/hooks/useReviews";
import type { Review } from "@/types/review.types";
import Toast from "@/components/common/Toast";
import ReviewModal from "@/components/Modal/ReviewModal";
import "./_userReviews.scss";

const UserReviews = () => {
  const {
    data: reviews,
    isLoading,
    deleteReview,
    updateReview,
  } = useUserReviews();
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleDelete = async (reviewId: string) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview.mutateAsync(reviewId);
        setToast({
          message: "Review deleted successfully",
          type: "success",
        });
      } catch (error) {
        setToast({
          message: "Failed to delete review",
          type: "error",
        });
      }
    }
  };

  const handleEdit = (review: Review) => {
    setSelectedReview(review);
    setIsEditModalOpen(true);
  };

  const handleUpdateReview = async (reviewData: {
    rating: number;
    feedback: string;
    image?: File;
  }) => {
    if (!selectedReview) return;

    try {
      await updateReview.mutateAsync({
        reviewId: selectedReview._id,
        reviewData,
      });

      setToast({
        message: "Review updated successfully",
        type: "success",
      });
      setIsEditModalOpen(false);
      setSelectedReview(null);
    } catch (error) {
      setToast({
        message: "Failed to update review",
        type: "error",
      });
    }
  };

  if (isLoading) {
    return <div className="loading">Loading reviews...</div>;
  }

  if (!reviews?.length) {
    return (
      <div className="no-reviews">
        <h3>No Reviews Yet</h3>
        <p>
          Your reviews will appear here once you've reviewed your appointments.
        </p>
      </div>
    );
  }

  return (
    <div className="user-reviews">
      <div className="user-reviews__header">
        <h2>My Reviews</h2>
      </div>

      <div className="reviews-grid">
        {reviews.map((review) => (
          <div key={review._id} className="review-card">
            <div className="review-header">
              <div className="service-info">
                <h3>
                  {typeof review.appointmentId === "object" &&
                  review.appointmentId?.serviceId?.name
                    ? review.appointmentId.serviceId.name
                    : "Service"}
                </h3>
                {typeof review.adminId === "object" && review.adminId?.name ? (
                  <span className="barber-name">
                    Barber: {review.adminId.name}
                  </span>
                ) : null}
                <span className="date">
                  {format(new Date(review.createdAt), "MMMM d, yyyy")}
                </span>
              </div>
              <div className="rating">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    className={index < review.rating ? "star filled" : "star"}
                  />
                ))}
              </div>
            </div>

            <p className="feedback">{review.feedback}</p>

            {review.image?.url && (
              <div className="review-image">
                <img src={review.image.url} alt="Review" />
              </div>
            )}

            <div className="review-actions">
              <button
                className="btn-edit"
                onClick={() => handleEdit(review)}
                disabled={updateReview.isPending}
              >
                <FaEdit /> Edit
              </button>
              <button
                className="btn-delete"
                onClick={() => handleDelete(review._id)}
                disabled={deleteReview.isPending}
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <ReviewModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedReview(null);
        }}
        onSubmit={handleUpdateReview}
        isSubmitting={updateReview.isPending}
        initialData={
          selectedReview
            ? {
                rating: selectedReview.rating,
                feedback: selectedReview.feedback,
                image: selectedReview.image?.url,
              }
            : undefined
        }
        isEditing={true}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default UserReviews;
