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
  refresh: (...args) => console.log("🔄", ...args),
  logout: (...args) => console.log("🚪", ...args),
  token: (...args) => console.log("🎟️", ...args),
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const redirectToLogin = () => {
  if (typeof window === "undefined") return;
  const currentPath = window.location.pathname;
  if (currentPath === "/login") return;
  log.logout("Session expired, redirecting to login");
  window.location.href = "/login";
};

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    const tokenExpiry = response.headers["x-token-expiry"];
    if (tokenExpiry) {
      log.token("Token expiry from response:", tokenExpiry);
    }
    return response;
  },
  async (error) => {
    if (!error.response) {
      log.error("Network error:", error.message);
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    // If the error is 401 and it's not a refresh token request
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/refresh-token")
    ) {
      log.token("Access token expired, attempting refresh");

      if (isRefreshing) {
        try {
          await new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          return axiosInstance(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      isRefreshing = true;
      originalRequest._retry = true;

      try {
        log.refresh("Sending refresh token request");
        const response = await axiosInstance.post("/api/auth/refresh-token");

        if (response.data.status === "success") {
          log.refresh("Token refresh successful");
          processQueue(null);
          isRefreshing = false;
          return axiosInstance(originalRequest);
        } else {
          log.refresh("Token refresh failed - invalid response");
          processQueue(new Error("Invalid refresh response"));
          isRefreshing = false;
          redirectToLogin();
          return Promise.reject(error);
        }
      } catch (refreshError) {
        log.refresh("Token refresh failed:", refreshError.message);
        processQueue(refreshError);
        isRefreshing = false;

        if (refreshError.response?.status === 401) {
          log.logout("Refresh token expired");
          redirectToLogin();
        }
        return Promise.reject(refreshError);
      }
    }

    // If it's a refresh token request that failed
    if (
      error.response.status === 401 &&
      originalRequest.url.includes("/refresh-token")
    ) {
      log.logout("Refresh token expired or invalid");
      redirectToLogin();
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
