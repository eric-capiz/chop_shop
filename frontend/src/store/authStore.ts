import { create } from "zustand";
import { User, BarberProfile } from "@/types/auth.types";
import { authService } from "@/services/auth.service";
import { useUserStore } from "@/store/user/userStore";

interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | BarberProfile | null;
  currentBarberId: string | null;
  setIsAuthenticated: (value: boolean) => void;
  setIsAdmin: (value: boolean) => void;
  setUser: (user: User | BarberProfile | null) => void;
  setCurrentBarberId: (id: string | null) => void;
  initializeAuth: () => Promise<void>;
  setAuthToken: (token: string) => void;
  clearAuth: () => void;
}

const TOKEN_EXPIRY = 60 * 60 * 1000;

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  isAdmin: false,
  user: null,
  currentBarberId: null,
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setIsAdmin: (value) => {
    set({ isAdmin: value });
    if (value) {
      localStorage.setItem("isAdmin", String(value));
      localStorage.setItem("adminExpiry", String(Date.now() + TOKEN_EXPIRY));
    } else {
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("adminExpiry");
    }
  },
  setUser: (user) => set({ user }),
  setCurrentBarberId: (id) => {
    set({ currentBarberId: id });
    if (id) {
      localStorage.setItem("currentBarberId", id);
    } else {
      localStorage.removeItem("currentBarberId");
    }
  },
  clearAuth: () => {
    localStorage.removeItem("currentBarberId");
    localStorage.removeItem("isSuperAdmin");
    set({
      isAuthenticated: false,
      isAdmin: false,
      user: null,
      currentBarberId: null,
    });
  },
  setAuthToken: (token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("tokenExpiry", String(Date.now() + TOKEN_EXPIRY));
  },
  initializeAuth: async () => {
    const token = localStorage.getItem("token");
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    const adminExpiry = localStorage.getItem("adminExpiry");
    const storedBarberId = localStorage.getItem("currentBarberId");

    if (token && tokenExpiry && Number(tokenExpiry) < Date.now()) {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("adminExpiry");
      localStorage.removeItem("isSuperAdmin");
      localStorage.removeItem("currentBarberId");
      set({
        isAuthenticated: false,
        isAdmin: false,
        user: null,
        currentBarberId: null,
      });
      useUserStore.getState().clearUser();
      return;
    }

    if (adminExpiry && Number(adminExpiry) < Date.now()) {
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("adminExpiry");
      set({ isAdmin: false });
    }

    if (token) {
      try {
        const user = await authService.getCurrentUser();
        const isSuperAdmin = user.role === "superadmin";
        if (user.role) {
          localStorage.setItem("isSuperAdmin", String(isSuperAdmin));
        }
        set({
          user,
          isAuthenticated: true,
          isAdmin: user.role === "admin" || user.role === "superadmin",
          currentBarberId: storedBarberId,
        });
        useUserStore.getState().setUser({
          id: user._id,
          role: user.role,
          username: user.username,
        });
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiry");
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("adminExpiry");
        localStorage.removeItem("isSuperAdmin");
        localStorage.removeItem("currentBarberId");
        set({
          isAuthenticated: false,
          isAdmin: false,
          user: null,
          currentBarberId: null,
        });
        useUserStore.getState().clearUser();
      }
    }
  },
}));
