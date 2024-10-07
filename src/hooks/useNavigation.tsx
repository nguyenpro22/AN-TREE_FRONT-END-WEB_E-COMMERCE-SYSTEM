import React, { createContext, useState, useContext, useEffect } from "react";
import { usePathname } from "next/navigation";

type NavigationContextType = {
  currentPage: string;
  setCurrentPage: (page: string) => void;
};

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

// Hàm để viết hoa chữ cái đầu tiên
const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState(() => {
    const pathParts = pathname.split("/");
    const lastPart = pathParts[pathParts.length - 1] || "dashboard";
    return capitalizeFirstLetter(lastPart);
  });

  useEffect(() => {
    const pathParts = pathname.split("/");
    const lastPart = pathParts[pathParts.length - 1] || "dashboard";
    setCurrentPage(capitalizeFirstLetter(lastPart));
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
