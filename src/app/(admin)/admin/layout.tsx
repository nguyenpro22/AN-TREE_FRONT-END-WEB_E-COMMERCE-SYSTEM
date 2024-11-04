import React from "react";
import AdminLayoutClient from "@/layouts/AdminLayout";
import { getAccessToken } from "@/utils";
import { redirect } from "next/navigation";
import { publicRoutes } from "@/constants/route.constant";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = getAccessToken();

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
