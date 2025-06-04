// API configuration constants
export const API_BASE_URL = "http://localhost:8080/api";
export const API_TIMEOUT = 10000;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    VERIFY_EMAIL: "/auth/verify-email",
    ONBOARDING: "/auth/onboarding",
    RESEND_CODE: "/auth/resend-verification",
    ME: "/auth/me",
  },
} as const;
