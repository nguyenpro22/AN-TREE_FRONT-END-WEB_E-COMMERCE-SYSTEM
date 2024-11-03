import type { Metadata } from "next";
import "./globals.css";
import ClientProvider from "@/components/Provider";

export const metadata: Metadata = {
  title: "AnTree",
  description: "Production by AnTree team",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <ClientProvider>{children}</ClientProvider>
      </body>
    </html>
  );
}
