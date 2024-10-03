"use client";
import React from "react";
import { Header } from "@/components/Dashboard/Header";
import Sidebar from "@/components/Dashboard/Sidebar";
import { getAccessToken } from "@/utils";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  React.useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push("/auth");
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
