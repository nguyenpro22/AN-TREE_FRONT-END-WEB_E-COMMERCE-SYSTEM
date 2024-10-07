"use client";

import dynamic from "next/dynamic";

const DashboardComponent = dynamic(() => import("./dashboard/page"), {
  ssr: false,
});
const DashboardLayout = dynamic(() => import("./dashboard/layout"), {
  ssr: false,
});

export default function Home() {
  return (
    <DashboardLayout>
      <DashboardComponent />
    </DashboardLayout>
  );
}
