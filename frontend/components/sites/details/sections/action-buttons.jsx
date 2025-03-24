"use client";

import { useState } from "react";
import { useAuth } from "@/visdak-auth/src/hooks/useAuth";
import { MessageSquareMore } from "lucide-react";

import { expressInterest } from "@/lib/api/liveOpportunities";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { ShortlistButton } from "@/components/opportunities/shortlist-button";

export function ActionButtons({ opportunity, onRemove, className }) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canConfirmInterest = user?.role === "admin" || user?.role === "buyer";

  const handleConfirmInterest = async () => {
    try {
      setIsSubmitting(true);
      await expressInterest(opportunity.id);
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
    <TooltipProvider>
      <div className={className}>
        <Tooltip>
          <TooltipTrigger asChild>
            <ShortlistButton
              opportunityId={opportunity.id}
              isShortlisted={opportunity.is_shortlisted}
              onRemove={onRemove}
              className="flex-1 min-w-[200px] border hover:bg-web-orange/5 h-8 text-sm"
            />
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Add this site to your shortlisted opportunities</p>
          </TooltipContent>
        </Tooltip>

        {canConfirmInterest && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="flex-1 min-w-[200px] bg-web-orange hover:bg-web-orange/90 text-white h-8 text-sm"
                onClick={handleConfirmInterest}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Spinner size="sm" className="mr-1.5" />
                ) : (
                  <MessageSquareMore className="h-3 w-3 mr-1.5" />
                )}
                {isSubmitting ? "Processing..." : "Confirm Interest"}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>We will inform the seller that you are interested</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
