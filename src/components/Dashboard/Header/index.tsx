"use client";

import React, { useEffect, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Settings, LogOut, User } from "lucide-react";
import { useNavigation } from "@/hooks/useNavigation";
import { useRouter } from "next/navigation";
import {
  useLazyGetVendorProfileQuery,
  useLogoutMutation,
} from "@/services/apis";
import { clearToken } from "@/utils";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setVendor } from "@/redux/store/slices/vendorSlice";
import { sellerRoutes } from "@/constants/route.constant";

export function Header() {
  const { currentPage } = useNavigation();
  const router = useRouter();
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const [getVendor] = useLazyGetVendorProfileQuery();
  const vendor = useSelector((state: RootState) => state.vendor.vendor);

  useEffect(() => {
    if (!vendor) {
      getVendor().then((res) => {
        if (res.data?.isSuccess) dispatch(setVendor(res.data.value));
      });
    }
  }, [vendor, getVendor, dispatch]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      toast.success("Đăng xuất thành công");
      clearToken();
      router.push("/auth");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }, [logout, router]);

  return (
    <header className="bg-gradient-to-r h-16 from-gray-50 to-white border-b px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          {currentPage}
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border-2 border-blue-500">
                <AvatarImage src={vendor?.avatarImage} alt="@seller" />
                <AvatarFallback>SE</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {vendor?.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {vendor?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push(`${sellerRoutes.PROFILE}`)}
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
