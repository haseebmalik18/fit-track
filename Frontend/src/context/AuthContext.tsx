import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";
import type {
  User,
  AuthResponse,
  LoginCredentials,
  RegisterData,
} from "../types/auth";
import authService from "../services/authService";

interface OnboardingData {
  goal: string;
  activityLevel: string;
  currentWeight: number;
  targetWeight?: number;
  height: number;
  age: number;
  gender: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  isTransitioning: boolean;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (
    userData: RegisterData
  ) => Promise<{ message: string; email: string }>;
  verifyEmail: (email: string, code: string) => Promise<AuthResponse>;
  completeOnboarding: (data: OnboardingData) => Promise<AuthResponse>;
  resendVerificationCode: (email: string) => Promise<void>;
  logout: () => void;
}

type AuthAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_TRANSITIONING"; payload: boolean }
  | { type: "SET_AUTHENTICATED"; payload: User }
  | { type: "SET_UNAUTHENTICATED" };

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  isTransitioning: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_TRANSITIONING":
      return { ...state, isTransitioning: action.payload };

    case "SET_AUTHENTICATED":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
        isTransitioning: false,
      };

    case "SET_UNAUTHENTICATED":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        isTransitioning: false,
      };

    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const user = authService.getUser();

        if (user && authService.isAuthenticated()) {
          dispatch({ type: "SET_AUTHENTICATED", payload: user });
        } else {
          dispatch({ type: "SET_UNAUTHENTICATED" });
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        dispatch({ type: "SET_UNAUTHENTICATED" });
      }
    };

    initializeAuth();
  }, []);

  const login = async (
    credentials: LoginCredentials
  ): Promise<AuthResponse> => {
    dispatch({ type: "SET_TRANSITIONING", payload: true });

    try {
      const response = await authService.login(credentials);
      const user = authService.getUser();

      if (user) {
        dispatch({ type: "SET_AUTHENTICATED", payload: user });
      }

      return response;
    } catch (error) {
      dispatch({ type: "SET_UNAUTHENTICATED" });
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await authService.register(userData);
      dispatch({ type: "SET_LOADING", payload: false });
      return response;
    } catch (error) {
      dispatch({ type: "SET_LOADING", payload: false });
      throw error;
    }
  };

  const verifyEmail = async (
    email: string,
    code: string
  ): Promise<AuthResponse> => {
    dispatch({ type: "SET_TRANSITIONING", payload: true });

    try {
      const response = await authService.verifyEmail({ email, code });
      const user = authService.getUser();

      if (user) {
        setTimeout(() => {
          dispatch({ type: "SET_AUTHENTICATED", payload: user });
        }, 100);
      }

      return response;
    } catch (error) {
      dispatch({ type: "SET_TRANSITIONING", payload: false });
      throw error;
    }
  };

  const completeOnboarding = async (
    data: OnboardingData
  ): Promise<AuthResponse> => {
    dispatch({ type: "SET_TRANSITIONING", payload: true });

    try {
      const response = await authService.completeOnboarding(data);
      const user = authService.getUser();

      if (user) {
        dispatch({ type: "SET_AUTHENTICATED", payload: user });
      }

      return response;
    } catch (error) {
      dispatch({ type: "SET_TRANSITIONING", payload: false });
      throw error;
    }
  };

  const resendVerificationCode = async (email: string): Promise<void> => {
    await authService.resendVerificationCode(email);
  };

  const logout = (): void => {
    authService.logout();
    dispatch({ type: "SET_UNAUTHENTICATED" });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    verifyEmail,
    completeOnboarding,
    resendVerificationCode,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
