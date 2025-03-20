"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

import { addToShortlist, removeFromShortlist } from "@/lib/api/shortlists";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export function ShortlistButton({
  opportunityId,
  isShortlisted: initialShortlisted = false,
  className,
}) {
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
      variant="outline"
      className={cn(
        "flex-1 transition-colors",
        isShortlisted &&
          "bg-destructive/10 hover:bg-destructive/20 border-destructive/50 hover:border-destructive",
        className
      )}
      onClick={handleShortlistToggle}
      disabled={isLoading}
    >
      <Heart
        className={cn(
          "h-4 w-4 mr-2",
          isShortlisted && "fill-destructive text-destructive"
        )}
      />
      {isShortlisted ? "Remove from Shortlist" : "Shortlist"}
    </Button>
  );
}
