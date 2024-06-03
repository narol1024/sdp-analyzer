import type { Metadata } from "next";
import { NextUIProvider } from "@nextui-org/system";
import "./globals.css";

export const metadata: Metadata = {
  title: "SDP-Analyzer",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NextUIProvider>{children}</NextUIProvider>
      </body>
    </html>
  );
}
