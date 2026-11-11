
import type { Metadata } from "next";
import { Suspense } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { AuthProvider } from "@/context/AuthContext";
import { DataProvider } from "@/context/DataContext";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "EduBridge | School Admission System",
    template: "%s | EduBridge",
  },

  description:
    "Explore school programs, admission circulars and apply online through our School Admission System.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const googleClientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

  return (
    <html lang="en">
      <body>
        <GoogleOAuthProvider clientId={googleClientId}>
          <AuthProvider>
            <DataProvider>
              <Suspense fallback={<div className="h-[78px]" />}>
                <Navbar />
              </Suspense>

              {children}

              <Footer />
            </DataProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
