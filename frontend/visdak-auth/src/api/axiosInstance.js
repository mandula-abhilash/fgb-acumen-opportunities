import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Function to refresh auth tokens
const refreshAuthLogic = async (failedRequest) => {
  try {
    const response = await api.post("/api/auth/refresh-token");
    return Promise.resolve();
  } catch (error) {
    // If refresh fails, redirect to login
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
};

// Create refresh token interceptor
createAuthRefreshInterceptor(api, refreshAuthLogic, {
  statusCodes: [401], // Refresh token on 401 responses
  pauseInstanceWhileRefreshing: true, // Pause other requests while refreshing
});

// Set up a timer to refresh token every 15 minutes
if (typeof window !== "undefined") {
  const REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes
  const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

  let sessionStartTime = Date.now();

  // Set up periodic token refresh
  const refreshInterval = setInterval(async () => {
    try {
      // Check if session has exceeded 7 days
      if (Date.now() - sessionStartTime >= SESSION_DURATION) {
        clearInterval(refreshInterval);
        // Logout user
        await api.post("/api/auth/logout");
        window.location.href = "/login";
        return;
      }

      // Refresh token
      await api.post("/api/auth/refresh-token");
    } catch (error) {
      console.error("Token refresh failed:", error);
      clearInterval(refreshInterval);
      window.location.href = "/login";
    }
  }, REFRESH_INTERVAL);

  // Clean up interval on page unload
  window.addEventListener("beforeunload", () => {
    clearInterval(refreshInterval);
  });
}

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Exclude certain endpoints from interceptor logic
    const excludedUrls = [
      "/api/auth/refresh-token",
      "/api/auth/session",
      "/api/auth/login",
    ];

    if (
      !error.config?.url ||
      excludedUrls.some((url) => error.config.url.includes(url))
    ) {
      return Promise.reject(error);
    }

    // Let axios-auth-refresh handle 401 errors
    if (error.response?.status === 401) {
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
