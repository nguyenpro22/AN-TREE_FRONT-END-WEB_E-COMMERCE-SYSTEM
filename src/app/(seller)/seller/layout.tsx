import React from "react";
import SellerLayoutClient from "@/layouts/SellerLayout";
import { getAccessToken } from "@/utils";
import { redirect } from "next/navigation";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SellerLayoutClient>{children}</SellerLayoutClient>;
}
