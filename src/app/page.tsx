"use client";

import { getAccessToken } from "@/utils";
import dynamic from "next/dynamic";

const AuthComponent = dynamic(() => import("./auth/page"), {
  ssr: false,
});

const DashboardComponent = dynamic(() => import("./dashboard/page"), {
  ssr: false,
});
const DashboardLayout = dynamic(() => import("./dashboard/layout"), {
  ssr: false,
});

export default function Home() {
  const token = getAccessToken();
  if (!token) {
    return <AuthComponent />;
  }
  return (
    <DashboardLayout>
      <DashboardComponent />
    </DashboardLayout>
  );
}
