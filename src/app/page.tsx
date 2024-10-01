"use client";

import dynamic from "next/dynamic";

const AuthComponent = dynamic(() => import("./auth/page"), { ssr: false });

export default function Home() {
  return <AuthComponent />;
}
