import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { LoginCredentials, RegisterData } from "@types/auth.types";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/user/userStore";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const { setIsAuthenticated, setIsAdmin, setAuthToken, setUser } =
    useAuthStore();
  const { setUser: setUserStoreUser } = useUserStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const data = await authService.login(credentials);
      if (!data?.token) throw new Error("Invalid credentials");
      return data;
    },
    onSuccess: async (data) => {
      setAuthToken(data.token);
      setIsAuthenticated(true);
      setIsAdmin(!!data.isAdmin);

      const roleFromLogin =
        data.role === "superadmin"
          ? "superadmin"
          : data.isSuperAdmin === true
            ? "superadmin"
            : data.isAdmin
              ? "admin"
              : "user";
      if (data.role === "superadmin" || data.isSuperAdmin === true) {
        localStorage.setItem("isSuperAdmin", "true");
      } else if (data.isSuperAdmin === false) {
        localStorage.setItem("isSuperAdmin", "false");
      }
      setUser({
        _id: undefined,
        username: undefined,
        name: undefined,
        email: undefined,
        role: roleFromLogin,
      } as any);
      setUserStoreUser({
        id: undefined,
        role: roleFromLogin,
        username: undefined,
      });

      try {
        const userData = await authService.getCurrentUser();
        const role = userData.role || roleFromLogin;
        if (userData.role) {
          localStorage.setItem(
            "isSuperAdmin",
            String(userData.role === "superadmin"),
          );
        }
        setUser({
          _id: userData._id,
          username: userData.username,
          name: userData.name,
          email: userData.email,
          role,
        } as any);
        setUserStoreUser({
          id: userData._id,
          role,
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
    localStorage.removeItem("isSuperAdmin");
    clearAuth();
    queryClient.removeQueries();
    navigate("/");
  };
};
