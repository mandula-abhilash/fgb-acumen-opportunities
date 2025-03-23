"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { MainLayout } from "@/components/layout/main-layout";
import { PageHeader } from "@/components/layout/page-header";
import { AssistedSiteForm } from "@/components/sites/assisted/assisted-site-form";

export default function AssistedSubmissionPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <MainLayout>
        <div className="h-full w-full flex items-center justify-center">
          <Spinner size="lg" className="text-web-orange" />
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <PageHeader title="Submit New Site (Assisted)">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/sites/options")}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline-block sm:ml-2">Back</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Return to submission options</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </PageHeader>

      <div className="flex-1 overflow-y-auto">
        <AssistedSiteForm />
      </div>
    </div>
  );
}
