import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Loader2 } from "lucide-react";
import ColorfulButton from "./ColorfulButton";

type VendorCreationFormInputs = {
  bankOwnerName: string;
  bankName: string;
  city: string;
  province: string;
  vendorName: string;
  vendorEmail: string;
  address: string;
  phoneNumber: string;
  bankAccountNumber: string;
  avatarImage: FileList;
  coverImage: FileList;
};

const VendorCreationForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VendorCreationFormInputs>();
  const [isSuccess, setIsSuccess] = useState(false);

  const onSubmit: SubmitHandler<VendorCreationFormInputs> = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "avatarImage" || key === "coverImage") {
        formData.append(key, value[0]);
      } else {
        formData.append(key, value as string);
      }
    });

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Vendor created successfully");
      setIsSuccess(true);
    } catch (error) {
      console.error("Error creating vendor:", error);
    }
  };

  if (isSuccess) {
    return (
      <Alert className="bg-green-100 border-green-500">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Success</AlertTitle>
        <AlertDescription className="text-green-700">
          Your vendor account has been created successfully.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label
          htmlFor="vendorName"
          className="text-lg font-semibold text-gray-700"
        >
          Vendor Name
        </Label>
        <Input
          id="vendorName"
          placeholder="Enter vendor name"
          className="bg-gray-50 border-2 border-gray-200 focus:border-purple-500 transition-colors"
          {...register("vendorName", { required: "Vendor name is required" })}
        />
        {errors.vendorName && (
          <span className="text-sm text-red-500">
            {errors.vendorName.message}
          </span>
        )}
      </div>
      <div className="space-y-2">
        <Label
          htmlFor="vendorEmail"
          className="text-lg font-semibold text-gray-700"
        >
          Vendor Email
        </Label>
        <Input
          id="vendorEmail"
          type="email"
          placeholder="Enter vendor email"
          className="bg-gray-50 border-2 border-gray-200 focus:border-purple-500 transition-colors"
          {...register("vendorEmail", { required: "Vendor email is required" })}
        />
        {errors.vendorEmail && (
          <span className="text-sm text-red-500">
            {errors.vendorEmail.message}
          </span>
        )}
      </div>
      <div className="space-y-2">
        <Label
          htmlFor="phoneNumber"
          className="text-lg font-semibold text-gray-700"
        >
          Phone Number
        </Label>
        <Input
          id="phoneNumber"
          type="tel"
          placeholder="Enter phone number"
          className="bg-gray-50 border-2 border-gray-200 focus:border-purple-500 transition-colors"
          {...register("phoneNumber", { required: "Phone number is required" })}
        />
        {errors.phoneNumber && (
          <span className="text-sm text-red-500">
            {errors.phoneNumber.message}
          </span>
        )}
      </div>
      <div className="space-y-2">
        <Label
          htmlFor="address"
          className="text-lg font-semibold text-gray-700"
        >
          Address
        </Label>
        <Input
          id="address"
          placeholder="Enter address"
          className="bg-gray-50 border-2 border-gray-200 focus:border-purple-500 transition-colors"
          {...register("address", { required: "Address is required" })}
        />
        {errors.address && (
          <span className="text-sm text-red-500">{errors.address.message}</span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city" className="text-lg font-semibold text-gray-700">
            City
          </Label>
          <Input
            id="city"
            placeholder="Enter city"
            className="bg-gray-50 border-2 border-gray-200 focus:border-purple-500 transition-colors"
            {...register("city", { required: "City is required" })}
          />
          {errors.city && (
            <span className="text-sm text-red-500">{errors.city.message}</span>
          )}
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="province"
            className="text-lg font-semibold text-gray-700"
          >
            Province
          </Label>
          <Input
            id="province"
            placeholder="Enter province"
            className="bg-gray-50 border-2 border-gray-200 focus:border-purple-500 transition-colors"
            {...register("province", { required: "Province is required" })}
          />
          {errors.province && (
            <span className="text-sm text-red-500">
              {errors.province.message}
            </span>
          )}
        </div>
      </div>
      <Separator className="my-4" />
      <div className="space-y-2">
        <Label
          htmlFor="bankName"
          className="text-lg font-semibold text-gray-700"
        >
          Bank Name
        </Label>
        <Input
          id="bankName"
          placeholder="Enter bank name"
          className="bg-gray-50 border-2 border-gray-200 focus:border-purple-500 transition-colors"
          {...register("bankName", { required: "Bank name is required" })}
        />
        {errors.bankName && (
          <span className="text-sm text-red-500">
            {errors.bankName.message}
          </span>
        )}
      </div>
      <div className="space-y-2">
        <Label
          htmlFor="bankOwnerName"
          className="text-lg font-semibold text-gray-700"
        >
          Bank Owner Name
        </Label>
        <Input
          id="bankOwnerName"
          placeholder="Enter bank owner name"
          className="bg-gray-50 border-2 border-gray-200 focus:border-purple-500 transition-colors"
          {...register("bankOwnerName", {
            required: "Bank owner name is required",
          })}
        />
        {errors.bankOwnerName && (
          <span className="text-sm text-red-500">
            {errors.bankOwnerName.message}
          </span>
        )}
      </div>
      <div className="space-y-2">
        <Label
          htmlFor="bankAccountNumber"
          className="text-lg font-semibold text-gray-700"
        >
          Bank Account Number
        </Label>
        <Input
          id="bankAccountNumber"
          placeholder="Enter bank account number"
          className="bg-gray-50 border-2 border-gray-200 focus:border-purple-500 transition-colors"
          {...register("bankAccountNumber", {
            required: "Bank account number is required",
          })}
        />
        {errors.bankAccountNumber && (
          <span className="text-sm text-red-500">
            {errors.bankAccountNumber.message}
          </span>
        )}
      </div>
      <Separator className="my-4" />
      <div className="space-y-2">
        <Label
          htmlFor="avatarImage"
          className="text-lg font-semibold text-gray-700"
        >
          Avatar Image
        </Label>
        <Input
          id="avatarImage"
          type="file"
          accept="image/*"
          className="bg-gray-50 border-2 border-gray-200 focus:border-purple-500 transition-colors"
          {...register("avatarImage", { required: "Avatar image is required" })}
        />
        {errors.avatarImage && (
          <span className="text-sm text-red-500">
            {errors.avatarImage.message}
          </span>
        )}
      </div>
      <div className="space-y-2">
        <Label
          htmlFor="coverImage"
          className="text-lg font-semibold text-gray-700"
        >
          Cover Image
        </Label>
        <Input
          id="coverImage"
          type="file"
          accept="image/*"
          className="bg-gray-50 border-2 border-gray-200 focus:border-purple-500 transition-colors"
          {...register("coverImage", { required: "Cover image is required" })}
        />
        {errors.coverImage && (
          <span className="text-sm text-red-500">
            {errors.coverImage.message}
          </span>
        )}
      </div>
      <ColorfulButton
        icon={isSubmitting ? Loader2 : CheckCircle2}
        label={isSubmitting ? "Creating Vendor..." : "Create Vendor"}
        disabled={isSubmitting}
      />
    </form>
  );
};

export default VendorCreationForm;
