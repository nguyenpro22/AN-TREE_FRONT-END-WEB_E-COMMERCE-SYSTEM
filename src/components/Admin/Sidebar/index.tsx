"use client";

import React, { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Settings,
  BarChart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigation } from "@/hooks/useNavigation";
import { adminRoutes } from "@/constants/route.constant";
import { IAdmin } from "@/types";
import { RootState } from "@/redux/store";
import { shallowEqual, useSelector } from "react-redux";
import { useGetAdminProfileQuery } from "@/services/apis";

// Move outside component to prevent recreation on each render
const sidebarItems = [
  {
    href: adminRoutes.DASHBOARD,
    icon: LayoutDashboard,
    label: "Dashboard",
    color: "text-blue-500",
  },
  {
    href: adminRoutes.ORDERS,
    icon: ShoppingCart,
    label: "Orders",
    color: "text-green-500",
  },
  {
    href: adminRoutes.VENDORS,
    icon: Users,
    label: "Vendors",
    color: "text-yellow-500",
  },
  {
    href: adminRoutes.APPROVAL,
    icon: Settings,
    label: "Approval",
    color: "text-purple-500",
  },
  {
    href: adminRoutes.TRANSACTION,
    icon: BarChart,
    label: "Transaction",
    color: "text-blue-500",
  },
] as const; // Make array readonly

export default function AdminSidebar() {
  // Memoize state changes
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { currentPage, setCurrentPage } = useNavigation();

  const { data: adminData, isLoading } = useGetAdminProfileQuery();

  // Skip re-renders if admin data hasn't changed
  const admin = useSelector(
    (state: RootState) => state.admin.admin,
    shallowEqual
  ) as IAdmin;
  console.log(admin);

  // Memoize click handler
  const handleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  // Memoize sidebar items rendering
  const renderSidebarItems = useMemo(
    () =>
      sidebarItems.map((item) => (
        <li key={item.href}>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start transition-all hover:bg-gray-100",
              currentPage === item.label && "bg-gray-100 font-semibold",
              isCollapsed && "justify-center"
            )}
            onClick={() => setCurrentPage(item.label)}
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
      )),
    [currentPage, isCollapsed, setCurrentPage]
  );

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
            Admin Panel
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCollapse}
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
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div>
              <p className="text-sm font-medium">
                {admin?.firstname} {admin?.lastname}
              </p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2">
        <ul className="space-y-2">{renderSidebarItems}</ul>
      </nav>
    </div>
  );
}
