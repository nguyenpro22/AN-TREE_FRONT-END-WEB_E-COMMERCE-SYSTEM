"use client";

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
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import VendorCreationForm from "@/components/Auth/VendorCreationForm";
import ForgotPasswordForm from "@/components/Auth/ForgotPasswordForm";
import LoginForm from "@/components/Auth/LoginForm";
import ColorfulButton from "@/components/Auth/ColorfulButton";
import RegisterForm from "@/components/Auth/RegisterForm";

const AuthenticationSystem: React.FC = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    // Simulating a successful login
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

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
        <CardFooter className="bg-gray-50 p-4">
          <Button onClick={handleLogout} className="w-full">
            Logout
          </Button>
        </CardFooter>
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
              <LoginForm
                onForgotPassword={() => setShowForgotPassword(true)}
                onLoginSuccess={handleLogin}
              />
              <div className="mt-4">
                <ColorfulButton
                  icon={Github}
                  label="Continue with GitHub"
                  className="from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black"
                />
              </div>
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

export default AuthenticationSystem;
