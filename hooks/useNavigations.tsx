"use client";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { MessageSquare, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

export const useNavigation = () => {
  const pathname = usePathname();

  const { isLoaded, isSignedIn } = useAuth();

  const requestsCount = useQuery(
    api.requests.count,
    isLoaded && isSignedIn ? {} : "skip"
  );

  const conversations = useQuery(api.conversations.get);

  const unseenMessagesCount = useMemo(() => {
    return conversations?.reduce((acc, curr) => {
      if (!curr.unseenCount) return acc;
      return acc + curr.unseenCount;
    }, 0);
  }, [conversations]);

  const paths = useMemo(
    () => [
      {
        name: "Conversations",
        href: "/conversations",
        icon: <MessageSquare />,
        active: pathname.startsWith("/conversations"),
        count: unseenMessagesCount,
      },
      {
        name: "Friends",
        href: "/friends",
        icon: <Users />,
        active: pathname.startsWith("/friends"),
        count: requestsCount,
      },
    ],
    [pathname, requestsCount, unseenMessagesCount]
  );

  return paths;
};
