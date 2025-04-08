import React from "react";
import "./globals.css";
import { Metadata } from "next";
import { Open_Sans } from "next/font/google";

export const metadata: Metadata = {
  title: "Dr. Jonathan Thomson - Medical Practice",
  description: "World-class medical expertise at your service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="font-sans">
      <body className="font-sans">{children}</body>
    </html>
  );
}
