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
import OnboardingPage from "./pages/OnBoardingPage";

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

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome to FitTrack, {user?.firstName}!
              </h1>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">
                🎉 Welcome to FitTrack!
              </h2>
              <p className="text-blue-700 mb-4">
                Your account is fully set up and ready to go. Your fitness
                dashboard will be built here.
              </p>

              <div className="bg-white rounded-lg p-4 text-sm">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Account Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Email Verified</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Profile Complete</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Ready to Track</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
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
