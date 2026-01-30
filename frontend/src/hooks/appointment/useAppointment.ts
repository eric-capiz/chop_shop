import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { appointmentService } from "@/services/appointment/appointmentService";
import { reviewService } from "@/services/review.service";
import {
  CreateAppointmentDTO,
  RescheduleRequest,
  type AppointmentStatus,
} from "@/types/appointment/appointment.types";
import { useUserStore } from "@/store/user/userStore";
import axios from "axios";
import React from "react";

export const useAppointment = () => {
  const queryClient = useQueryClient();
  const { user } = useUserStore();
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  // Re-run initialization if user is null but we have a token
  React.useEffect(() => {
    if (!user && localStorage.getItem("token")) {
      useUserStore.getState().initializeFromStorage();
    }
  }, [user]);

  // Create Appointment Mutation
  const createAppointment = useMutation({
    mutationFn: (appointmentData: CreateAppointmentDTO) =>
      appointmentService.createAppointment(appointmentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointments", "user"] });
      queryClient.invalidateQueries({ queryKey: ["booking-availability"] });
      if (isAdmin) {
        queryClient.invalidateQueries({ queryKey: ["appointments", "admin"] });
      }
    },
  });

  // Update Appointment Status Mutation
  const updateAppointmentStatus = useMutation({
    mutationFn: (params: {
      appointmentId: string;
      status: AppointmentStatus;
      rejectionDetails?: {
        note: string;
        rejectedAt?: string;
      };
    }) => appointmentService.updateAppointmentStatus(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["booking-availability"] });
      if (isAdmin) {
        queryClient.invalidateQueries({ queryKey: ["adminAppointments"] });
      }
    },
  });

  // Check if in demo mode
  const isDemoMode = () => {
    const token = localStorage.getItem("token");
    return (
      !token ||
      token.startsWith("mock-token-") ||
      token.startsWith("mock-user-")
    );
  };

  // Get User Appointments Query
  const getUserAppointments = useQuery({
    queryKey: ["appointments", "user"],
    queryFn: async () => {
      if (isDemoMode()) {
        return []; // Return empty array in demo mode
      }
      return appointmentService.getUserAppointments();
    },
    enabled: !!user,
    staleTime: 30000,
    retry: 2,
    retryDelay: 1000,
    refetchOnMount: "always",
  });

  // Get Admin Appointments Query - Only create if user is admin
  const getAdminAppointments = isAdmin
    ? useQuery({
        queryKey: ["appointments", "admin"],
        queryFn: async () => {
          if (isDemoMode()) {
            return []; // Return empty array in demo mode
          }
          return appointmentService.getAdminAppointments();
        },
        enabled: isAdmin,
        staleTime: 30000,
        retry: (failureCount, error: any) => {
          if (error?.response?.status === 403) return false;
          return failureCount < 2;
        },
        retryDelay: 1000,
        refetchOnMount: "always",
      })
    : null;

  // Reschedule Appointment Mutation
  const rescheduleAppointment = useMutation({
    mutationFn: ({
      appointmentId,
      rescheduleData,
    }: {
      appointmentId: string;
      rescheduleData: RescheduleRequest;
    }) =>
      appointmentService.rescheduleAppointment(appointmentId, rescheduleData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointments", "user"] });
      queryClient.invalidateQueries({ queryKey: ["booking-availability"] });
      if (isAdmin) {
        queryClient.invalidateQueries({ queryKey: ["appointments", "admin"] });
      }
    },
  });

  // Respond to Reschedule Mutation
  const respondToReschedule = useMutation({
    mutationFn: ({
      appointmentId,
      status,
      rejectionDetails,
    }: {
      appointmentId: string;
      status: "confirm" | "reject";
      rejectionDetails?: {
        note: string;
      };
    }) =>
      appointmentService.respondToReschedule(
        appointmentId,
        status,
        rejectionDetails,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointments", "user"] });
      queryClient.invalidateQueries({ queryKey: ["booking-availability"] });
      if (isAdmin) {
        queryClient.invalidateQueries({ queryKey: ["appointments", "admin"] });
      }
    },
  });

  const createReview = useMutation({
    mutationFn: reviewService.createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments", "user"] });
    },
  });

  return {
    // Mutations
    createAppointment,
    updateAppointmentStatus,
    isCreating: createAppointment.isPending,
    isUpdating: updateAppointmentStatus.isPending,
    createError: createAppointment.error,
    updateError: updateAppointmentStatus.error,

    // User Appointments
    userAppointments: getUserAppointments.data,
    isLoadingUserAppointments: getUserAppointments.isPending,
    userAppointmentsError: getUserAppointments.error,

    // Admin Appointments
    adminAppointments: getAdminAppointments?.data ?? null,
    isLoadingAdminAppointments: getAdminAppointments?.isPending ?? false,
    adminAppointmentsError: getAdminAppointments?.error ?? null,

    // Reschedule Appointment
    rescheduleAppointment,
    respondToReschedule,
    createReview,
  };
};
