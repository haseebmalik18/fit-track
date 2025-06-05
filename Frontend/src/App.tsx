import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import OnboardingPage from "./pages/OnboardingPage";
import Dashboard from "./pages/Dashboard";

const RouteLoading: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

const useRouteGuard = () => {
  const { isAuthenticated, loading, user, isTransitioning } = useAuth();

  const shouldShowLoading = loading || isTransitioning;

  const getRedirectPath = () => {
    if (!isAuthenticated) return "/login";
    if (!user?.emailVerified) return "/verify-email";
    if (!user?.profileCompleted) return "/onboarding";
    return "/dashboard";
  };

  return {
    isAuthenticated,
    loading: shouldShowLoading,
    user,
    getRedirectPath,
  };
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, loading, user } = useRouteGuard();

  if (loading) return <RouteLoading />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user?.emailVerified) return <Navigate to="/verify-email" replace />;
  if (!user?.profileCompleted) return <Navigate to="/onboarding" replace />;

  return <>{children}</>;
};

const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getRedirectPath, loading } = useRouteGuard();

  if (loading) return <RouteLoading />;

  const redirectPath = getRedirectPath();
  if (redirectPath !== "/login") {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

const OnboardingRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, loading, user } = useRouteGuard();

  if (loading) return <RouteLoading />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user?.emailVerified) return <Navigate to="/verify-email" replace />;
  if (user?.profileCompleted) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

const VerificationRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, loading, user } = useRouteGuard();

  if (loading) return <RouteLoading />;

  if (isAuthenticated && user?.emailVerified) {
    if (!user.profileCompleted) return <Navigate to="/onboarding" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <AuthRoute>
              <LoginPage />
            </AuthRoute>
          }
        />
        <Route
          path="/register"
          element={
            <AuthRoute>
              <RegisterPage />
            </AuthRoute>
          }
        />

        <Route
          path="/verify-email"
          element={
            <VerificationRoute>
              <VerifyEmailPage />
            </VerificationRoute>
          }
        />

        <Route
          path="/onboarding"
          element={
            <OnboardingRoute>
              <OnboardingPage />
            </OnboardingRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/nutrition"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Nutrition Page
                  </h1>
                  <p className="text-gray-600">
                    Coming soon! This will be the nutrition tracking page.
                  </p>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/workouts"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Workouts Page
                  </h1>
                  <p className="text-gray-600">
                    Coming soon! This will be the workout tracking page.
                  </p>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Progress Page
                  </h1>
                  <p className="text-gray-600">
                    Coming soon! This will be the progress analytics page.
                  </p>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/goals"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Goals Page
                  </h1>
                  <p className="text-gray-600">
                    Coming soon! This will be the goals management page.
                  </p>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Calendar Page
                  </h1>
                  <p className="text-gray-600">
                    Coming soon! This will be the calendar view page.
                  </p>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/achievements"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Achievements Page
                  </h1>
                  <p className="text-gray-600">
                    Coming soon! This will be the achievements page.
                  </p>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Profile Page
                  </h1>
                  <p className="text-gray-600">
                    Coming soon! This will be the user profile page.
                  </p>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Settings Page
                  </h1>
                  <p className="text-gray-600">
                    Coming soon! This will be the settings page.
                  </p>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
