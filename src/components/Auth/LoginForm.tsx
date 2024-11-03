import React, { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, CheckCircle2, Loader2 } from "lucide-react";
import ColorfulButton from "./ColorfulButton";
import { ILogin } from "@/types";

interface LoginFormProps {
  onForgotPassword: () => void;
  onLoginSuccess: (formData: ILogin) => void;
  isLoading: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onForgotPassword,
  onLoginSuccess,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ILogin>({
    defaultValues: {
      isRememberMe: false,
    },
  });
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit: SubmitHandler<ILogin> = async (data) => {
    onLoginSuccess(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label
          htmlFor="emailOrUserName"
          className="text-lg font-semibold text-green-700"
        >
          Email or username
        </Label>
        <Input
          id="emailOrUserName"
          placeholder="Enter email or username"
          className="bg-gray-50 border-2 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-colors"
          {...register("emailOrUserName", {
            required: "Email or username is required",
          })}
        />
        {errors.emailOrUserName && (
          <span className="text-sm text-red-500">
            {errors.emailOrUserName.message}
          </span>
        )}
      </div>
      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="text-lg font-semibold text-green-700"
        >
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter password"
            className="bg-gray-50 border-2 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-colors"
            {...register("password", { required: "Password is required" })}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent hover:text-green-600"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-500" />
            ) : (
              <Eye className="h-4 w-4 text-gray-500" />
            )}
          </Button>
        </div>
        {errors.password && (
          <span className="text-sm text-red-500">
            {errors.password.message}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="link"
          onClick={onForgotPassword}
          className="text-sm text-green-600 hover:text-green-800"
        >
          Forgot password?
        </Button>
      </div>
      <ColorfulButton
        icon={isLoading ? Loader2 : CheckCircle2}
        label={isLoading ? "Signing in..." : "Sign in"}
        disabled={isLoading}
        iconClassName={isLoading ? "animate-spin" : ""}
      />
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
