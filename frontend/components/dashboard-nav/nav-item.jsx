import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function NavItem({ item, isActive, isCollapsed }) {
  const Icon = item.icon;

  const activeStyle =
    "bg-havelock-blue/10 text-havelock-blue hover:bg-havelock-blue/20 font-semibold";
  const defaultStyle =
    "text-foreground hover:bg-accent hover:text-accent-foreground";

  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-center",
                  isActive ? activeStyle : defaultStyle
                )}
                size="icon"
              >
                <Icon
                  className={cn("h-4 w-4", isActive && "text-havelock-blue")}
                />
                <span className="sr-only">{item.label}</span>
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{item.label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Link href={item.href}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start h-9 px-2",
          isActive ? activeStyle : defaultStyle
        )}
      >
        <Icon
          className={cn("h-4 w-4 mr-2", isActive && "text-havelock-blue")}
        />
        {item.label}
      </Button>
    </Link>
  );
}
