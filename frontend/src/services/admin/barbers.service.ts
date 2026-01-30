import axios from "axios";

export interface AdminBarber {
  _id: string;
  username: string;
  name: string;
  email: string;
  role: "admin" | "superadmin";
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBarberPayload {
  username: string;
  password: string;
  name: string;
  email: string;
}

export const barbersService = {
  getAll: async (): Promise<AdminBarber[]> => {
    const { data } = await axios.get<AdminBarber[]>("/api/admin/barbers");
    return data;
  },

  create: async (payload: CreateBarberPayload): Promise<AdminBarber> => {
    const { data } = await axios.post<AdminBarber>(
      "/api/admin/barbers",
      payload
    );
    return data;
  },

  transferSuperAdmin: async (barberId: string): Promise<{ message: string }> => {
    const { data } = await axios.put<{ message: string }>(
      `/api/admin/barbers/${barberId}/super-admin`
    );
    return data;
  },

  delete: async (barberId: string): Promise<{ message: string }> => {
    const { data } = await axios.delete<{ message: string }>(
      `/api/admin/barbers/${barberId}`
    );
    return data;
  },
};
