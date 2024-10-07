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
  const [countdown, setCountdown] = useState(120);
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrengthValue) {
      case 0:
        return "Rất yếu";
      case 1:
        return "Yếu";
      case 2:
        return "Trung bình";
      case 3:
        return "Mạnh";
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
      toast.success("Chúng tôi đã gửi OTP đến email của bạn");
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
      if (!res.data?.isSuccess) {
        throw new Error("fail To Reset password");
      }
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
                  placeholder="Nhập email của bạn"
                  className="pl-10 bg-white border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  {...register("email", { required: "Email bắt buộc" })}
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
              {isSubmitting ? "Đang gửi..." : "Gửi OTP"}
            </Button>
          </form>
        );
      case "otp":
        return (
          <div className="space-y-4">
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
                  placeholder="Nhập mã OTP 5 chữ số"
                  className="text-center text-2xl tracking-widest bg-white border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  maxLength={5}
                  {...register("otp", {
                    required: "OTP là bắt buộc",
                    pattern: {
                      value: /^[0-9]{5}$/,
                      message: "OTP phải có 5 chữ số",
                    },
                  })}
                />
                {errors.otp && (
                  <span className="text-sm text-red-500">
                    {errors.otp.message as string}
                  </span>
                )}
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
                disabled={isLoadingVerifyOTP || countdown === 0}
              >
                {isLoadingVerifyOTP ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                )}
                {isSubmitting ? "Đang xác thực.." : "Xác thực OTP"}
              </Button>
            </form>
            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-sm text-gray-600">
                  Mã OTP hết hạn trong:{" "}
                  <span className="font-medium">{formatTime(countdown)}</span>
                </p>
              ) : (
                <p className="text-sm text-red-500">
                  Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.
                </p>
              )}
            </div>
          </div>
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
                Mật khẩu mới
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Nhập mật khẩu mới"
                  className="pl-10 bg-white border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  {...register("newPassword", {
                    required: "Mật khẩu mới là bắt buộc",
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
                  <span className="text-sm text-gray-500">Độ mạnh</span>
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
                Nhập lại mật khẩu
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Nhập lại mật khẩu mới"
                  className="pl-10 bg-white border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  {...register("confirmPassword", {
                    required: "Nhập lại mật khẩu là bắt buộc",
                    validate: (val: string) => {
                      if (watch("newPassword") != val) {
                        return "Mật khẩu không khớp";
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
              {isSubmitting ? "Đổi mật khẩu..." : "Đổi mật khẩu"}
            </Button>
          </form>
        );
      case "success":
        return (
          <Alert className="bg-green-100 border-green-500 rounded-md">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <AlertTitle className="text-green-800 text-lg font-semibold">
              Thành công
            </AlertTitle>
            <AlertDescription className="text-green-700">
              Mật khẩu đã được thay đổi thành công.
            </AlertDescription>
            <Button
              variant="outline"
              onClick={onBack}
              className="w-full mt-4 border-2 border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Trở lại trang đăng nhập
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
              Trở lại trang đăng nhập
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordForm;
