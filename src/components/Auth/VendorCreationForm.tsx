"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  CheckCircle2,
  Loader2,
  User,
  Building,
  CreditCard,
  Image,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCreateVendorMutation } from "@/services/apis";

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

interface VendorCreationFormProps {
  handleLogout: () => void;
}

export default function VendorCreationForm({
  handleLogout,
}: VendorCreationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VendorCreationFormInputs>();
  const [isSuccess, setIsSuccess] = useState(false);
  const [createVendor] = useCreateVendorMutation();
  const onSubmit: SubmitHandler<VendorCreationFormInputs> = async (data) => {
    try {
      const formData = new FormData();
      formData.append("vendorEmail", data.vendorEmail);
      formData.append("vendorName", data.vendorName);
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("address", data.address);
      formData.append("city", data.city);
      formData.append("province", data.province);
      formData.append("bankName", data.bankName);
      formData.append("bankOwnerName", data.bankOwnerName);
      formData.append("bankAccountNumber", data.bankAccountNumber);
      formData.append("avatarImage", data.avatarImage[0]);
      formData.append("coverImage", data.coverImage[0]);

      const res = await createVendor(formData);
      console.log(res);

      setIsSuccess(true);
    } catch (error) {
      console.error("Error creating vendor:", error);
    }
  };

  if (isSuccess) {
    return (
      <Alert
        variant="default"
        className="max-w-md mx-auto mt-8 bg-green-100 border-green-500 text-green-800"
      >
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>
          Your vendor account has been created successfully.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 w-full max-w-4xl"
      >
        <Card className="w-full shadow-lg border-t-4 border-purple-500">
          <CardHeader className="space-y-1 bg-gradient-to-r from-purple-100 to-blue-100 rounded-t-lg">
            <CardTitle className="text-3xl font-bold text-purple-800">
              Create Vendor Account
            </CardTitle>
            <CardDescription className="text-lg text-purple-600">
              Fill in the details to create a new vendor account.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-purple-100 rounded-lg p-1">
                <TabsTrigger
                  value="personal"
                  className="data-[state=active]:bg-white data-[state=active]:text-purple-700"
                >
                  <User className="w-4 h-4 mr-2" />
                  Personal
                </TabsTrigger>
                <TabsTrigger
                  value="address"
                  className="data-[state=active]:bg-white data-[state=active]:text-purple-700"
                >
                  <Building className="w-4 h-4 mr-2" />
                  Address
                </TabsTrigger>
                <TabsTrigger
                  value="bank"
                  className="data-[state=active]:bg-white data-[state=active]:text-purple-700"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Bank
                </TabsTrigger>
                <TabsTrigger
                  value="images"
                  className="data-[state=active]:bg-white data-[state=active]:text-purple-700"
                >
                  <Image className="w-4 h-4 mr-2" />
                  Images
                </TabsTrigger>
              </TabsList>
              <TabsContent value="personal">
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="vendorName" className="text-purple-700">
                      Vendor Name
                    </Label>
                    <Input
                      id="vendorName"
                      placeholder="Enter vendor name"
                      className="border-purple-200 focus:border-purple-500"
                      {...register("vendorName", {
                        required: "Vendor name is required",
                      })}
                    />
                    {errors.vendorName && (
                      <span className="text-sm text-red-500">
                        {errors.vendorName.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vendorEmail" className="text-purple-700">
                      Vendor Email
                    </Label>
                    <Input
                      id="vendorEmail"
                      type="email"
                      placeholder="Enter vendor email"
                      className="border-purple-200 focus:border-purple-500"
                      {...register("vendorEmail", {
                        required: "Vendor email is required",
                      })}
                    />
                    {errors.vendorEmail && (
                      <span className="text-sm text-red-500">
                        {errors.vendorEmail.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-purple-700">
                      Phone Number
                    </Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="Enter phone number"
                      className="border-purple-200 focus:border-purple-500"
                      {...register("phoneNumber", {
                        required: "Phone number is required",
                      })}
                    />
                    {errors.phoneNumber && (
                      <span className="text-sm text-red-500">
                        {errors.phoneNumber.message}
                      </span>
                    )}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="address">
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-purple-700">
                      Address
                    </Label>
                    <Input
                      id="address"
                      placeholder="Enter address"
                      className="border-purple-200 focus:border-purple-500"
                      {...register("address", {
                        required: "Address is required",
                      })}
                    />
                    {errors.address && (
                      <span className="text-sm text-red-500">
                        {errors.address.message}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-purple-700">
                        City
                      </Label>
                      <Input
                        id="city"
                        placeholder="Enter city"
                        className="border-purple-200 focus:border-purple-500"
                        {...register("city", { required: "City is required" })}
                      />
                      {errors.city && (
                        <span className="text-sm text-red-500">
                          {errors.city.message}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="province" className="text-purple-700">
                        Province
                      </Label>
                      <Input
                        id="province"
                        placeholder="Enter province"
                        className="border-purple-200 focus:border-purple-500"
                        {...register("province", {
                          required: "Province is required",
                        })}
                      />
                      {errors.province && (
                        <span className="text-sm text-red-500">
                          {errors.province.message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="bank">
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankName" className="text-purple-700">
                      Bank Name
                    </Label>
                    <Input
                      id="bankName"
                      placeholder="Enter bank name"
                      className="border-purple-200 focus:border-purple-500"
                      {...register("bankName", {
                        required: "Bank name is required",
                      })}
                    />
                    {errors.bankName && (
                      <span className="text-sm text-red-500">
                        {errors.bankName.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bankOwnerName" className="text-purple-700">
                      Bank Owner Name
                    </Label>
                    <Input
                      id="bankOwnerName"
                      placeholder="Enter bank owner name"
                      className="border-purple-200 focus:border-purple-500"
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
                      className="text-purple-700"
                    >
                      Bank Account Number
                    </Label>
                    <Input
                      id="bankAccountNumber"
                      placeholder="Enter bank account number"
                      className="border-purple-200 focus:border-purple-500"
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
                </div>
              </TabsContent>
              <TabsContent value="images">
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="avatarImage" className="text-purple-700">
                      Avatar Image
                    </Label>
                    <Input
                      id="avatarImage"
                      type="file"
                      accept="image/*"
                      alt=""
                      className="border-purple-200 focus:border-purple-500 file:bg-purple-100 file:text-purple-700 file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4 file:hover:bg-purple-200 file:transition-colors"
                      {...register("avatarImage", {
                        required: "Avatar image is required",
                      })}
                    />
                    {errors.avatarImage && (
                      <span className="text-sm text-red-500">
                        {errors.avatarImage.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coverImage" className="text-purple-700">
                      Cover Image
                    </Label>
                    <Input
                      id="coverImage"
                      type="file"
                      accept="image/*"
                      alt=""
                      className="border-purple-200 focus:border-purple-500 file:bg-purple-100 file:text-purple-700 file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4 file:hover:bg-purple-200 file:transition-colors"
                      {...register("coverImage", {
                        required: "Cover image is required",
                      })}
                    />
                    {errors.coverImage && (
                      <span className="text-sm text-red-500">
                        {errors.coverImage.message}
                      </span>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <div className="flex justify-between gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating Vendor...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Create Vendor
              </>
            )}
          </Button>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            Logout
          </Button>
        </div>
      </form>
    </div>
  );
}
