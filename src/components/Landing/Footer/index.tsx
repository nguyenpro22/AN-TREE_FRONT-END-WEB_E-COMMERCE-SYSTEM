import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaFacebook, FaInstagram } from "react-icons/fa";

const socialIcons = [
  {
    name: "Facebook",
    icon: FaFacebook,
    path: "https://www.facebook.com/profile.php?id=61566330902197",
  },
  {
    name: "Instagram",
    icon: FaInstagram,
    path: "https://www.instagram.com/antreefpt/",
  },
];

export default function Footer() {
  return (
    <footer className="bg-green-800 text-white mt-24 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center md:items-start">
            <Image
              src="/logo.png"
              alt="Antree Logo"
              width={120}
              height={40}
              className="mb-4"
            />
            <h3 className="text-xl font-bold mb-4">Về Chúng Tôi</h3>
            <p className="text-green-100 text-center md:text-left">
              Antree là đối tác tin cậy trong lĩnh vực cung cấp giải pháp cho
              cây trồng.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Liên Hệ</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-green-100" />
                <a
                  href="mailto:info@antree.com"
                  className="text-green-100 hover:text-white transition-colors"
                >
                  info@antree.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-green-100" />
                <a
                  href="tel:+1234567890"
                  className="text-green-100 hover:text-white transition-colors"
                >
                  (123) 456-7890
                </a>
              </li>
              <li className="flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-green-100" />
                <span className="text-green-100">
                  123 Đường ABC, Thành phố XYZ
                </span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Theo Dõi Chúng Tôi</h3>
            <div className="flex space-x-6">
              {socialIcons.map((social) => (
                <Button
                  key={social.name}
                  variant="ghost"
                  size="icon"
                  asChild
                  className="text-green-100 hover:text-white hover:bg-green-700 transition-colors "
                >
                  <Link
                    href={social.path}
                    aria-label={`Follow us on ${social.name}`}
                  >
                    <social.icon style={{ height: "50px", width: "50px" }} />{" "}
                    {/* Set explicit size */}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-green-700 text-center">
          <p className="text-green-100">
            &copy; {new Date().getFullYear()} Antree. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
