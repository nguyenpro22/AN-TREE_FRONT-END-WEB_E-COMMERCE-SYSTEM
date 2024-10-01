"use client";

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Loader2 } from "lucide-react";
import ColorfulButton from "./ColorfulButton";
import { passwordStrength } from "check-password-strength"; // Ensure correct import
import { IRegister } from "@/types";

interface RegisterFormProps {
  handleSubmitForm: (data: IRegister) => void;
  isSubmitting: boolean;
}

export default function RegisterForm({
  handleSubmitForm,
  isSubmitting,
}: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<IRegister>();

  const [passwordStrengthResult, setPasswordStrengthResult] = useState({
    id: 0,
    value: "Too weak",
    length: 0,
  });

  const onSubmit: SubmitHandler<IRegister> = async (data) => {
    handleSubmitForm(data);
  };

  const password = watch("password");

  // Update password strength when password changes
  useEffect(() => {
    if (password) {
      const result = passwordStrength(password);
      setPasswordStrengthResult(result);
    } else {
      setPasswordStrengthResult({ id: 0, value: "Too weak", length: 0 });
    }
  }, [password]);

  // Get color based on password strength level
  const getPasswordStrengthColor = (id: number) => {
    switch (id) {
      case 0:
        return "bg-red-500";
      case 1:
        return "bg-orange-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="space-y-4">
          {/* First Name */}
          <div className="space-y-2">
            <Label
              htmlFor="firstName"
              className="text-lg font-semibold text-gray-700"
            >
              First Name
            </Label>
            <Input
              id="firstName"
              placeholder="Enter your first name"
              className="bg-gray-50 border-2 border-gray-200 focus:border-purple-500 transition-colors"
              {...register("firstName", { required: "First name is required" })}
            />
            {errors.firstName && (
              <span className="text-sm text-red-500">
                {errors.firstName.message}
              </span>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label
              htmlFor="lastName"
              className="text-lg font-semibold text-gray-700"
            >
              Last Name
            </Label>
            <Input
              id="lastName"
              placeholder="Enter your last name"
              className="bg-gray-50 border-2 border-gray-200 focus:border-purple-500 transition-colors"
              {...register("lastName", { required: "Last name is required" })}
            />
            {errors.lastName && (
              <span className="text-sm text-red-500">
                {errors.lastName.message}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-lg font-semibold text-gray-700"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="bg-gray-50 border-2 border-gray-200 focus:border-purple-500 transition-colors"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <span className="text-sm text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label
              htmlFor="username"
              className="text-lg font-semibold text-gray-700"
            >
              Username
            </Label>
            <Input
              id="username"
              placeholder="Choose a username"
              className="bg-gray-50 border-2 border-gray-200 focus:border-purple-500 transition-colors"
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && (
              <span className="text-sm text-red-500">
                {errors.username.message}
              </span>
            )}
          </div>
        </div>

        {/* Account Information */}
        <div className="space-y-4">
          {/* Password */}
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-lg font-semibold text-gray-700"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Choose a password"
              className="bg-gray-50 border-2 border-gray-200 focus:border-purple-500 transition-colors"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <span className="text-sm text-red-500">
                {errors.password.message}
              </span>
            )}
            <Progress
              value={(passwordStrengthResult.id + 1) * 25}
              className={`h-2 ${getPasswordStrengthColor(
                passwordStrengthResult.id
              )}`}
            />
            <p className="text-xs text-gray-500">
              Password strength: {passwordStrengthResult.value}
            </p>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-lg font-semibold text-gray-700"
            >
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              className="bg-gray-50 border-2 border-gray-200 focus:border-purple-500 transition-colors"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
            {errors.confirmPassword && (
              <span className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label
              htmlFor="phonenumber"
              className="text-lg font-semibold text-gray-700"
            >
              Phone Number
            </Label>
            <Input
              id="phonenumber"
              type="tel"
              placeholder="Enter your phone number"
              className="bg-gray-50 border-2 border-gray-200 focus:border-purple-500 transition-colors"
              {...register("phonenumber", {
                required: "Phone number is required",
              })}
            />
            {errors.phonenumber && (
              <span className="text-sm text-red-500">
                {errors.phonenumber.message}
              </span>
            )}
          </div>
        </div>
      </div>

      <input type="hidden" {...register("role")} value={1} />

      <ColorfulButton
        icon={isSubmitting ? Loader2 : CheckCircle2}
        label={isSubmitting ? "Registering..." : "Register"}
        disabled={isSubmitting}
      />
    </form>
  );
}
