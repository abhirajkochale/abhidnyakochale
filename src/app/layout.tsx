import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/Cursor";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Architectural Portfolio",
  description: "A highly interactive architectural portfolio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${inter.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col selection:bg-dusk-violet selection:text-old-parchment relative">
        <Cursor />
        {children}
      </body>
    </html>
  );
}
