"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Rss } from "lucide-react";

import { publishSite } from "@/lib/api/liveOpportunities";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

export function AdminControls({ site, onSiteUpdated }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      await publishSite(site.id);

      toast({
        title: "Success",
        description: "Site published successfully",
      });

      // Update the site data in the parent component
      if (onSiteUpdated) {
        onSiteUpdated({ ...site, status: "published" });
      }

      setIsPublishDialogOpen(false);
    } catch (error) {
      console.error("Error publishing site:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to publish site. Please try again.",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  if (site.status !== "draft") {
    return null;
  }

  return (
    <>
      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex-1">
          <h3 className="text-sm font-medium">Admin Controls</h3>
          <p className="text-sm mt-2 text-muted-foreground">
            This site is currently in draft status
          </p>
        </div>
        <Button
          onClick={() => setIsPublishDialogOpen(true)}
          className="text-web-orange border border-web-orange bg-background hover:bg-background hover:text-web-orange/75 shadow-lg"
        >
          <Rss className="h-4 w-4 mr-2" />
          Publish Site
        </Button>
      </div>

      <Dialog open={isPublishDialogOpen} onOpenChange={setIsPublishDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publish Site</DialogTitle>
            <DialogDescription>
              Are you sure you want to publish this site? This will make it
              visible to all buyers.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPublishDialogOpen(false)}
              disabled={isPublishing}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePublish}
              disabled={isPublishing}
              className="bg-web-orange hover:bg-web-orange/90 text-white"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Publish Site
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
