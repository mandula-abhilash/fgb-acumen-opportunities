"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/visdak-auth/src/hooks/useAuth";
import { ArrowLeft } from "lucide-react";

import { getLiveOpportunitySite } from "@/lib/api/liveOpportunities";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { PageHeader } from "@/components/layout/page-header";
import { EditSiteForm } from "@/components/sites/edit/edit-site-form";

export default function EditSitePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [site, setSite] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    const fetchSite = async () => {
      try {
        setLoading(true);
        const response = await getLiveOpportunitySite(params.id);

        // Check if user has permission to edit this site
        if (user?.role !== "admin" && user?.id !== response.data.user_id) {
          toast({
            variant: "destructive",
            title: "Access Denied",
            description: "You don't have permission to edit this site.",
          });
          router.push("/dashboard/opportunities");
          return;
        }
        console.log(JSON.stringify(response.data, null, 2));
        setSite(response.data);
      } catch (error) {
        console.error("Error fetching site:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch site details",
        });
        router.push("/dashboard/opportunities");
      } finally {
        setLoading(false);
      }
    };

    if (params.id && user) {
      fetchSite();
    }
  }, [params.id, user, toast, router]);

  if (loading || authLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Spinner size="lg" className="text-web-orange" />
      </div>
    );
  }

  if (!user || !site) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <PageHeader title="Edit Site">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={() =>
                  router.push(`/dashboard/opportunities/${site.id}`)
                }
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline-block sm:ml-2">Back</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Return to site details</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </PageHeader>

      <div className="flex-1 overflow-y-auto">
        <EditSiteForm site={site} />
      </div>
    </div>
  );
}
