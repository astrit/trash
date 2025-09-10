import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Mobil miljöstation",
  description: "Built by Astrit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
