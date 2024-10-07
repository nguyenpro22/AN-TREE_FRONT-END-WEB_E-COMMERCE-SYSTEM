"use client";

import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Github } from "lucide-react";

import VendorCreationForm from "@/components/Auth/VendorCreationForm";
import ForgotPasswordForm from "@/components/Auth/ForgotPasswordForm";
import LoginForm from "@/components/Auth/LoginForm";
import ColorfulButton from "@/components/Auth/ColorfulButton";
import RegisterForm from "@/components/Auth/RegisterForm";
import {
  useLazyGetVendorProfileQuery,
  useLoginMutation,
  useRegisterMutation,
} from "@/services/apis";
import { ILogin, IRegister, IUser } from "@/types";
import {
  rememberMe,
  setAccessToken,
  setRefreshToken,
  setRefreshTokenExpiryTime,
  removeCookie,
  getAccessToken,
  getRefreshToken,
} from "@/utils";
import { toast } from "react-hot-toast";
import { CookieStorageKey } from "@/constants";
import { useRouter } from "next/navigation";
import { useVendor } from "@/hooks/useVendorContext";

export default function Component() {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const router = useRouter();
  const { setVendor } = useVendor();
  const [getProfile, { data: profile }] = useLazyGetVendorProfileQuery();

  const handleLogin = async (formData: ILogin) => {
    try {
      const res = await login(formData).unwrap();

      if (!res.isSuccess) {
        throw new Error(res.error.message);
      }

      // Lưu token
      const { accessToken, refreshToken, refreshTokenExpiryTime } = res.value;
      storeTokens(accessToken, refreshToken, refreshTokenExpiryTime);

      // Xử lý tùy chọn "Remember me"
      handleRememberMe(formData.isRememberMe || false);

      // Lấy profile vendor sau khi login
      await fetchAndHandleProfile();
    } catch (error) {
      toast.error("Wrong email or password");
    }
  };

  // Tách logic lưu trữ token vào một hàm riêng
  const storeTokens = (
    accessToken: string,
    refreshToken: string,
    refreshTokenExpiryTime: string
  ) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setRefreshTokenExpiryTime(refreshTokenExpiryTime);
  };

  // Xử lý tùy chọn "Remember me"
  const handleRememberMe = (isRememberMe: boolean) => {
    if (isRememberMe) {
      rememberMe(getAccessToken() ?? "", getRefreshToken() ?? "");
    } else {
      removeCookie(CookieStorageKey.REMEMBER_ME);
    }
  };

  // Lấy và xử lý profile vendor
  const fetchAndHandleProfile = async () => {
    const profileRes = await getProfile();

    if (
      profileRes?.isError &&
      "status" in profileRes.error &&
      profileRes.error.status === 403
    ) {
      toast.error("Your account does not have permission to access");
      return;
    }

    if (profileRes?.data?.isSuccess) {
      setVendor(profileRes.data.value as IUser); // Lưu vendor profile vào context
      toast.success("Login successful");
      router.push("/dashboard");
    } else {
      setIsLoggedIn(true);
      toast.success("Login successful, please complete your profile");
    }
  };

  const handleRegister = async (formData: IRegister) => {
    try {
      const res = await register(formData).unwrap();
      if (!res.isSuccess) {
        throw new Error(res.error.message);
      }
      toast.success("Registration successful, Please login");
      setActiveTab("login");
    } catch (error) {
      toast.error("Register failed");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (isLoggedIn && !profile?.isSuccess) {
    return <VendorCreationForm handleLogout={handleLogout} />;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-[900px] overflow-hidden shadow-lg flex">
        <div className="w-1/3 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4">Seller Portal</h2>
          <p className="text-purple-100 text-lg">
            Login or create an account to access your seller dashboard.
          </p>
        </div>
        <div className="w-2/3">
          <CardContent className="p-8">
            {showForgotPassword ? (
              <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />
            ) : (
              <Tabs
                value={activeTab}
                onValueChange={(value) =>
                  setActiveTab(value as "login" | "register")
                }
                className="w-full"
              >
                <TabsList className="grid w-full h-full grid-cols-2 mb-8">
                  <TabsTrigger value="login" className="text-lg py-3">
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="register" className="text-lg py-3">
                    Register
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <LoginForm
                    onForgotPassword={() => setShowForgotPassword(true)}
                    onLoginSuccess={handleLogin}
                    isLoading={isLoginLoading}
                  />
                  <div className="mt-6">
                    <ColorfulButton
                      icon={Github}
                      label="Continue with GitHub"
                      className="from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black w-full py-3 text-lg"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="register">
                  <RegisterForm
                    handleSubmitForm={handleRegister}
                    isSubmitting={isRegisterLoading}
                  />
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
          <CardFooter className="bg-gray-50 p-6">
            <p className="text-sm text-center text-gray-600 w-full">
              By continuing, you agree to our{" "}
              <a href="#" className="text-purple-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-purple-600 hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
}
