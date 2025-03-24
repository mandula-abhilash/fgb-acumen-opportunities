"use client";

import { forwardRef, useState } from "react";
import { Heart } from "lucide-react";

import { addToShortlist, removeFromShortlist } from "@/lib/api/shortlists";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const ShortlistButton = forwardRef(function ShortlistButton(
  {
    opportunityId,
    isShortlisted: initialShortlisted = false,
    className,
    onRemove,
  },
  ref
) {
  const { toast } = useToast();
  const [isShortlisted, setIsShortlisted] = useState(initialShortlisted);
  const [isLoading, setIsLoading] = useState(false);

  const handleShortlistToggle = async () => {
    try {
      setIsLoading(true);
      if (isShortlisted) {
        await removeFromShortlist(opportunityId);
        toast({
          title: "Success",
          description: "Removed from shortlist",
        });

        if (onRemove) {
          onRemove(opportunityId);
        }
      } else {
        await addToShortlist(opportunityId);
        toast({
          title: "Success",
          description: "Added to shortlist",
        });
      }
      setIsShortlisted(!isShortlisted);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update shortlist",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      ref={ref}
      variant="outline"
      className={cn(
        "border-2 hover:bg-accent",
        isShortlisted
          ? "border-web-orange text-web-orange hover:text-web-orange hover:border-web-orange/90"
          : "border-muted-foreground/20 hover:border-web-orange hover:text-web-orange",
        className
      )}
      onClick={handleShortlistToggle}
      disabled={isLoading}
    >
      <Heart
        className={cn(
          "h-4 w-4 mr-2",
          isShortlisted && "fill-web-orange text-web-orange"
        )}
      />
      {isShortlisted ? "Remove from Shortlist" : "Shortlist"}
    </Button>
  );
});

export { ShortlistButton };
