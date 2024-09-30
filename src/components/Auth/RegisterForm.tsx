import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Loader2 } from "lucide-react";
import ColorfulButton from "./ColorfulButton";

type RegisterFormInputs = {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  phonenumber: string;
  role: number;
};

const RegisterForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RegisterFormInputs>();
  const [passwordStrength, setPasswordStrength] = useState(0);

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Register:", data);
  };

  const password = watch("password");

  useEffect(() => {
    if (password) {
      let strength = 0;
      if (password.length >= 8) strength += 25;
      if (password.match(/[a-z]/)) strength += 25;
      if (password.match(/[A-Z]/)) strength += 25;
      if (password.match(/[0-9]/)) strength += 25;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [password]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
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
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-lg font-semibold text-gray-700">
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
          <span className="text-sm text-red-500">{errors.email.message}</span>
        )}
      </div>
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
        <Progress value={passwordStrength} className="h-2" />
        <p className="text-xs text-gray-500">
          Password strength: {passwordStrength}%
        </p>
      </div>
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
          {...register("phonenumber", { required: "Phone number is required" })}
        />
        {errors.phonenumber && (
          <span className="text-sm text-red-500">
            {errors.phonenumber.message}
          </span>
        )}
      </div>
      <input type="hidden" {...register("role")} value={1} />
      <ColorfulButton
        icon={isSubmitting ? Loader2 : CheckCircle2}
        label={isSubmitting ? "Registering..." : "Register"}
        disabled={isSubmitting}
      />
    </form>
  );
};

export default RegisterForm;
