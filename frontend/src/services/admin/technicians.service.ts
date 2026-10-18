import axios from "axios";

export interface AdminTechnician {
  _id: string;
  username: string;
  name: string;
  email: string;
  role: "admin" | "superadmin";
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTechnicianPayload {
  username: string;
  password: string;
  name: string;
  email: string;
}

export const techniciansService = {
  getAll: async (): Promise<AdminTechnician[]> => {
    const { data } = await axios.get<AdminTechnician[]>("/api/admin/technicians");
    return data;
  },

  create: async (payload: CreateTechnicianPayload): Promise<AdminTechnician> => {
    const { data } = await axios.post<AdminTechnician>(
      "/api/admin/technicians",
      payload
    );
    return data;
  },

  transferSuperAdmin: async (technicianId: string): Promise<{ message: string }> => {
    const { data } = await axios.put<{ message: string }>(
      `/api/admin/technicians/${technicianId}/super-admin`
    );
    return data;
  },

  delete: async (technicianId: string): Promise<{ message: string }> => {
    const { data } = await axios.delete<{ message: string }>(
      `/api/admin/technicians/${technicianId}`
    );
    return data;
  },
};
