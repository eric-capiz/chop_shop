export interface BarberProfile {
  _id: string;
  email: string;
  username: string;
  name: string;
  role: "admin" | "superadmin";
  isActive: boolean;
  lastLogin: Date;
  bio: string;
  specialties: string[];
  yearsOfExperience: number;
  profileImage: {
    url: string;
    publicId: string;
  };
  socialMedia: {
    instagram: string;
    facebook: string;
    twitter: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  name?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  isAdmin: boolean;
}
