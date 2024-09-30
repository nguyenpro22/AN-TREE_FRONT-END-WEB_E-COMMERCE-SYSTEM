import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import VendorCreationForm from "./VendorCreationForm";

const AuthCard: React.FC = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (isLoggedIn) {
    return (
      <Card className="w-[450px] overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <CardTitle className="text-2xl">Create Vendor</CardTitle>
          <CardDescription className="text-purple-100">
            Set up your vendor account
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <VendorCreationForm />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-[450px] overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardTitle className="text-2xl">Seller Portal</CardTitle>
        <CardDescription className="text-purple-100">
          Login or create an account
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {showForgotPassword ? (
          <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />
        ) : (
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="text-lg">
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="text-lg">
                Register
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm onForgotPassword={() => setShowForgotPassword(true)} />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      <CardFooter className="bg-gray-50 p-4">
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
    </Card>
  );
};

export default AuthCard;
