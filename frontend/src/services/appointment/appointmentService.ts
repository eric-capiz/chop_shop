import axios from "axios";
import {
  type Appointment,
  type CreateAppointmentDTO,
  type AppointmentResponse,
  type RescheduleRequest,
  type AppointmentStatus,
} from "@/types/appointment/appointment.types";

// Uses axios default baseURL (e.g. from config/axios or Vite proxy)
const APPOINTMENT_BASE = "/api/appointments";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

interface UpdateStatusParams {
  appointmentId: string;
  status: AppointmentStatus;
  rejectionDetails?: {
    note: string;
    rejectedAt?: string;
  };
}

export const appointmentService = {
  // Create new appointment
  createAppointment: async (
    appointmentData: CreateAppointmentDTO
  ): Promise<AppointmentResponse> => {
    try {
      const { data } = await axios.post<AppointmentResponse>(
        `${APPOINTMENT_BASE}/book`,
        appointmentData,
        {
          headers: {
            ...getAuthHeader(),
            "Content-Type": "application/json",
          },
        }
      );
      return data;
    } catch (error) {
      console.error("Booking error details:", {
        message: error.response?.data?.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },

  // Get user's appointments
  getUserAppointments: async (): Promise<Appointment[]> => {
    try {
      const { data } = await axios.get<Appointment[]>(
        `${APPOINTMENT_BASE}/user`,
        {
          headers: {
            ...getAuthHeader(),
          },
        }
      );
      return data;
    } catch (error) {
      console.error("Error fetching user appointments:", error);
      throw error;
    }
  },

  // Get barber's appointments (logged-in barber)
  getAdminAppointments: async (): Promise<Appointment[]> => {
    try {
      const { data } = await axios.get<Appointment[]>(
        `${APPOINTMENT_BASE}/barber`,
        {
          headers: {
            ...getAuthHeader(),
          },
        }
      );
      return data;
    } catch (error) {
      // Only log errors that aren't 403
      if (error?.response?.status !== 403) {
        console.error("Error fetching admin appointments:", error);
      }
      throw error;
    }
  },

  // Update appointment status
  updateAppointmentStatus: async ({
    appointmentId,
    status,
    rejectionDetails,
  }: UpdateStatusParams): Promise<Appointment> => {
    try {
      const headers = getAuthHeader();

      const requestBody = {
        status,
        ...(rejectionDetails && { rejectionDetails }),
      };

      const { data } = await axios.put<Appointment>(
        `${APPOINTMENT_BASE}/${appointmentId}/status`,
        requestBody,
        {
          headers: {
            ...headers,
            "Content-Type": "application/json",
          },
        }
      );
      return data;
    } catch (error) {
      console.error("Status update error details:", {
        message: error.response?.data?.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      throw error;
    }
  },

  rescheduleAppointment: async (
    appointmentId: string,
    rescheduleData: RescheduleRequest
  ): Promise<Appointment> => {
    try {
      const { data } = await axios.put<Appointment>(
        `${APPOINTMENT_BASE}/${appointmentId}/reschedule`,
        rescheduleData,
        {
          headers: {
            ...getAuthHeader(),
            "Content-Type": "application/json",
          },
        }
      );
      return data;
    } catch (error) {
      console.error("Reschedule error details:", error);
      throw error;
    }
  },

  respondToReschedule: async (
    appointmentId: string,
    status: "confirm" | "reject",
    rejectionDetails?: {
      note: string;
    }
  ): Promise<Appointment> => {
    try {
      const { data } = await axios.put<Appointment>(
        `${APPOINTMENT_BASE}/${appointmentId}/reschedule-response`,
        {
          status,
          rejectionDetails,
        },
        {
          headers: {
            ...getAuthHeader(),
            "Content-Type": "application/json",
          },
        }
      );
      return data;
    } catch (error) {
      console.error("Reschedule response error:", error);
      throw error;
    }
  },
};
