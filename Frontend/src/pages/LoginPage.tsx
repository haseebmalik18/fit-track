import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useForm } from "../hooks/useForm";
import { validateLoginForm } from "../utils/validation";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import type { LoginCredentials } from "../types/auth";
import type { ApiError } from "../types/api";

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [apiError, setApiError] = useState<string>("");
  const [displayText, setDisplayText] = useState("");
  const fullText = "Welcome back to your fitness journey";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 80);

    return () => clearInterval(timer);
  }, []);

  const { values, errors, isSubmitting, handleChange, handleSubmit } =
    useForm<LoginCredentials>({
      initialValues: {
        email: "",
        password: "",
      },
      validate: (values) => {
        const { errors } = validateLoginForm(values.email, values.password);
        return errors;
      },
      onSubmit: async (values) => {
        try {
          setApiError("");
          await login(values);
        } catch (error) {
          const apiErr = error as ApiError;
          setApiError(apiErr.error || "Login failed. Please try again.");
        }
      },
    });

  const handleForgotPassword = () => {
    alert("Forgot password feature coming soon! 🚀");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[420px]">
          <div className="text-center mb-10">
            <div className="group cursor-pointer inline-block mb-6">
              <h1 className="text-4xl font-light text-slate-800 tracking-wide transform transition-all duration-500 group-hover:scale-105">
                Fit
                <span className="font-medium text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
                  Track
                </span>
              </h1>
              <div className="h-0.5 w-12 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-2 rounded-full opacity-70"></div>
            </div>

            <div className="h-7 mb-2">
              <p className="text-slate-600 text-lg font-light">
                {displayText}
                <span className="animate-pulse text-blue-500 ml-0.5">|</span>
              </p>
            </div>
            <p className="text-slate-500 text-sm font-light">
              Sign in to continue your progress
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 transform transition-all duration-500 ease-out hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-2">
            <form onSubmit={handleSubmit} className="space-y-7">
              {apiError && (
                <div className="bg-red-50/80 backdrop-blur-sm text-red-700 p-4 rounded-2xl text-sm border border-red-100/50 animate-fadeIn">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                    <span>{apiError}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 tracking-wide">
                  Email Address
                </label>
                <Input
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  error={errors.email}
                  placeholder="Enter your email"
                  className="h-14 border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-blue-500/20 focus:ring-4 transition-all duration-300 ease-out rounded-2xl text-slate-800 placeholder-slate-400 hover:bg-white hover:border-gray-300 hover:shadow-sm focus:bg-white focus:shadow-md"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-medium text-slate-700 tracking-wide">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-300 font-medium tracking-wide"
                  >
                    Forgot password?
                  </button>
                </div>
                <Input
                  type="password"
                  autoComplete="current-password"
                  value={values.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  error={errors.password}
                  placeholder="Enter your password"
                  className="h-14 border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-blue-500/20 focus:ring-4 transition-all duration-300 ease-out rounded-2xl text-slate-800 placeholder-slate-400 hover:bg-white hover:border-gray-300 hover:shadow-sm focus:bg-white focus:shadow-md"
                />
              </div>

              <Button
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
                className="w-full h-14 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-2xl transition-all duration-500 ease-out shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transform hover:scale-[1.005] active:scale-[0.995] disabled:opacity-70 disabled:cursor-not-allowed tracking-wide"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing you in...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <span>Sign In</span>
                    <svg
                      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-200/60 text-center">
              <p className="text-slate-600 text-sm font-light">
                New to FitTrack?{" "}
                <a
                  href="/register"
                  className="text-blue-600 hover:text-blue-700 font-medium relative group transition-colors duration-300 tracking-wide"
                >
                  Create your account
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out rounded-full"></span>
                </a>
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-slate-400 text-xs font-light tracking-wide">
              Secure login • Privacy protected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
