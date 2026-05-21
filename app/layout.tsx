"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/providers/ClientProviders";
import {
  ClerkProvider,
  ClerkLoading,
  ClerkLoaded,
  SignInButton,
} from "@clerk/nextjs";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { ThemeProvider } from "@/components/ui/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import LoadingLogo from "@/components/shared/LoadingLogo";
import { Authenticated, Unauthenticated } from "convex/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "Chat App",
//   description: "Realtime chat app using NextJS",
// }

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {/* 🔄 CENTERED CLERK LOADER */}
          <ClerkLoading>
            <div className="flex h-screen w-screen items-center justify-center">
              <LoadingLogo />
            </div>
          </ClerkLoading>

          <ClerkLoaded>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {/* CLIENT PROVIDERS (Convex) */}
              <ClientProviders>
                <Authenticated>
                  <TooltipProvider>{children}</TooltipProvider>
                  <Toaster richColors />
                </Authenticated>

                <Unauthenticated>
                  <div className="flex h-screen items-center justify-center">
                    <div className="border-2 border-primary/50 bg-primary/10 p-2 rounded-lg animate-pulse">
                      <SignInButton />
                    </div>
                  </div>
                </Unauthenticated>
              </ClientProviders>
            </ThemeProvider>
          </ClerkLoaded>
        </body>
      </html>
    </ClerkProvider>
  );
}
