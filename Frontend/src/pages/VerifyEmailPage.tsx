import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import type { ApiError } from "../types/api";

const VerifyEmailPage: React.FC = () => {
  const { verifyEmail, resendVerificationCode } = useAuth();
  const [apiError, setApiError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [resendLoading, setResendLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const urlParams = new URLSearchParams(window.location.search);
  const email = urlParams.get("email") || "";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>(
    new Array(6).fill(null)
  );

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;

    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (pastedData.length === 6) {
      const newCode = pastedData.split("");
      setCode(newCode);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const codeString = code.join("").trim();
    if (codeString.length !== 6) {
      setApiError("Please enter all 6 digits");
      return;
    }

    if (!/^\d{6}$/.test(codeString)) {
      setApiError("Please enter only numbers");
      return;
    }

    setIsSubmitting(true);
    setApiError("");
    setSuccessMessage("");

    try {
      await verifyEmail(email.toLowerCase().trim(), codeString);
      setSuccessMessage("Email verified successfully!");
    } catch (error) {
      const apiErr = error as ApiError;
      setApiError(apiErr.error || "Verification failed. Please try again.");

      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setApiError("Email not found. Please go back to registration.");
      return;
    }

    setResendLoading(true);
    setApiError("");
    setSuccessMessage("");

    try {
      await resendVerificationCode(email.toLowerCase().trim());
      setSuccessMessage("New verification code sent!");

      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error) {
      const apiErr = error as ApiError;
      setApiError(apiErr.error || "Failed to resend code. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const isCodeComplete = code.every((digit) => digit !== "");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Fit<span className="text-blue-600">Track</span>
          </h1>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/50">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Enter verification code
            </h2>
            <p className="text-slate-600 text-sm">
              Code sent to <span className="font-medium">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {apiError && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-100">
                {apiError}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm border border-green-100">
                {successMessage}
              </div>
            )}

            <div className="flex justify-center space-x-3 mb-6">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-12 h-14 text-center text-xl font-semibold border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all duration-200"
                  maxLength={1}
                  autoComplete="one-time-code"
                />
              ))}
            </div>

            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting || !isCodeComplete}
              className={`w-full h-12 font-medium rounded-xl transition-all duration-200 ${
                isCodeComplete
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "Verifying..." : "Verify Code"}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendLoading}
                className="text-blue-600 hover:text-blue-700 text-sm transition-colors disabled:opacity-50"
              >
                {resendLoading ? "Sending..." : "Didn't receive it? Resend"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
