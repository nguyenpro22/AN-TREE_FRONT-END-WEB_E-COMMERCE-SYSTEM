import { IUser } from "@/types";
import React, { createContext, useContext, useState } from "react";

// 2. Tạo context
const VendorContext = createContext<
  | {
      vendor: IUser | null;
      setVendor: (vendor: IUser) => void;
    }
  | undefined
>(undefined);

// 3. Tạo provider component
export const VendorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [vendor, setVendor] = useState<IUser | null>(null);

  return (
    <VendorContext.Provider value={{ vendor, setVendor }}>
      {children}
    </VendorContext.Provider>
  );
};

// 4. Tạo hook để sử dụng context
export const useVendor = () => {
  const context = useContext(VendorContext);
  if (!context) {
    throw new Error("useVendor must be used within a VendorProvider");
  }
  return context;
};
