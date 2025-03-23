"use client";

import { useState } from "react";
import { Heart, MessageSquareMore } from "lucide-react";

import { expressInterest } from "@/lib/api/liveOpportunities";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { ShortlistButton } from "@/components/opportunities/shortlist-button";

export function ActionButtons({ site }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmInterest = async () => {
    try {
      setIsSubmitting(true);
      await expressInterest(site.id);
      toast({
        title: "Success",
        description:
          "Your interest has been registered. The site owner will be notified.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.message || "Failed to register interest. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-3 border-t bg-background/95 backdrop-blur-sm">
      <div className="flex gap-2 justify-end">
        <ShortlistButton
          opportunityId={site.id}
          isShortlisted={site.is_shortlisted}
          className="w-full sm:w-[200px]"
        />
        <Button
          variant="secondary"
          className="w-full sm:w-[200px]"
          onClick={handleConfirmInterest}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Spinner size="sm" className="mr-2" />
          ) : (
            <MessageSquareMore className="h-4 w-4 mr-2" />
          )}
          {isSubmitting ? "Processing..." : "Confirm Interest"}
        </Button>
      </div>
    </div>
  );
}
