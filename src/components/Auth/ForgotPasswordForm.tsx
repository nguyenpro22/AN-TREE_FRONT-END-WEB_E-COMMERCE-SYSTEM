import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, Loader2, ChevronLeft } from "lucide-react";
import ColorfulButton from "./ColorfulButton";

type ForgotPasswordFormInputs = {
  email: string;
};

interface ForgotPasswordFormProps {
  onBack: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBack }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormInputs>();
  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit: SubmitHandler<ForgotPasswordFormInputs> = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Forgot Password:", data);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <Alert className="bg-green-100 border-green-500">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Success</AlertTitle>
        <AlertDescription className="text-green-700">
          Password reset instructions have been sent to your email.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
      <ColorfulButton
        icon={isSubmitting ? Loader2 : CheckCircle2}
        label={isSubmitting ? "Resetting..." : "Reset Password"}
        disabled={isSubmitting}
      />
      <Button variant="outline" onClick={onBack} className="w-full">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Login
      </Button>
    </form>
  );
};

export default ForgotPasswordForm;
