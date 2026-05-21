"use client";

import { Authenticated, AuthLoading, ConvexReactClient, useMutation } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth, useUser } from "@clerk/nextjs";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

type Props = {
  children: React.ReactNode;
};

export default function ClientProviders({ children }: Props) {
  
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
      
    </ConvexProviderWithClerk>
  );
}
