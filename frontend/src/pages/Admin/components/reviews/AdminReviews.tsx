import { useState } from "react";
import { format } from "date-fns";
import { FaStar, FaTrash } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useProfile } from "@hooks/admin/useProfile";
import { barbersService } from "@/services/barbers.service";
import { reviewService } from "@/services/review.service";
import type { PublicReview } from "@/types/barber.types";
import Toast from "@/components/common/Toast";
import "./_adminReviews.scss";

const AdminReviews = () => {
  const queryClient = useQueryClient();
  const { data: profile } = useProfile();
  const barberId = profile?._id;

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["barberReviews", barberId],
    queryFn: () => barbersService.getReviews(barberId!),
    enabled: !!barberId,
  });

  const deleteReview = useMutation({
    mutationFn: (reviewId: string) => reviewService.deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["barberReviews", barberId] });
    },
  });

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleDelete = async (review: PublicReview) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await deleteReview.mutateAsync(review._id);
      setToast({ message: "Review deleted successfully", type: "success" });
    } catch {
      setToast({ message: "Failed to delete review", type: "error" });
    }
  };

  if (isLoading) return <div className="admin-reviews__loading">Loading reviews...</div>;
  if (!profile) return <div className="admin-reviews__loading">No profile found.</div>;

  return (
    <div className="admin-reviews">
      <div className="admin-reviews__header">
        <h2>My Reviews</h2>
        <p className="admin-reviews__subtitle">
          Reviews left by clients. You can delete inappropriate reviews.
        </p>
      </div>

      {!reviews?.length ? (
        <div className="admin-reviews__empty">
          <p>No reviews yet.</p>
        </div>
      ) : (
        <div className="admin-reviews__grid">
          {reviews.map((review) => (
            <div key={review._id} className="admin-reviews__card">
              <div className="admin-reviews__card-header">
                <span className="reviewer-name">
                  {review.userId?.name ?? "Anonymous"}
                </span>
                <span className="review-date">
                  {format(new Date(review.createdAt), "MMM d, yyyy")}
                </span>
              </div>
              <div className="admin-reviews__rating">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < review.rating ? "star filled" : "star"}
                  />
                ))}
              </div>
              <p className="admin-reviews__feedback">{review.feedback}</p>
              {review.image?.url && (
                <div className="admin-reviews__image">
                  <img src={review.image.url} alt="Review" />
                </div>
              )}
              <button
                type="button"
                className="admin-reviews__delete"
                onClick={() => handleDelete(review)}
                disabled={deleteReview.isPending}
              >
                <FaTrash /> Delete
              </button>
            </div>
          ))}
        </div>
      )}

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

export default AdminReviews;
