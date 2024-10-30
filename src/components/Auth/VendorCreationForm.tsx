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
  ImageIcon,
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
import {
  useCreateVendorMutation,
  useLazyGetVendorProfileQuery,
} from "@/services/apis";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  setAccessToken,
  setRefreshToken,
  setRefreshTokenExpiryTime,
} from "@/utils";
import { IUser } from "@/types";
import { publicRoutes } from "@/constants/route.constant";

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
  const [countdown, setCountdown] = useState(3);
  const router = useRouter();
  const [getProfile] = useLazyGetVendorProfileQuery();
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

      if (res.error) {
        if ("status" in res.error && res.error.status === 500) {
          toast.error("Vendor name already exists");
        } else {
          console.error("An unknown server error occurred:", res);
          alert("An unknown server error occurred. Please try again later.");
        }
      } else {
        // Handle success
        setIsSuccess(true);
        const { accessToken, refreshToken, refreshTokenExpiryTime } =
          res.data.value;
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setRefreshTokenExpiryTime(refreshTokenExpiryTime);

        const countdownTimer = setInterval(() => {
          setCountdown((prevCountdown) => {
            if (prevCountdown === 1) {
              clearInterval(countdownTimer);
              router.push(`${publicRoutes.AUTH}`);
            }
            return prevCountdown - 1;
          });
        }, 1000);
      }
    } catch (error) {
      console.error("Error creating vendor:", error);
    }
  };
  React.useEffect(() => {
    return () => clearTimeout(countdown);
  }, [isSuccess, countdown]);

  if (isSuccess) {
    return (
      <Alert
        variant="default"
        className="max-w-md mx-auto mt-8 bg-green-100 border-green-500 text-green-800"
      >
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>
          Đã hoàn thành tạo tài khoản vendor, chờ admin duyệt. Trở về trang đăng
          nhập sau {`${countdown}`} giây.
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
              Tạo Tài khoản Nhà cung cấp
            </CardTitle>
            <CardDescription className="text-lg text-purple-600">
              Điền thông tin chi tiết để tạo tài khoản nhà cung cấp mới.
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
                  Cá nhân
                </TabsTrigger>
                <TabsTrigger
                  value="address"
                  className="data-[state=active]:bg-white data-[state=active]:text-purple-700"
                >
                  <Building className="w-4 h-4 mr-2" />
                  Địa chỉ
                </TabsTrigger>
                <TabsTrigger
                  value="bank"
                  className="data-[state=active]:bg-white data-[state=active]:text-purple-700"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Ngân hàng
                </TabsTrigger>
                <TabsTrigger
                  value="images"
                  className="data-[state=active]:bg-white data-[state=active]:text-purple-700"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Hình ảnh
                </TabsTrigger>
              </TabsList>
              <TabsContent value="personal">
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="vendorName" className="text-purple-700">
                      Tên Nhà cung cấp
                    </Label>
                    <Input
                      id="vendorName"
                      placeholder="Nhập tên nhà cung cấp"
                      className="border-purple-200 focus:border-purple-500"
                      {...register("vendorName", {
                        required: "Tên nhà cung cấp là bắt buộc",
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
                      Email Nhà cung cấp
                    </Label>
                    <Input
                      id="vendorEmail"
                      type="email"
                      placeholder="Nhập email nhà cung cấp"
                      className="border-purple-200 focus:border-purple-500"
                      {...register("vendorEmail", {
                        required: "Email nhà cung cấp là bắt buộc",
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
                      Số điện thoại
                    </Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="Nhập số điện thoại"
                      className="border-purple-200 focus:border-purple-500"
                      {...register("phoneNumber", {
                        required: "Số điện thoại là bắt buộc",
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
                      Địa chỉ
                    </Label>
                    <Input
                      id="address"
                      placeholder="Nhập địa chỉ"
                      className="border-purple-200 focus:border-purple-500"
                      {...register("address", {
                        required: "Địa chỉ là bắt buộc",
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
                        Thành phố
                      </Label>
                      <Input
                        id="city"
                        placeholder="Nhập tên thành phố"
                        className="border-purple-200 focus:border-purple-500"
                        {...register("city", {
                          required: "Thành phố là bắt buộc",
                        })}
                      />
                      {errors.city && (
                        <span className="text-sm text-red-500">
                          {errors.city.message}
                        </span>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="province" className="text-purple-700">
                        Tỉnh
                      </Label>
                      <Input
                        id="province"
                        placeholder="Nhập tên tỉnh"
                        className="border-purple-200 focus:border-purple-500"
                        {...register("province", {
                          required: "Tỉnh là bắt buộc",
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
                      Tên ngân hàng
                    </Label>
                    <Input
                      id="bankName"
                      placeholder="Nhập tên ngân hàng"
                      className="border-purple-200 focus:border-purple-500"
                      {...register("bankName", {
                        required: "Tên ngân hàng là bắt buộc",
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
                      Tên chủ tài khoản
                    </Label>
                    <Input
                      id="bankOwnerName"
                      placeholder="Nhập tên chủ tài khoản"
                      className="border-purple-200 focus:border-purple-500"
                      {...register("bankOwnerName", {
                        required: "Tên chủ tài khoản là bắt buộc",
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
                      Số tài khoản ngân hàng
                    </Label>
                    <Input
                      id="bankAccountNumber"
                      placeholder="Nhập số tài khoản ngân hàng"
                      className="border-purple-200 focus:border-purple-500"
                      {...register("bankAccountNumber", {
                        required: "Số tài khoản ngân hàng là bắt buộc",
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
                      Ảnh đại diện
                    </Label>
                    <Input
                      id="avatarImage"
                      type="file"
                      accept="image/*"
                      alt=""
                      className="border-purple-200 focus:border-purple-500 file:bg-purple-100 file:text-purple-700 file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4 file:hover:bg-purple-200 file:transition-colors"
                      {...register("avatarImage", {
                        required: "Ảnh đại diện là bắt buộc",
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
                      Ảnh bìa
                    </Label>
                    <Input
                      id="coverImage"
                      type="file"
                      accept="image/*"
                      alt=""
                      className="border-purple-200 focus:border-purple-500 file:bg-purple-100 file:text-purple-700 file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4 file:hover:bg-purple-200 file:transition-colors"
                      {...register("coverImage", {
                        required: "Ảnh bìa là bắt buộc",
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
                Đang tạo nhà cung cấp...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Tạo nhà cung cấp
              </>
            )}
          </Button>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            Đăng xuất
          </Button>
        </div>
      </form>
    </div>
  );
}
