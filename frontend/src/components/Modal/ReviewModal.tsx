import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import Modal from "./Modal";
import "./_reviewModal.scss";

interface ReviewModalInitialData {
  rating: number;
  feedback: string;
  image?: string;
}

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reviewData: {
    rating: number;
    feedback: string;
    image?: File;
  }) => void;
  isSubmitting: boolean;
  initialData?: ReviewModalInitialData;
  isEditing?: boolean;
}

const ReviewModal = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  initialData,
  isEditing,
}: ReviewModalProps) => {
  const [rating, setRating] = useState(initialData?.rating ?? 0);
  const [hover, setHover] = useState(0);
  const [feedback, setFeedback] = useState(initialData?.feedback ?? "");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.image ?? null,
  );

  useEffect(() => {
    if (isOpen) {
      setRating(initialData?.rating ?? 0);
      setFeedback(initialData?.feedback ?? "");
      setImagePreview(initialData?.image ?? null);
      setImage(null);
    }
  }, [isOpen, initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reviewData = {
      rating,
      feedback,
      ...(image && { image }),
    };
    onSubmit(reviewData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Review" : "Write a Review"}
    >
      <form onSubmit={handleSubmit} className="review-form">
        <div className="rating-container">
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
              <label key={index}>
                <input
                  type="radio"
                  name="rating"
                  value={ratingValue}
                  onClick={() => setRating(ratingValue)}
                />
                <FaStar
                  className="star"
                  color={
                    ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"
                  }
                  size={30}
                  onMouseEnter={() => setHover(ratingValue)}
                  onMouseLeave={() => setHover(0)}
                />
              </label>
            );
          })}
        </div>

        <textarea
          placeholder="Share your experience..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          required
        />

        <div className="image-upload">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            id="review-image"
          />
          <label htmlFor="review-image" className="upload-label">
            📷 Add Photo (Optional)
          </label>
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                }}
                className="remove-image"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="submit-review"
          disabled={!rating || !feedback || isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </Modal>
  );
};

export default ReviewModal;
