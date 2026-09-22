"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { SignupForm } from "./signup-form";
import { OtpVerificationScreen } from "./otp-verification-screen";

export function SignupFlowContainer() {
  const router = useRouter();
  const [step, setStep] = React.useState<"signup" | "otp">("signup");
  const [userData, setUserData] = React.useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [expectedOtp, setExpectedOtp] = React.useState("482910");
  const [isSocialLoading, setIsSocialLoading] = React.useState(false);

  // Generate a realistic 6-digit OTP
  const generateNewOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setExpectedOtp(code);
    return code;
  };

  const handleProceedToOtp = (data: {
    fullName: string;
    email: string;
    password: string;
  }) => {
    setUserData(data);
    generateNewOtp();
    setStep("otp");
  };

  const handleResendOtp = () => {
    generateNewOtp();
  };

  const handleBackToSignup = () => {
    setStep("signup");
  };

  const handleGoogleSignIn = () => {
    setIsSocialLoading(true);
    setTimeout(() => {
      setIsSocialLoading(false);
      router.push("/dashboard");
    }, 600);
  };

  return (
    <div className="w-full transition-all duration-300">
      {step === "signup" ? (
        <div className="animate-in fade-in zoom-in-95 duration-200">
          <SignupForm
            initialFullName={userData.fullName}
            initialEmail={userData.email}
            onProceedToOtp={handleProceedToOtp}
            onGoogleSignIn={handleGoogleSignIn}
            isLoading={isSocialLoading}
          />
        </div>
      ) : (
        <div className="animate-in fade-in zoom-in-95 duration-200">
          <OtpVerificationScreen
            email={userData.email}
            fullName={userData.fullName}
            expectedOtp={expectedOtp}
            onResendOtp={handleResendOtp}
            onBackToSignup={handleBackToSignup}
          />
        </div>
      )}
    </div>
  );
}
