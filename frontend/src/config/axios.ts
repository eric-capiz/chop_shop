import axios from "axios";

// Development - using localhost for 2.0 development
// axios.defaults.baseURL = "https://barbershop-new.fly.dev"; // Original 1.0 API - DO NOT USE
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
  }
);
