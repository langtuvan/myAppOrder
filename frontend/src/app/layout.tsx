import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { CartHydration } from "@/components/CartHydration";
import { fetchCategories, fetchProducts } from "@/actions/fetchData";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Booking Coffee",
  description: "A comprehensive coffee shop management system built with NestJS and Next.js, featuring inventory management, order processing, and customer relationship management.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [] = await Promise.all([fetchProducts(), fetchCategories()]);
  return (
    <html lang="en" className="" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} `}>
        <CartHydration />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
