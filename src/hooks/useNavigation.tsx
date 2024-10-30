import React, { createContext, useState, useContext, useEffect } from "react";
import { usePathname } from "next/navigation";
import { sellerRoutes, adminRoutes } from "@/constants/route.constant";

type NavigationContextType = {
  currentPage: string;
  setCurrentPage: (page: string) => void;
};

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

// Helper function to get the page title from the route
const getPageTitle = (pathname: string): string => {
  const allRoutes = { ...sellerRoutes, ...adminRoutes };
  const route = Object.entries(allRoutes).find(
    ([_, path]) => path === pathname
  );
  if (route) {
    return route[0]
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
  return "Dashboard"; // Default title
};

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState(() => getPageTitle(pathname));

  useEffect(() => {
    setCurrentPage(getPageTitle(pathname));
  }, [pathname]);

  return (
    <NavigationContext.Provider value={{ currentPage, setCurrentPage }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};
