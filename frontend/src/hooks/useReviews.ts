import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "@/services/review.service";

export const useUserReviews = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["userReviews"],
    queryFn: reviewService.getUserReviews,
  });

  const deleteReview = useMutation({
    mutationFn: reviewService.deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userReviews"] });
    },
  });

  const updateReview = useMutation({
    mutationFn: ({
      reviewId,
      reviewData,
    }: {
      reviewId: string;
      reviewData: {
        rating?: number;
        feedback?: string;
        image?: File;
      };
    }) => reviewService.updateReview(reviewId, reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userReviews"] });
    },
  });

  const createReview = useMutation({
    mutationFn: reviewService.createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userReviews"] });
      queryClient.invalidateQueries({ queryKey: ["userAppointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  return {
    data,
    isLoading,
    deleteReview,
    updateReview,
    createReview,
  };
};

export const usePublicReviews = () => {
  return useQuery({
    queryKey: ["publicReviews"],
    queryFn: async () => {
      // In demo mode, return empty reviews (or could add dummy reviews later)
      const token = localStorage.getItem("token");
      const useDummyData = !token || token.startsWith("mock-token-") || token.startsWith("mock-user-");
      
      if (useDummyData) {
        return [];
      }
      
      return reviewService.getPublicReviews();
    },
  });
};

export const useReviews = useUserReviews;
