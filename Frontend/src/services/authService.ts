import apiClient from "./api";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
} from "../types/auth";
import { API_ENDPOINTS } from "../constants/api";
import { STORAGE_KEYS } from "../constants/storage";

class AuthService {
  // Register a new user
  async register(
    userData: RegisterData
  ): Promise<{ message: string; email: string }> {
    const response = await apiClient.post(
      API_ENDPOINTS.AUTH.REGISTER,
      userData
    );
    return response.data;
  }

  // Verify email with code
  async verifyEmail(verificationData: {
    email: string;
    code: string;
  }): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.VERIFY_EMAIL,
      verificationData
    );

    // Store auth data after successful verification
    if (response.data.token) {
      this.setAuthData(response.data);
    }

    return response.data;
  }

  // Resend verification code
  async resendVerificationCode(email: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      API_ENDPOINTS.AUTH.RESEND_CODE,
      { email }
    );
    return response.data;
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    // Store auth data after successful login
    if (response.data.token) {
      this.setAuthData(response.data);
    }

    return response.data;
  }

  // Logout user
  logout(): void {
    this.clearAuthData();
    window.location.href = "/login";
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  // Get stored user data
  getUser(): User | null {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  }

  // Private helper methods
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

// Export singleton instance
export const authService = new AuthService();
export default authService;
