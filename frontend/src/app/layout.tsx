import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fibo Orchestra",
  description: "JSON-native visual generation console",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
