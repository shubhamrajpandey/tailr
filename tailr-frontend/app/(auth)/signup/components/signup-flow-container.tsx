"use client";

import * as React from "react";
import { SignupForm } from "./signup-form";
import { OtpVerificationScreen } from "./otp-verification-screen";
import {
  useSignupMutation,
  extractErrorMessage,
} from "@/shared/hooks/auth/use-auth-mutations";
import { useAppSelector } from "@/shared/store/hooks";

/**
 * Manages the two-step signup flow: form → OTP verification.
 *
 * State ownership:
 * - TanStack Query: handles the network call and isPending
 * - Redux authSlice: authStep reflects "signup" | "otp" | "done"
 * - Local state: userData (email/name carry-over for OTP screen)
 *
 * The OTP code itself lives on the backend — we do NOT generate or store it
 * here. The OTP screen submits to /auth/verify-otp directly.
 */
export function SignupFlowContainer() {
  const authStep = useAppSelector((s) => s.auth.authStep);

  // We track the user's registration data locally to pass the email/name
  // to the OTP screen (for display only — not for verification logic).
  const [userData, setUserData] = React.useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [signupError, setSignupError] = React.useState<string | null>(null);

  const signupMutation = useSignupMutation();

  const handleProceedToOtp = (data: {
    fullName: string;
    email: string;
    password: string;
  }) => {
    setUserData(data);
    setSignupError(null);

    signupMutation.mutate(
      {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        confirmPassword: data.password,
      },
      {
        onError: (error) => {
          setSignupError(extractErrorMessage(error));
        },
        // onSuccess is handled inside useSignupMutation → dispatches setAuthStep("otp")
      },
    );
  };

  const handleBackToSignup = () => {
    // Reset the mutation state so the form is clean on return
    signupMutation.reset();
    setSignupError(null);
    // Redux authStep will be reset by the mutation hook or by clearCredentials
    // but we drive the view from local authStep observation above.
    // Force it back to signup by resetting userData (causing the signup form to render).
    setUserData((prev) => ({ ...prev }));
  };

  const handleGoogleSignIn = () => {
    // Google OAuth — placeholder until OAuth integration is added
    setSignupError("Google sign-up is not yet configured. Please use email and password.");
  };

  // authStep from Redux drives which step is showing:
  // "signup" or "done" (not yet in OTP) → signup form
  // "otp" → OTP verification screen
  const showOtpStep = authStep === "otp";

  return (
    <div className="w-full transition-all duration-300">
      {!showOtpStep ? (
        <div className="animate-in fade-in zoom-in-95 duration-200">
          <SignupForm
            initialFullName={userData.fullName}
            initialEmail={userData.email}
            onProceedToOtp={handleProceedToOtp}
            onGoogleSignIn={handleGoogleSignIn}
            isLoading={signupMutation.isPending}
            serverError={signupError}
          />
        </div>
      ) : (
        <div className="animate-in fade-in zoom-in-95 duration-200">
          <OtpVerificationScreen
            email={userData.email}
            fullName={userData.fullName}
            onResendOtp={() => {
              /* handled internally in OtpVerificationScreen */
            }}
            onBackToSignup={handleBackToSignup}
          />
        </div>
      )}
    </div>
  );
}
