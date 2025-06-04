import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type AxiosError,
} from "axios";
import type { ApiError } from "../types/api";
import { API_BASE_URL, API_TIMEOUT } from "../constants/api";
import { STORAGE_KEYS } from "../constants/storage";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    const apiError: ApiError = {
      error: "An unexpected error occurred",
      status: error.response?.status,
    };

    if (error.response?.data) {
      const errorData = error.response.data as any;
      apiError.error = errorData.error || errorData.message || apiError.error;
      apiError.message = errorData.message;
    }

    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.location.href = "/login";
    }

    return Promise.reject(apiError);
  }
);

export default apiClient;
