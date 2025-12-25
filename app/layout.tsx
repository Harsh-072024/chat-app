import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/providers/ClientProviders"
import { SignedIn, SignedOut, SignIn, ClerkProvider, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { ThemeProvider } from "@/components/ui/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import LoadingLogo from "@/components/shared/LoadingLogo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chat App",
  description: "Realtime chat app using NextJS",
}

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
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
              <SignedIn>
                <TooltipProvider>{children}</TooltipProvider>
                <Toaster richColors />
              </SignedIn>

              <SignedOut>
                <div className="flex h-screen items-center justify-center">
                  <SignIn afterSignInUrl="/" />
                </div>
              </SignedOut>
            </ClientProviders>
          </ThemeProvider>
          </ClerkLoaded>
        </body>
      </html>
    </ClerkProvider>
  );
}
