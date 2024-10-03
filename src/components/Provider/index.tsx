"use client";

import React from "react";
import { Provider } from "react-redux";
import store from "@/redux/store";
import { NavigationProvider } from "@/hooks/useNavigation";
import { Toaster } from "react-hot-toast";
import { VendorProvider } from "@/hooks/useVendorContext";
const ClientProvider: React.FC<{ children: React.ReactNode }> = React.memo(
  ({ children }) => {
    return (
      <Provider store={store}>
        <VendorProvider>
          <NavigationProvider>{children}</NavigationProvider>
          <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              duration: 5000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                duration: 3000,
                icon: "🚀",
              },
              error: {
                duration: 3000,
                icon: "🚨",
              },
            }}
          />
        </VendorProvider>
      </Provider>
    );
  }
);

ClientProvider.displayName = "ClientProvider";

export default ClientProvider;
