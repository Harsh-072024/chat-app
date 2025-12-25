"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigation } from "@/hooks/useNavigations";
import { UserButton } from "@clerk/clerk-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import React from "react";
import { useConversation } from "@/hooks/useConversations";
import { ThemeToggle } from "@/components/ui/theme/theme-toggle";
import { Badge } from "@/components/ui/badge";

const MobileNav = () => {
  const paths = useNavigation();
  
  const {isActive} = useConversation();

  if(isActive) return null;

  return (
    <TooltipProvider>
      <Card className="fixed bottom-4 w-[calc(100vw-32px)] flex items-center h-16 p-2 lg:hidden">
        <nav className="w-full">
          <ul className="flex justify-evenly items-center ">
            {paths.map((path, id) => (
              <li key={id} className="relative">
                <Link href={path.href}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative">
                      <Button
                        size="icon"
                        variant={path.active ? "default" : "outline"}
                      >
                        {path.icon}
                      </Button>
                      {path.count ?<Badge className="absolute left-7 bottom-6">{path.count}</Badge> : null}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{path.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </Link>
              </li>
            ))}
            <li>
                <ThemeToggle />
            </li>
            <li>
              <UserButton />
            </li>
          </ul>
        </nav>
      </Card>
    </TooltipProvider>
  );
};

export default MobileNav;
