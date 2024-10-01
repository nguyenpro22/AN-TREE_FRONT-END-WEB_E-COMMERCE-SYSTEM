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
          className="text-lg font-semibold text-gray-700"
        >
          Email hoặc tên đăng nhập
        </Label>
        <Input
          id="emailOrUserName"
          placeholder="Nhập email hoặc tên đăng nhập"
          className="bg-gray-50 border-2 border-gray-200 focus:border-purple-500 transition-colors"
          {...register("emailOrUserName", {
            required: "Email hoặc tên đăng nhập là bắt buộc",
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
          className="text-lg font-semibold text-gray-700"
        >
          Mật khẩu
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu"
            className="bg-gray-50 border-2 border-gray-200 focus:border-purple-500 transition-colors"
            {...register("password", { required: "Mật khẩu là bắt buộc" })}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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
        <div className="flex items-center space-x-2">
          <Controller
            name="isRememberMe"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="isRememberMe"
                checked={field.value}
                onCheckedChange={field.onChange}
                className="border-2 border-gray-300 rounded-sm"
              />
            )}
          />
          <Label
            htmlFor="isRememberMe"
            className="text-sm font-medium text-gray-700 cursor-pointer"
          >
            Ghi nhớ mật khẩu
          </Label>
        </div>
        <Button
          type="button"
          variant="link"
          onClick={onForgotPassword}
          className="text-sm text-purple-600 hover:text-purple-800"
        >
          Quên mật khẩu?
        </Button>
      </div>
      <ColorfulButton
        icon={isLoading ? Loader2 : CheckCircle2}
        label={isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
        disabled={isLoading}
        className="w-full"
      />
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Hoặc tiếp tục với</span>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
