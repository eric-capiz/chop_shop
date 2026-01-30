import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";
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
