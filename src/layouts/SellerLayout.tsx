"use client";
import React from "react";
import { Header } from "@/components/Dashboard/Header";
import Sidebar from "@/components/Dashboard/Sidebar";
import { getAccessToken } from "@/utils";
import { useRouter } from "next/navigation";
import { publicRoutes } from "@/constants/route.constant";

export default function SellerLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  React.useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push(publicRoutes.AUTH);
    }
  }, [router]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
