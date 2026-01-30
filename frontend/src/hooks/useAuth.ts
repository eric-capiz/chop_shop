import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { LoginCredentials, RegisterData } from "@types/auth.types";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/user/userStore";
import {
  validateBarberLogin,
  validateUserLogin,
} from "@/data/dummyData";

// Mock login for dummy barbers (admin1–admin5)
const mockBarberLogin = (credentials: LoginCredentials) => {
  const barber = validateBarberLogin(credentials.username, credentials.password);
  if (barber) {
    return {
      token: `mock-token-${barber.id}`,
      isAdmin: true,
      user: {
        _id: barber.id,
        username: barber.username,
        name: barber.name,
        role: "admin" as const,
      },
    };
  }
  return null;
};

// Mock login for dummy user (breezy) – same as 1.0, login to book
const mockUserLogin = (credentials: LoginCredentials) => {
  const user = validateUserLogin(credentials.username, credentials.password);
  if (user) {
    return {
      token: `mock-user-${user.id}`,
      isAdmin: false,
      user: {
        _id: user.id,
        username: user.username,
        name: user.name,
        role: "user" as const,
      },
    };
  }
  return null;
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setIsAuthenticated, setIsAdmin, setAuthToken, setUser } = useAuthStore();
  const { setUser: setUserStoreUser } = useUserStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const barberResult = mockBarberLogin(credentials);
      if (barberResult) return barberResult;

      const userResult = mockUserLogin(credentials);
      if (userResult) return userResult;

      return authService.login(credentials);
    },
    onSuccess: async (data) => {
      // Set the auth token and basic auth state
      setAuthToken(data.token);
      setIsAuthenticated(true);
      setIsAdmin(!!data.isAdmin);

      // Mock barber login
      if (data.token.startsWith("mock-token-")) {
        const userData = data.user;
        if (userData) {
          setUser({
            _id: userData._id,
            username: userData.username,
            name: userData.name,
            role: userData.role,
          } as any);
          setUserStoreUser({
            id: userData._id,
            role: userData.role,
            username: userData.username,
          });
        }
        return;
      }

      // Mock user login (breezy)
      if (data.token.startsWith("mock-user-")) {
        const userData = data.user;
        if (userData) {
          setUser({
            _id: userData._id,
            username: userData.username,
            name: userData.name,
            role: userData.role,
          } as any);
          setUserStoreUser({
            id: userData._id,
            role: userData.role,
            username: userData.username,
          });
        }
        return;
      }

      // Real API login flow
      try {
        const userData = await authService.getCurrentUser();
        setUserStoreUser({
          id: userData._id,
          role: userData.role || (data.isAdmin ? "admin" : "user"),
          username: userData.username,
        });

        queryClient.invalidateQueries({ queryKey: ["user"] });
        queryClient.invalidateQueries({ queryKey: ["appointments"] });
        queryClient.invalidateQueries({ queryKey: ["appointments", "user"] });
        if (data.isAdmin) {
          queryClient.invalidateQueries({
            queryKey: ["appointments", "admin"],
          });
        }

        await queryClient.refetchQueries({ queryKey: ["user"] });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const { setIsAuthenticated, setAuthToken } = useAuthStore();

  return useMutation({
    mutationFn: (userData: RegisterData) => authService.register(userData),
    onSuccess: (data) => {
      setAuthToken(data.token);
      setIsAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();
  const navigate = useNavigate();

  return () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenExpiry");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminExpiry");
    clearAuth();

    queryClient.removeQueries();
    navigate("/");
  };
};
