import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: "/api/v1",
  headers: { Accept: "application/json" },
});

// Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global error toasts
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't toast on 401 (let the auth flow handle it)
    if (error.response?.status !== 401) {
      const msg = error.response?.data?.message || "Something went wrong";
      toast.error(msg);
    }
    return Promise.reject(error);
  },
);

export default api;
