"use client";
import React from "react";
import { getAccessToken } from "@/utils";
import { redirect, useRouter } from "next/navigation";
import { AdminHeader } from "@/components/Admin/Header";
import AdminSidebar from "@/components/Admin/Sidebar";

export default function AdminLayoutClient({
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
  }, [router]);

  // if (isAdmin) {
  //   redirect(adminRoutes.DASHBOARD);
  // } else {
  //   redirect(sellerRoutes.DASHBOARD);
  // }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="mx-auto px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
