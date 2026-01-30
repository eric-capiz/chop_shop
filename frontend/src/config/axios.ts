import axios from "axios";

// Point to local backend; override with VITE_API_URL in .env (e.g. http://localhost:5000)
axios.defaults.baseURL =
  import.meta.env.VITE_API_URL ?? "http://localhost:5000";
// Add default headers
axios.defaults.headers.common["Content-Type"] = "application/json";

// Add request interceptor to include auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
