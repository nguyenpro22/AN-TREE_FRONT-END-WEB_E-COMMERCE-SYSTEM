"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import logo from "@/../public/logo.png";
import Image from "next/image";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-green-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Image src={logo} alt="Antree" className="h-8 w-8 text-green-600" />
          <span className="text-2xl font-bold text-green-800">Antree</span>
        </div>

        <nav className="hidden md:flex space-x-6">
          <Link
            href="/"
            className="text-green-700 hover:text-green-900 transition-colors"
          >
            Trang chủ
          </Link>
          <Link
            href="/about"
            className="text-green-700 hover:text-green-900 transition-colors"
          >
            Về chúng tôi
          </Link>
          <Link
            href="/services"
            className="text-green-700 hover:text-green-900 transition-colors"
          >
            Dịch vụ
          </Link>
          <Link
            href="/contact"
            className="text-green-700 hover:text-green-900 transition-colors"
          >
            Liên hệ
          </Link>
        </nav>

        <div className="hidden md:block">
          <Button
            variant="outline"
            className="bg-white text-green-600 border-green-600 hover:bg-green-600 hover:text-white transition-colors"
            onClick={() => {
              window.open(
                "https://drive.google.com/file/d/1_8iDAMBbPTYKQk0dzz3f9lcdBUWxIqMz/view?usp=drive_link",
                "_blank"
              );
            }}
          >
            Bắt Đầu
          </Button>
        </div>

        <button
          onClick={toggleMenu}
          className="md:hidden text-green-700 hover:text-green-900 transition-colors"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
          <span className="sr-only">
            {isMenuOpen ? "Đóng menu" : "Mở menu"}
          </span>
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-green-50 py-4">
          <nav className="container mx-auto px-4 flex flex-col space-y-4">
            <Link
              href="/"
              className="text-green-700 hover:text-green-900 transition-colors"
            >
              Trang chủ
            </Link>
            <Link
              href="/about"
              className="text-green-700 hover:text-green-900 transition-colors"
            >
              Về chúng tôi
            </Link>
            <Link
              href="/services"
              className="text-green-700 hover:text-green-900 transition-colors"
            >
              Dịch vụ
            </Link>
            <Link
              href="/contact"
              className="text-green-700 hover:text-green-900 transition-colors"
            >
              Liên hệ
            </Link>
            <Button
              variant="outline"
              className="w-full bg-white text-green-600 border-green-600 hover:bg-green-600 hover:text-white transition-colors"
            >
              Bắt Đầu
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
