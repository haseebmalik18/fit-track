import apiClient from "./api";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
} from "../types/auth";
import { API_ENDPOINTS } from "../constants/api";
import { STORAGE_KEYS } from "../constants/storage";

interface OnboardingData {
  goal: string;
  activityLevel: string;
  currentWeight: number;
  targetWeight?: number;
  height: number;
  age: number;
  gender: string;
}

class AuthService {
  async register(
    userData: RegisterData
  ): Promise<{ message: string; email: string }> {
    const response = await apiClient.post(
      API_ENDPOINTS.AUTH.REGISTER,
      userData
    );
    return response.data;
  }

  async verifyEmail(verificationData: {
    email: string;
    code: string;
  }): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.VERIFY_EMAIL,
      verificationData
    );

    if (response.data.token) {
      this.setAuthData(response.data);
    }

    return response.data;
  }

  async completeOnboarding(data: OnboardingData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.ONBOARDING,
      data
    );

    if (response.data.token) {
      this.setAuthData(response.data);
    }

    return response.data;
  }

  async resendVerificationCode(email: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      API_ENDPOINTS.AUTH.RESEND_CODE,
      { email }
    );
    return response.data;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    if (response.data.token) {
      this.setAuthData(response.data);
    }

    return response.data;
  }

  logout(): void {
    this.clearAuthData();
    window.location.href = "/login";
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  getUser(): User | null {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  }

  private setAuthData(authResponse: AuthResponse): void {
    localStorage.setItem(STORAGE_KEYS.TOKEN, authResponse.token);

    const user: User = {
      id: authResponse.id,
      email: authResponse.email,
      firstName: authResponse.firstName,
      lastName: authResponse.lastName,
      emailVerified: authResponse.emailVerified,
      profileCompleted: authResponse.profileCompleted,
    };

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  private clearAuthData(): void {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }
}

export const authService = new AuthService();
export default authService;
