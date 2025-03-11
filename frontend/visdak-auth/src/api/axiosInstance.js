import axios from "axios";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

// Debug logging configuration
const DEBUG = process.env.NODE_ENV === "development";
const log = {
  info: (...args) => DEBUG && console.log("🔵", ...args),
  warn: (...args) => DEBUG && console.warn("🟡", ...args),
  error: (...args) => DEBUG && console.error("🔴", ...args),
};

const redirectToLogin = () => {
  if (typeof window === "undefined") return;

  const currentPath = window.location.pathname;
  if (currentPath === "/login") return;

  log.warn("Session expired, redirecting to login");
  window.location.href = "/login";
};

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (!error.response) {
      log.error("Network error:", error.message);
      return Promise.reject(error);
    }

    // Handle unauthorized errors
    if (error.response.status === 401 && typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      if (!currentPath.startsWith("/login")) {
        redirectToLogin();
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
