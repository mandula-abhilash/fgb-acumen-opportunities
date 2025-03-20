"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/visdak-auth/src/hooks/useAuth";

import { getLiveOpportunitySite } from "@/lib/api/liveOpportunities";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { PageHeader } from "@/components/layout/page-header";
import { SiteDetailsView } from "@/components/sites/details/site-details-view";

export default function OpportunityDetailsPage() {
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
    const fetchOpportunity = async () => {
      try {
        setLoading(true);
        const response = await getLiveOpportunitySite(params.id);
        setSite(response.data);
      } catch (error) {
        console.error("Error fetching opportunity:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch opportunity details",
        });
        router.push("/dashboard/opportunities");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchOpportunity();
    }
  }, [params.id, toast, router]);

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
      <PageHeader title="Site Details">
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/opportunities")}
        >
          Back to Opportunities
        </Button>
      </PageHeader>

      <div className="px-6 py-4">
        <SiteDetailsView site={site} />
      </div>
    </div>
  );
}
