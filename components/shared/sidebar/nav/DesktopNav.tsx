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
import { ThemeToggle } from "@/components/ui/theme/theme-toggle";
import { Badge } from "@/components/ui/badge";

const DesktopNav = () => {
  const paths = useNavigation();

  return (
    <TooltipProvider>
      <Card className="hidden lg:flex lg:flex-col lg:justify-between lg:items-center lg:h-full lg:w-16 lg:px-2 lg:py-4">
        <nav>
          <ul className="flex flex-col items-center gap-4">
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

                        {path.count ? (
                          <Badge className="absolute left-6 bottom-7 px-2">
                            {path.count}
                          </Badge>
                        ) : null}
                      </div>
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>{path.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col items-center gap-4">
          <ThemeToggle />
          <UserButton />
        </div>
      </Card>
    </TooltipProvider>
  );
};

export default DesktopNav;
