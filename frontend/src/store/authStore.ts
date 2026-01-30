import { create } from "zustand";
import { User, BarberProfile } from "@/types/auth.types";
import { authService } from "@/services/auth.service";
import { useUserStore } from "@/store/user/userStore";
import { getBarberById, dummyUser } from "@/data/dummyData";

interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | BarberProfile | null;
  currentBarberId: string | null; // For tracking which dummy barber is logged in
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

    if (token.startsWith("mock-token-")) {
      const barberId = token.replace("mock-token-", "");
      set({ currentBarberId: barberId });
      localStorage.setItem("currentBarberId", barberId);
    } else if (token.startsWith("mock-user-")) {
      localStorage.removeItem("currentBarberId");
      set({ currentBarberId: null });
    }
  },
  initializeAuth: async () => {
    const token = localStorage.getItem("token");
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    const adminExpiry = localStorage.getItem("adminExpiry");
    const storedBarberId = localStorage.getItem("currentBarberId");

    // Check if token has expired
    if (token && tokenExpiry && Number(tokenExpiry) < Date.now()) {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiry");
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("adminExpiry");
      localStorage.removeItem("currentBarberId");
      set({ isAuthenticated: false, isAdmin: false, user: null, currentBarberId: null });
      useUserStore.getState().clearUser();
      return;
    }

    // Check if admin status has expired
    if (adminExpiry && Number(adminExpiry) < Date.now()) {
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("adminExpiry");
      set({ isAdmin: false });
    }

    if (token) {
      // Mock barber token
      if (token.startsWith("mock-token-")) {
        const barberId = token.replace("mock-token-", "");
        const barber = getBarberById(barberId);

        if (barber) {
          set({
            user: {
              _id: barber.id,
              username: barber.username,
              name: barber.name,
              role: "admin",
            } as any,
            isAuthenticated: true,
            isAdmin: true,
            currentBarberId: barberId,
          });
          useUserStore.getState().setUser({
            id: barber.id,
            role: "admin",
            username: barber.username,
          });
          return;
        }
      }

      // Mock user token (breezy)
      if (token.startsWith("mock-user-")) {
        set({
          user: {
            _id: dummyUser.id,
            username: dummyUser.username,
            name: dummyUser.name,
            role: "user",
          } as any,
          isAuthenticated: true,
          isAdmin: false,
          currentBarberId: null,
        });
        useUserStore.getState().setUser({
          id: dummyUser.id,
          role: "user",
          username: dummyUser.username,
        });
        return;
      }

      // Real API token
      try {
        const user = await authService.getCurrentUser();
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
