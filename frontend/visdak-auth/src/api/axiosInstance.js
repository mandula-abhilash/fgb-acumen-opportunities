import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import ms from "ms";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Get time constants from environment using string format
const ACCESS_TOKEN_EXPIRY_STRING =
  process.env.NEXT_PUBLIC_TOKEN_REFRESH_INTERVAL || "15m";
const SESSION_DURATION_STRING =
  process.env.NEXT_PUBLIC_SESSION_DURATION || "7d";

// Convert to milliseconds for calculations
const ACCESS_TOKEN_EXPIRY_MS = ms(ACCESS_TOKEN_EXPIRY_STRING);
const SESSION_DURATION_MS = ms(SESSION_DURATION_STRING);

// Calculate max refresh attempts (session duration / token expiry)
const MAX_REFRESH_ATTEMPTS = Math.floor(
  SESSION_DURATION_MS / ACCESS_TOKEN_EXPIRY_MS
);

console.log(
  "⏱️ Token expiry:",
  ACCESS_TOKEN_EXPIRY_STRING,
  "=",
  ms(ACCESS_TOKEN_EXPIRY_MS, { long: true })
);
console.log(
  "⏱️ Session duration:",
  SESSION_DURATION_STRING,
  "=",
  ms(SESSION_DURATION_MS, { long: true })
);
console.log("🔄 Max refresh attempts:", MAX_REFRESH_ATTEMPTS);

// Global redirection tracking
if (typeof window !== "undefined") {
  if (window.location.pathname === "/login") {
    window.sessionStorage.removeItem("isAuthRedirecting");
  }
}

// Track session information
let sessionInfo = {
  expiresIn: ACCESS_TOKEN_EXPIRY_MS,
  refreshAttemptsLeft: MAX_REFRESH_ATTEMPTS,
  refreshTimer: null,
  isRefreshing: false,
  lastRefreshTime: 0,
};

// Function to check if we're already redirecting to login
const isRedirectingToLogin = () => {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem("isAuthRedirecting") === "true";
};

// Function to safely redirect to login
const redirectToLogin = () => {
  if (typeof window === "undefined") return;

  // Prevent multiple redirects
  if (isRedirectingToLogin()) return;

  // Set redirecting flag
  window.sessionStorage.setItem("isAuthRedirecting", "true");

  // Clear any timers
  if (sessionInfo.refreshTimer) {
    clearInterval(sessionInfo.refreshTimer);
    sessionInfo.refreshTimer = null;
  }

  console.log("🔄 Redirecting to login page");
  window.location.href = "/login";
};

// Function to update session timer
const startSessionTimer = (expiryString) => {
  if (typeof window === "undefined") return;

  // Don't start timer on login page
  if (window.location.pathname === "/login") return;

  // Clear any existing timer
  if (sessionInfo.refreshTimer) {
    clearInterval(sessionInfo.refreshTimer);
    sessionInfo.refreshTimer = null;
  }

  const expiryMs = expiryString ? ms(expiryString) : ACCESS_TOKEN_EXPIRY_MS;

  sessionInfo.expiresIn = expiryMs;
  console.log(
    "🚀 Starting session timer. Expires in:",
    ms(sessionInfo.expiresIn, { long: true })
  );

  // Use less frequent checks - check every 5 seconds instead of every second
  const CHECK_INTERVAL = 5000; // 5 seconds
  const REFRESH_THRESHOLD = 30000; // 30 seconds before expiry

  sessionInfo.refreshTimer = setInterval(() => {
    // Don't proceed if we're on login page
    if (window.location.pathname === "/login") {
      clearInterval(sessionInfo.refreshTimer);
      sessionInfo.refreshTimer = null;
      return;
    }

    sessionInfo.expiresIn -= CHECK_INTERVAL;

    // Throttle refresh attempts
    const now = Date.now();
    const timeSinceLastRefresh = now - sessionInfo.lastRefreshTime;
    const MIN_REFRESH_INTERVAL = 60000; // 1 minute

    // If session is about to expire and we have refresh attempts and not refreshing too frequently
    if (
      sessionInfo.expiresIn <= REFRESH_THRESHOLD &&
      sessionInfo.refreshAttemptsLeft > 0 &&
      !sessionInfo.isRefreshing &&
      !isRedirectingToLogin() &&
      timeSinceLastRefresh >= MIN_REFRESH_INTERVAL
    ) {
      sessionInfo.isRefreshing = true;
      sessionInfo.lastRefreshTime = now;

      console.log("🔄 Token expiring soon, attempting refresh...");

      axiosInstance
        .post("/api/auth/refresh-token")
        .then((response) => {
          const newExpiryString =
            response.headers["x-token-expiry"] || ACCESS_TOKEN_EXPIRY_STRING;
          const newExpiryMs = ms(newExpiryString);

          sessionInfo.expiresIn = newExpiryMs;
          sessionInfo.refreshAttemptsLeft--;
          sessionInfo.isRefreshing = false;

          console.log(
            "✅ Token refreshed successfully. Expires in:",
            newExpiryString,
            "Attempts left:",
            sessionInfo.refreshAttemptsLeft
          );
        })
        .catch((error) => {
          console.log("❌ Token refresh failed:", error.message);
          clearInterval(sessionInfo.refreshTimer);
          sessionInfo.refreshTimer = null;
          sessionInfo.isRefreshing = false;
          redirectToLogin();
        });
    }

    // If session has expired and no refresh attempts left
    if (
      sessionInfo.expiresIn <= 0 &&
      sessionInfo.refreshAttemptsLeft <= 0 &&
      !isRedirectingToLogin()
    ) {
      console.log("⚠️ Session expired and no refresh attempts left");
      clearInterval(sessionInfo.refreshTimer);
      sessionInfo.refreshTimer = null;
      redirectToLogin();
    }
  }, CHECK_INTERVAL);

  // Clean up on page unload
  window.addEventListener("beforeunload", () => {
    console.log("👋 Cleaning up session timer");
    if (sessionInfo.refreshTimer) {
      clearInterval(sessionInfo.refreshTimer);
      sessionInfo.refreshTimer = null;
    }
  });
};

// Function that will be called to refresh authorization
const refreshAuthLogic = async (failedRequest) => {
  // Don't attempt refresh if we're already refreshing or redirecting
  if (sessionInfo.isRefreshing || isRedirectingToLogin()) {
    return Promise.reject("Already refreshing or redirecting");
  }

  // Don't attempt refresh on login page
  if (typeof window !== "undefined" && window.location.pathname === "/login") {
    return Promise.reject("Already on login page");
  }

  // Throttle refresh attempts
  const now = Date.now();
  const timeSinceLastRefresh = now - sessionInfo.lastRefreshTime;
  const MIN_REFRESH_INTERVAL = 60000; // 1 minute

  if (timeSinceLastRefresh < MIN_REFRESH_INTERVAL) {
    console.log("🛑 Refresh attempt too soon after previous refresh");
    return Promise.reject("Refresh attempt too frequent");
  }

  if (sessionInfo.refreshAttemptsLeft <= 0) {
    console.log("❌ No refresh attempts left");
    redirectToLogin();
    return Promise.reject("No refresh attempts left");
  }

  sessionInfo.isRefreshing = true;
  sessionInfo.lastRefreshTime = now;

  try {
    console.log("🔄 Attempting token refresh...");
    const response = await axiosInstance.post("/api/auth/refresh-token");
    const newExpiryString =
      response.headers["x-token-expiry"] || ACCESS_TOKEN_EXPIRY_STRING;

    startSessionTimer(newExpiryString);
    sessionInfo.refreshAttemptsLeft--;
    sessionInfo.isRefreshing = false;

    console.log(
      "✅ Token refresh successful. Expires in:",
      newExpiryString,
      "Attempts left:",
      sessionInfo.refreshAttemptsLeft
    );

    return Promise.resolve();
  } catch (error) {
    console.log("❌ Token refresh failed:", error.message);
    sessionInfo.isRefreshing = false;
    redirectToLogin();
    return Promise.reject(error);
  }
};

// Attach the refresh token logic to the axios instance
createAuthRefreshInterceptor(axiosInstance, refreshAuthLogic, {
  statusCodes: [401],
  pauseInstanceWhileRefreshing: true,
});

// Add a response interceptor for handling token expiry and errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Don't update token on login page
    if (
      typeof window !== "undefined" &&
      window.location.pathname === "/login"
    ) {
      return response;
    }

    const tokenExpiry = response.headers["x-token-expiry"];
    if (tokenExpiry) {
      startSessionTimer(tokenExpiry);
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 404) {
      console.error("Resource not found");
    } else if (error.response?.status === 500) {
      console.error("Server error");
    }
    return Promise.reject(error);
  }
);

// Clear redirection state when on login page
if (typeof window !== "undefined" && window.location.pathname === "/login") {
  // Clear redirection state
  window.sessionStorage.removeItem("isAuthRedirecting");

  // Clear any timers
  if (sessionInfo.refreshTimer) {
    clearInterval(sessionInfo.refreshTimer);
    sessionInfo.refreshTimer = null;
  }
}

// Special login page API for authenticated requests from login
export const loginApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Export session info getter
export const getSessionInfo = () => ({
  expiresIn: sessionInfo.expiresIn,
  refreshAttemptsLeft: sessionInfo.refreshAttemptsLeft,
  expiresInFormatted: ms(sessionInfo.expiresIn, { long: true }),
});

// Export functions for auth management
export const startRefreshTimer = () => {
  // Don't start timer on login page
  if (typeof window !== "undefined" && window.location.pathname === "/login") {
    return;
  }
  startSessionTimer(ACCESS_TOKEN_EXPIRY_STRING);
};

export const stopRefreshTimer = () => {
  if (sessionInfo.refreshTimer) {
    clearInterval(sessionInfo.refreshTimer);
    sessionInfo.refreshTimer = null;
  }
};

// Helper to check session - don't use on login page
export const checkSession = async () => {
  // Don't check if on login page
  if (typeof window !== "undefined" && window.location.pathname === "/login") {
    throw new Error("Already on login page");
  }

  // Don't check if already redirecting
  if (isRedirectingToLogin()) {
    throw new Error("Already redirecting to login");
  }

  try {
    const response = await axiosInstance.get("/api/auth/session");
    const tokenExpiry = response.headers["x-token-expiry"];
    if (tokenExpiry) {
      startSessionTimer(tokenExpiry);
    }
    return response;
  } catch (error) {
    throw error;
  }
};

export default axiosInstance;
