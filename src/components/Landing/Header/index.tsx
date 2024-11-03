"use client";

import { useState } from "react";
import { Mail, Menu, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-green-50">
      <div className="bg-green-100 py-2">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
            <Phone size={20} className="text-green-600" />
            <a
              href="tel:+012345678"
              className="text-green-700 hover:text-green-900 hover:underline transition-colors duration-300"
            >
              012345678
            </a>
          </div>
          <div className="flex items-center space-x-2">
            <Mail size={20} className="text-green-600" />
            <a
              href="mailto:antree.team@gmail.com"
              className="text-green-700 hover:text-green-900 hover:underline transition-colors duration-300"
            >
              antree.team@gmail.com
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="Antree"
              width={32}
              height={32}
              className="text-green-600"
            />
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
          </nav>
          <div className="hidden md:flex items-center space-x-6">
            <Button
              variant="outline"
              className="bg-white text-green-600 border-green-600 hover:bg-green-600 hover:text-white transition-colors"
              onClick={() =>
                window.open(
                  "https://drive.google.com/file/d/1_8iDAMBbPTYKQk0dzz3f9lcdBUWxIqMz/view?usp=drive_link",
                  "_blank"
                )
              }
            >
              Tải ứng dụng
            </Button>
          </div>
          <button
            onClick={toggleMenu}
            className="md:hidden text-green-700 hover:text-green-900 transition-colors"
            aria-label={isMenuOpen ? "Đóng menu" : "Mở menu"}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
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
            <Button
              variant="outline"
              className="w-full bg-white text-green-600 border-green-600 hover:bg-green-600 hover:text-white transition-colors"
              onClick={() =>
                window.open(
                  "https://drive.google.com/file/d/1zZU77xjsOA7eJhaoZPzcYN_U69LxAgRk/view?usp=sharing",
                  "_blank"
                )
              }
            >
              Tải ứng dụng
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
