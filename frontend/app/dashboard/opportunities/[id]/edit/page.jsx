"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/visdak-auth/src/hooks/useAuth";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PageHeader } from "@/components/layout/page-header";
import { EditSiteForm } from "@/components/sites/edit/edit-site-form";

export default function EditSitePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const site = router.query?.state?.site;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    // Check if we have site data and user has permission
    if (site && user && user.role !== "admin" && user.id !== site.user_id) {
      router.push("/dashboard/opportunities");
      return;
    }

    // If no site data in state, redirect back to view page
    if (!site) {
      router.push(`/dashboard/opportunities/${params.id}`);
      return;
    }
  }, [authLoading, user, router, site, params.id]);

  if (authLoading || !user || !site) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Spinner size="lg" className="text-web-orange" />
      </div>
    );
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
