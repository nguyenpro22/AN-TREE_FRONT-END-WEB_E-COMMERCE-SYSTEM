"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Tags,
  BarChart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigation } from "@/hooks/useNavigation";

const sidebarItems = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    color: "text-blue-500",
  },
  {
    href: "/dashboard/orders",
    icon: ShoppingCart,
    label: "Orders",
    color: "text-green-500",
  },
  {
    href: "/dashboard/products",
    icon: Package,
    label: "Products",
    color: "text-yellow-500",
  },
  {
    href: "/dashboard/discounts",
    icon: Tags,
    label: "Discounts",
    color: "text-purple-500",
  },
  {
    href: "/dashboard/revenue",
    icon: BarChart,
    label: "Revenue",
    color: "text-red-500",
  },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { currentPage, setCurrentPage } = useNavigation();

  return (
    <div
      className={cn(
        "flex h-screen flex-col border-r bg-gradient-to-b from-gray-50 to-white transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!isCollapsed && (
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            Seller Hub
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="flex-shrink-0 p-4">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div>
              <p className="text-sm font-medium">Sarah Connor</p>
              <p className="text-xs text-gray-500">Premium Seller</p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2">
        <ul className="space-y-2">
          {sidebarItems.map((item) => (
            <li key={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start transition-all hover:bg-gray-100",
                  currentPage === item.label && "bg-gray-100 font-semibold",
                  isCollapsed && "justify-center"
                )}
                onClick={() => {
                  setCurrentPage(item.label);
                }}
                asChild
              >
                <Link href={item.href}>
                  <item.icon
                    className={cn(
                      "h-5 w-5",
                      item.color,
                      isCollapsed ? "mr-0" : "mr-2"
                    )}
                  />
                  {!isCollapsed && item.label}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex-shrink-0 p-4">
        <div
          className={cn(
            "rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 p-4 text-white",
            isCollapsed && "p-2"
          )}
        >
          {isCollapsed ? (
            <BarChart className="h-6 w-6 mx-auto" />
          ) : (
            <>
              <p className="font-semibold">Sales Boost</p>
              <p className="text-sm">Your sales increased by 24% this week!</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
