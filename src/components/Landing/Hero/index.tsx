"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Store, Search } from "lucide-react";
import { publicRoutes } from "@/constants/route.constant";

const Parallax = dynamic(
  () => import("react-parallax").then((mod) => mod.Parallax),
  { ssr: false }
);

const Onclick = {
  buyer: {
    name: "Tìm cây cảnh phù hợp",
    href: "https://drive.google.com/file/d/1_8iDAMBbPTYKQk0dzz3f9lcdBUWxIqMz/view?usp=drive_link",
  },
  seller: {
    name: "Đăng ký cửa hàng",
    href: `${publicRoutes.AUTH}`,
  },
};

export default function Hero() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
        </div>
      }
    >
      <Parallax
        blur={{ min: -15, max: 15 }}
        bgImage="https://images.unsplash.com/photo-1466781783364-36c955e42a7f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
        bgImageAlt="Cây xanh trong nhà"
        strength={200}
      >
        <section className="relative min-h-screen flex items-center justify-center px-4 py-20 md:py-40">
          <div className="absolute inset-0 bg-black bg-opacity-15"></div>
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              Kết Nối Người Yêu Cây với Tinh Hoa của Thiên Nhiên
            </h1>
            <p className="text-lg md:text-xl text-white mb-10 max-w-2xl mx-auto drop-shadow-md">
              Antree là sàn giao dịch hàng đầu kết nối những người yêu cây, các
              cửa hàng chuyên nghiệp và đa dạng các loại cây cảnh tuyệt đẹp.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                asChild
                size="lg"
                className="bg-green-600 hover:bg-green-700 transition-colors"
              >
                <Link href={Onclick.buyer.href}>
                  <Search className="mr-2 h-5 w-5" />
                  {Onclick.buyer.name}
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-white bg-opacity-10 backdrop-blur-md border-white text-white hover:bg-green-600 hover:text-white transition-colors"
              >
                <Link href={Onclick.seller.href}>
                  <Store className="mr-2 h-5 w-5" />
                  {Onclick.seller.name}
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </Parallax>
    </Suspense>
  );
}
