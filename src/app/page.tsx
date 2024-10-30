"use client";

import dynamic from "next/dynamic";

const LandingPage = dynamic(() => import("@/app/(landing)/landing/page"), {
  ssr: false,
});

export default function Home() {
  return <LandingPage />;
}
