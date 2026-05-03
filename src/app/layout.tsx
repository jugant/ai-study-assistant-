import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Study Assistant | JEE Focused",
  description: "AI powered study assistant for JEE. Upload notes, generate summaries, and practice MCQs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body>
        <AuthProvider>
          <div className="ambient-background">
            <div className="ambient-blob blob-1"></div>
            <div className="ambient-blob blob-2"></div>
          </div>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
