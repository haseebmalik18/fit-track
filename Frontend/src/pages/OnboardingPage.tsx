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
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Fitness Profile
          </h1>
          <p className="text-gray-600">
            Welcome {user?.firstName}! Let's set up your fitness goals to get
            started.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {apiError && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-100">
                {apiError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What's your primary fitness goal?
              </label>
              <select
                value={formData.goal}
                onChange={(e) => handleInputChange("goal", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select your goal</option>
                <option value="LOSE_WEIGHT">Lose Weight</option>
                <option value="MAINTAIN_WEIGHT">Maintain Weight</option>
                <option value="GAIN_WEIGHT">Gain Weight</option>
                <option value="BUILD_MUSCLE">Build Muscle</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How active are you?
              </label>
              <select
                value={formData.activityLevel}
                onChange={(e) =>
                  handleInputChange("activityLevel", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <option value="VERY_ACTIVE">Very Active (6-7 days/week)</option>
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
              />

              <Input
                label="Height (cm)"
                type="number"
                value={formData.height}
                onChange={(e) => handleInputChange("height", e.target.value)}
                placeholder="175"
                required
              />

              <Input
                label="Age"
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                placeholder="25"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange("gender", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
            >
              {isSubmitting ? "Setting up your profile..." : "Complete Setup"}
            </Button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Email Verified</span>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Complete Profile</span>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
            <span>Start Tracking</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
