"use client";

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, Loader2, ChevronLeft, Mail, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { passwordStrength } from "check-password-strength";
import {
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useVerifyOTPMutation,
} from "@/services/apis";
import toast from "react-hot-toast";
import {
  setAccessToken,
  setRefreshToken,
  setRefreshTokenExpiryTime,
} from "@/utils";

type FormInputs = {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
};

interface ForgotPasswordFormProps {
  onBack: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBack }) => {
  const [step, setStep] = useState<
    "email" | "otp" | "changePassword" | "success"
  >("email");
  const [passwordStrengthValue, setPasswordStrengthValue] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormInputs>();
  const [email, { isLoading: isLoadingEmail }] = useForgetPasswordMutation();
  const [verifyOTP, { isLoading: isLoadingVerifyOTP }] = useVerifyOTPMutation();
  const [resetPassword] = useResetPasswordMutation();
  const newPassword = watch("newPassword");

  useEffect(() => {
    if (newPassword) {
      const strength = passwordStrength(newPassword).id;
      setPasswordStrengthValue(strength);
    } else {
      setPasswordStrengthValue(0);
    }
  }, [newPassword]);

  const getPasswordStrengthColor = () => {
    switch (passwordStrengthValue) {
      case 0:
        return "bg-red-500";
      case 1:
        return "bg-orange-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrengthValue) {
      case 0:
        return "Very Weak";
      case 1:
        return "Weak";
      case 2:
        return "Medium";
      case 3:
        return "Strong";
      default:
        return "";
    }
  };

  const onSubmitEmail: SubmitHandler<FormInputs> = async (data) => {
    try {
      const res = await email(data);
      if (!res.data?.isSuccess) {
        throw new Error(res.data?.error.message);
      }
      const message = res.data?.value;
      toast.success(message);
      setStep("otp");
    } catch (error) {
      console.log(error);
      toast.error("Email không đúng");
    }
  };

  const onSubmitOTP: SubmitHandler<FormInputs> = async (data) => {
    try {
      const res = await verifyOTP({ email: data.email, code: data.otp });
      if (!res.data?.isSuccess) {
        throw new Error(res.data?.error.message);
      }
      const { accessToken, refreshToken, refreshTokenExpiryTime } =
        res.data.value;
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);
      setRefreshTokenExpiryTime(refreshTokenExpiryTime);
      toast.success("Nhập mật khẩu mới");
      setStep("changePassword");
    } catch (error) {
      toast.error("OTP không đúng");
    }
  };

  const onSubmitNewPassword: SubmitHandler<FormInputs> = async (data) => {
    try {
      const res = await resetPassword({
        email: data.email,
        newPassword: data.newPassword,
      });

      setStep("success");
    } catch (error) {
      toast.error("Lỗi khi đổi mật khẩu");
    }
  };

  const renderForm = () => {
    switch (step) {
      case "email":
        return (
          <form onSubmit={handleSubmit(onSubmitEmail)} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10 bg-white border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  {...register("email", { required: "Email is required" })}
                />
              </div>
              {errors.email && (
                <span className="text-sm text-red-500">
                  {errors.email.message}
                </span>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
              disabled={isLoadingEmail}
            >
              {isLoadingEmail ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Mail className="mr-2 h-4 w-4" />
              )}
              {isSubmitting ? "Sending..." : "Send OTP"}
            </Button>
          </form>
        );
      case "otp":
        return (
          <form onSubmit={handleSubmit(onSubmitOTP)} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="otp"
                className="text-sm font-medium text-gray-700"
              >
                OTP
              </Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 5-digit OTP"
                className="text-center text-2xl tracking-widest bg-white border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                maxLength={5}
                {...register("otp", {
                  required: "OTP is required",
                  pattern: {
                    value: /^[0-9]{5}$/,
                    message: "OTP must be 5 digits",
                  },
                })}
              />
              {errors.otp && (
                <span className="text-sm text-red-500">
                  {errors.otp.message}
                </span>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
              disabled={isLoadingVerifyOTP}
            >
              {isLoadingVerifyOTP ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-2 h-4 w-4" />
              )}
              {isSubmitting ? "Verifying..." : "Verify OTP"}
            </Button>
          </form>
        );
      case "changePassword":
        return (
          <form
            onSubmit={handleSubmit(onSubmitNewPassword)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label
                htmlFor="newPassword"
                className="text-sm font-medium text-gray-700"
              >
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  className="pl-10 bg-white border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  {...register("newPassword", {
                    required: "New password is required",
                  })}
                />
              </div>
              {errors.newPassword && (
                <span className="text-sm text-red-500">
                  {errors.newPassword.message}
                </span>
              )}
              <div className="mt-2">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-500">
                    Password Strength
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {getPasswordStrengthText()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${getPasswordStrengthColor()}`}
                    style={{ width: `${(passwordStrengthValue + 1) * 25}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  className="pl-10 bg-white border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (val: string) => {
                      if (watch("newPassword") != val) {
                        return "Your passwords do not match";
                      }
                    },
                  })}
                />
              </div>
              {errors.confirmPassword && (
                <span className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
              disabled={isSubmitting || passwordStrengthValue < 2}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-2 h-4 w-4" />
              )}
              {isSubmitting ? "Changing..." : "Change Password"}
            </Button>
          </form>
        );
      case "success":
        return (
          <Alert className="bg-green-100 border-green-500 rounded-md">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <AlertTitle className="text-green-800 text-lg font-semibold">
              Success
            </AlertTitle>
            <AlertDescription className="text-green-700">
              Your password has been successfully changed.
            </AlertDescription>
            <Button
              variant="outline"
              onClick={onBack}
              className="w-full mt-4 border-2 border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </Alert>
        );
    }
  };

  return (
    <div className="min-h-72 flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-red-100 p-4">
      <Card className="w-full max-w-md mx-auto overflow-hidden shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
          <CardTitle className="text-2xl font-bold text-center">
            {step === "email" && "Forgot Password"}
            {step === "otp" && "Enter OTP"}
            {step === "changePassword" && "Change Password"}
            {step === "success" && "Password Changed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-white">
          {renderForm()}
          {step !== "success" && (
            <Button
              variant="outline"
              onClick={onBack}
              className="w-full mt-4 border-2 border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordForm;
