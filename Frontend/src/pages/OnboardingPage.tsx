import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import type { ApiError } from "../types/api";

interface OnboardingData {
  goal: string;
  activityLevel: string;
  currentWeight: string;
  targetWeight: string;
  height: string;
  age: string;
  gender: string;
}

const OnboardingPage: React.FC = () => {
  const { user, completeOnboarding } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string>("");
  const [formData, setFormData] = useState<OnboardingData>({
    goal: "",
    activityLevel: "",
    currentWeight: "",
    targetWeight: "",
    height: "",
    age: "",
    gender: "",
  });

  const handleInputChange = (field: keyof OnboardingData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApiError("");

    try {
      const onboardingPayload = {
        goal: formData.goal,
        activityLevel: formData.activityLevel,
        currentWeight: parseFloat(formData.currentWeight),
        targetWeight: formData.targetWeight
          ? parseFloat(formData.targetWeight)
          : undefined,
        height: parseInt(formData.height),
        age: parseInt(formData.age),
        gender: formData.gender,
      };

      await completeOnboarding(onboardingPayload);
    } catch (error) {
      const apiErr = error as ApiError;
      setApiError(apiErr.error || "Failed to complete profile setup");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-slate-200/10 to-blue-200/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgb(100 116 139) 1px, transparent 1px),
            linear-gradient(90deg, rgb(100 116 139) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      ></div>

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block mb-6">
              <h1 className="text-4xl font-light text-slate-800 tracking-wide mb-2">
                Complete Your
                <span className="font-medium text-blue-600 ml-2">
                  Fitness Profile
                </span>
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full opacity-70"></div>
            </div>
            <p className="text-slate-600 text-lg font-light">
              Welcome {user?.firstName}! Let's set up your fitness goals to get
              started.
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 transform transition-all duration-700 ease-out hover:shadow-3xl hover:scale-[1.02] hover:-translate-y-3 hover:bg-white/80 group">
            {/* Card header with gradient */}
            <div className="bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-t-3xl p-8 pb-6 group-hover:from-blue-500/10 group-hover:to-indigo-500/10 transition-all duration-500">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full"></div>
                <h2 className="text-xl font-semibold text-slate-800 ml-2">
                  Personal Information
                </h2>
              </div>
              <p className="text-slate-600 text-sm font-light">
                Help us personalize your fitness experience
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 pt-2 space-y-8">
              {apiError && (
                <div className="bg-red-50/80 backdrop-blur-sm text-red-700 p-4 rounded-2xl text-sm border border-red-100/50 animate-fadeIn">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                    <span>{apiError}</span>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 mb-3 tracking-wide">
                  What's your primary fitness goal?
                </label>
                <select
                  value={formData.goal}
                  onChange={(e) => handleInputChange("goal", e.target.value)}
                  className="w-full px-4 py-4 border-2 border-slate-200 bg-slate-50/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 ease-out text-slate-800 hover:bg-white hover:border-slate-300 hover:shadow-sm focus:bg-white focus:shadow-md"
                  required
                >
                  <option value="">Select your goal</option>
                  <option value="LOSE_WEIGHT">Lose Weight</option>
                  <option value="MAINTAIN_WEIGHT">Maintain Weight</option>
                  <option value="GAIN_WEIGHT">Gain Weight</option>
                  <option value="BUILD_MUSCLE">Build Muscle</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 mb-3 tracking-wide">
                  How active are you?
                </label>
                <select
                  value={formData.activityLevel}
                  onChange={(e) =>
                    handleInputChange("activityLevel", e.target.value)
                  }
                  className="w-full px-4 py-4 border-2 border-slate-200 bg-slate-50/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 ease-out text-slate-800 hover:bg-white hover:border-slate-300 hover:shadow-sm focus:bg-white focus:shadow-md"
                  required
                >
                  <option value="">Select activity level</option>
                  <option value="SEDENTARY">
                    Sedentary (little to no exercise)
                  </option>
                  <option value="LIGHTLY_ACTIVE">
                    Lightly Active (1-3 days/week)
                  </option>
                  <option value="MODERATELY_ACTIVE">
                    Moderately Active (3-5 days/week)
                  </option>
                  <option value="VERY_ACTIVE">
                    Very Active (6-7 days/week)
                  </option>
                  <option value="EXTREMELY_ACTIVE">
                    Extremely Active (very intense exercise)
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Current Weight (kg)"
                  type="number"
                  step="0.1"
                  value={formData.currentWeight}
                  onChange={(e) =>
                    handleInputChange("currentWeight", e.target.value)
                  }
                  placeholder="70.0"
                  className="px-4 py-4 border-2 border-slate-200 bg-slate-50/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 ease-out text-slate-800 placeholder-slate-400 hover:bg-white hover:border-slate-300 hover:shadow-sm focus:bg-white focus:shadow-md"
                  required
                />

                <Input
                  label="Target Weight (kg)"
                  type="number"
                  step="0.1"
                  value={formData.targetWeight}
                  onChange={(e) =>
                    handleInputChange("targetWeight", e.target.value)
                  }
                  placeholder="65.0 (optional)"
                  className="px-4 py-4 border-2 border-slate-200 bg-slate-50/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 ease-out text-slate-800 placeholder-slate-400 hover:bg-white hover:border-slate-300 hover:shadow-sm focus:bg-white focus:shadow-md"
                />

                <Input
                  label="Height (cm)"
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleInputChange("height", e.target.value)}
                  placeholder="175"
                  className="px-4 py-4 border-2 border-slate-200 bg-slate-50/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 ease-out text-slate-800 placeholder-slate-400 hover:bg-white hover:border-slate-300 hover:shadow-sm focus:bg-white focus:shadow-md"
                  required
                />

                <Input
                  label="Age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  placeholder="25"
                  className="px-4 py-4 border-2 border-slate-200 bg-slate-50/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 ease-out text-slate-800 placeholder-slate-400 hover:bg-white hover:border-slate-300 hover:shadow-sm focus:bg-white focus:shadow-md"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 mb-3 tracking-wide">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="w-full px-4 py-4 border-2 border-slate-200 bg-slate-50/50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 ease-out text-slate-800 hover:bg-white hover:border-slate-300 hover:shadow-sm focus:bg-white focus:shadow-md"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <Button
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
                className="w-full h-16 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-2xl transition-all duration-500 ease-out shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transform hover:scale-[1.005] active:scale-[0.995] disabled:opacity-70 disabled:cursor-not-allowed tracking-wide"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Setting up your profile...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <span>Complete Setup</span>
                    <svg
                      className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                )}
              </Button>
            </form>
          </div>

          {/* Progress indicator */}
          <div className="mt-10 text-center">
            <div className="flex items-center justify-center space-x-3 text-sm text-slate-600">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full shadow-lg shadow-green-500/30"></div>
                <span className="font-medium">Email Verified</span>
              </div>
              <div className="w-12 h-0.5 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full shadow-lg shadow-blue-500/30 animate-pulse"></div>
                <span className="font-medium text-blue-700">
                  Complete Profile
                </span>
              </div>
              <div className="w-12 h-0.5 bg-slate-300 rounded-full"></div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-slate-300 rounded-full"></div>
                <span>Start Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
