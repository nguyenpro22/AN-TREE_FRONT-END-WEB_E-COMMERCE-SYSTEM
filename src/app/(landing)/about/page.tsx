"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Book,
  ArrowRight,
  ShoppingBag,
  CalendarDays,
  Sprout,
  Trees,
  Droplet,
  Menu,
  X,
} from "lucide-react";
import Header from "@/components/Landing/Header";
import Footer from "@/components/Landing/Footer";

const services = [
  {
    icon: <Book size={60} className="mb-4 text-green-600" />,
    title: "Giải Pháp Cây Trồng",
    description: "Chia sẻ kiến thức và giải pháp dinh dưỡng cho cây trồng.",
    link: "#",
  },
  {
    icon: <ShoppingBag size={60} className="mb-4 text-green-600" />,
    title: "Cửa Hàng",
    description: "Cung cấp các sản phẩm chất lượng cao cho cây trồng.",
    link: "#",
  },
  {
    icon: <CalendarDays size={60} className="mb-4 text-green-600" />,
    title: "Đặt Lịch Hẹn",
    description: "Đặt lịch tư vấn trực tiếp với chuyên gia của chúng tôi.",
    link: "#",
  },
];

const whyChooseUs = [
  {
    icon: <Sprout className="w-12 h-12 text-green-600" />,
    title: "Đồng Hành",
    description: "Luôn đồng hành và giúp đỡ bạn về mặt kỹ thuật...",
  },
  {
    icon: <Trees className="w-12 h-12 text-green-600" />,
    title: "Chất Lượng",
    description: "Cam kết cung cấp sản phẩm chất lượng cao...",
  },
  {
    icon: <Droplet className="w-12 h-12 text-green-600" />,
    title: "Hiệu Quả",
    description: "Mang lại hiệu quả tối ưu cho cây trồng của bạn...",
  },
];

const galleryImages = [
  "/gallery_image1.jpg",
  "/gallery_image2.jpg",
  "/gallery_image3.jpg",
  "/gallery_image4.jpg",
  "/gallery_image5.jpg",
  "/gallery_image6.jpg",
];

export default function About() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "services", "reasons", "gallery"];
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (currentSection) setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-white shadow-lg absolute top-16 left-0 right-0 z-40"
        >
          {["Trang chủ", "Dịch vụ", "Về chúng tôi", "Liên hệ"].map(
            (item, index) => (
              <Link
                key={index}
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="block py-2 px-4 text-lg text-gray-600 hover:bg-green-50 hover:text-green-700"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </Link>
            )
          )}
        </motion.div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section id="hero" className="mb-24">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl">
            <Image
              src="/highlight_image.png"
              alt="Hero background"
              width={1200}
              height={600}
              className="object-cover w-full h-[600px]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-transparent flex items-center">
              <div className="p-8 sm:p-12 md:p-16 lg:p-20 xl:p-24 w-full md:w-2/3 lg:w-1/2">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white leading-tight"
                >
                  Là Đối Tác Tin Cậy Của Quý Khách
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mb-8 text-xl text-green-100 leading-relaxed"
                >
                  Thiên nhiên luôn luôn đem lại cho chúng ta một cảm giác dễ
                  chịu và gần gũi. Chúng tôi cam kết mang đến những giải pháp
                  tốt nhất cho cây trồng của bạn.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Button
                    onClick={() => router.push("#")}
                    className="bg-white text-green-700 hover:bg-green-50 text-lg px-8 py-3 rounded-full transition-colors duration-300 shadow-md hover:shadow-lg"
                  >
                    LIÊN HỆ NGAY
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="mb-24">
          <h2 className="text-4xl font-bold mb-12 text-center text-green-800">
            Dịch Vụ Của Chúng Tôi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                  <CardContent className="p-8 flex flex-col items-center text-center relative">
                    <div className="mb-6 bg-green-100 p-4 rounded-full z-10 relative">
                      {service.icon}
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 text-green-700 relative z-10">
                      {service.title}
                    </h3>
                    <p className="mb-6 text-gray-600 relative z-10">
                      {service.description}
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => router.push(service.link)}
                      className="text-green-600 border-green-600 hover:bg-green-50 relative z-10"
                    >
                      Xem thêm <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <div className="absolute inset-0 bg-gradient-to-t from-green-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Reasons Section */}
        <section id="reasons" className="mb-24">
          <div className="bg-white rounded-3xl p-12 shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 opacity-50" />
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-12 text-center text-green-800">
                Lý Do Chọn Antree?
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1">
                  <Image
                    src="/plant_image.jpg"
                    alt="Plant"
                    width={700}
                    height={500}
                    className="rounded-2xl shadow-2xl object-cover"
                  />
                </div>
                <div className="order-1 lg:order-2 space-y-8">
                  {whyChooseUs.map((reason, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-start space-x-6 bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="flex-shrink-0 bg-green-100 p-3 rounded-full">
                        {reason.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-semibold mb-2 text-green-700">
                          {reason.title}
                        </h3>
                        <p className="text-gray-600">{reason.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery">
          <h2 className="text-4xl font-bold mb-12 text-center text-green-800">
            Hình Ảnh Về Chúng Tôi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((src, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative overflow-hidden rounded-2xl shadow-lg group cursor-pointer"
              >
                <Image
                  src={src}
                  alt={`Gallery Image ${index + 1}`}
                  width={700}
                  height={400}
                  className="object-cover w-full h-64 transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button
                    variant="secondary"
                    className="text-white bg-transparent border-white hover:bg-white hover:text-green-700"
                  >
                    Xem chi tiết
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
