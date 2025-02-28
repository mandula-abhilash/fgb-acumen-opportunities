import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

export function Spinner({ className, size = "md", ...props }) {
  return (
    <div
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      <Loader2
        className={cn("animate-spin", {
          "h-3 w-3": size === "sm",
          "h-4 w-4": size === "md",
          "h-6 w-6": size === "lg",
          "h-8 w-8": size === "xl",
        })}
      />
    </div>
  );
}
