"use client";

import { Provider } from "react-redux";
import store from "@/redux/store";
import { NavigationProvider } from "@/hooks/useNavigation";
// import { SessionProvider, useSession } from "next-auth/react";

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <NavigationProvider>{children}</NavigationProvider>
      {/* <SessionProvider></SessionProvider> */}
    </Provider>
  );
}
