"use client";

import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { OpportunityDetails } from "@/components/explore/opportunity-details";

export function OpportunitySidebar({
  opportunity,
  isOpen,
  onClose,
  isLoading,
}) {
  return (
    <div
      className={cn(
        "absolute top-0 left-0 h-full w-full lg:w-[450px] bg-background/95 backdrop-blur-sm transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="h-full p-0 border-0 shadow-none bg-transparent">
          <DialogTitle className="sr-only">Site Details</DialogTitle>
          <DialogDescription className="sr-only">
            Detailed information about the selected site
          </DialogDescription>
          <div className="relative h-full">
            <div className="absolute top-4 right-4 z-10">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/80"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close sidebar</span>
              </Button>
            </div>

            <div className="h-full">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Spinner size="lg" className="text-web-orange" />
                </div>
              ) : opportunity ? (
                <OpportunityDetails opportunity={opportunity} />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Select a location to view details
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
