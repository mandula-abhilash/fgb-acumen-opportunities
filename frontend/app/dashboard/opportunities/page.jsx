"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/visdak-auth/src/hooks/useAuth";
import { Plus } from "lucide-react";

import { getLiveOpportunitySites } from "@/lib/api/liveOpportunities";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { ExploreMap } from "@/components/explore/explore-map";
import { PageHeader } from "@/components/layout/page-header";
import { OpportunityCard } from "@/components/opportunities/opportunity-card";

export default function OpportunitiesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const viewMode = searchParams.get("view") || "list";

  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        const response = await getLiveOpportunitySites();
        setOpportunities(response.data);
      } catch (error) {
        console.error("Error fetching opportunities:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch opportunities. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOpportunities();
    }
  }, [user, toast]);

  const handleSubmitSiteClick = () => {
    router.push("/dashboard/sites/options");
  };

  const renderActionButton = () => {
    if (user?.role === "seller" || user?.role === "admin") {
      return (
        <Button
          className="bg-white hover:bg-gray-50 text-web-orange font-semibold shadow-lg border border-web-orange"
          onClick={handleSubmitSiteClick}
        >
          <Plus className="h-4 w-4 mr-2" />
          Submit New Site
        </Button>
      );
    }
    return null;
  };

  if (authLoading || !user) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Spinner size="lg" className="text-web-orange" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {viewMode === "list" && (
        <PageHeader title="Live Opportunities">
          {renderActionButton()}
        </PageHeader>
      )}

      <div
        className={cn(
          "flex-1 overflow-y-auto",
          viewMode === "list" ? "px-6" : ""
        )}
      >
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Spinner size="lg" className="text-web-orange" />
          </div>
        ) : viewMode === "list" ? (
          opportunities.length > 0 ? (
            <div className="grid gap-4 py-4">
              {opportunities.map((opportunity) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg text-muted-foreground mb-4">
                No opportunities found
              </p>
              {(user?.role === "seller" || user?.role === "admin") && (
                <Button
                  onClick={handleSubmitSiteClick}
                  className="bg-web-orange hover:bg-web-orange/90 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Your First Site
                </Button>
              )}
            </div>
          )
        ) : (
          <div className="h-full">
            <ExploreMap opportunities={opportunities} />
          </div>
        )}
      </div>
    </div>
  );
}
