"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/visdak-auth/src/hooks/useAuth";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { MainLayout } from "@/components/layout/main-layout";
import { PageHeader } from "@/components/layout/page-header";
import { SubmitSiteForm } from "@/components/sites/submit-site-form";

export default function SubmitNewSitePage() {
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
      <PageHeader title="Submit New Site">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push("/dashboard/opportunities")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </PageHeader>

      <div className="flex-1 overflow-y-auto">
        <SubmitSiteForm />
      </div>
    </div>
  );
}
