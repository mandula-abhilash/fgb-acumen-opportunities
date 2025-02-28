"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/visdak-auth/src/hooks/useAuth";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ExploreMap } from "@/components/explore/explore-map";
import { PageHeader } from "@/components/layout/page-header";
import { OpportunityCard } from "@/components/opportunities/opportunity-card";
import { SubmissionOptionsModal } from "@/components/sites/submission-options-modal";

// Dummy data for demonstration
const opportunities = [
  {
    id: 1,
    title: "Dartmouth Road Development",
    type: "Section 106 sale",
    location: "Dartmouth Road, Cannock, Staffs, WS11 1HF",
    coordinates: { lat: 53.4808, lng: -2.2426 },
    plots: 40,
    planningStatus: "Full Permission",
    purchaseStatus: "Land Purchase Completed",
    price: "£4.2M",
    lpa: "Cannock Chase",
    region: "West Midlands",
    developer: "Persimmon Homes",
    tenures: ["Social Rent", "Affordable Rent", "Shared Ownership"],
    image: "https://via.placeholder.com/400x300",
  },
  {
    id: 2,
    title: "Lloyd Street Development",
    type: "Section 106 sale",
    location: "Lloyd Street, Manchester City Center",
    coordinates: { lat: 53.4084, lng: -2.9916 },
    plots: 85,
    planningStatus: "Full Permission",
    purchaseStatus: "Heads of Terms Agreed",
    price: "£3.8M",
    lpa: "Manchester City Council",
    region: "North West",
    developer: "Taylor Wimpey",
    tenures: ["Social Rent", "Affordable Rent"],
    image: "https://via.placeholder.com/400x300",
  },
  {
    id: 3,
    title: "Church Street Project",
    type: "Grant Funded",
    location: "Church Street, Liverpool",
    coordinates: { lat: 53.4084, lng: -2.9916 },
    plots: 60,
    planningStatus: "Outline Approval",
    purchaseStatus: "Land Offer Stage",
    price: "£2.9M",
    lpa: "Liverpool City Council",
    region: "North West",
    developer: "Bellway Homes",
    tenures: ["Social Rent", "Shared Ownership"],
    image: "https://via.placeholder.com/400x300",
  },
];

export default function OpportunitiesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const viewMode = searchParams.get("view") || "list";
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  const handleSubmitSiteClick = () => {
    setShowOptionsModal(true);
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

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Spinner size="lg" className="text-web-orange" />
      </div>
    );
  }

  if (!user) {
    return null;
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
        {viewMode === "list" ? (
          <div className="grid gap-4 py-4">
            {opportunities.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        ) : (
          <div className="h-full">
            <ExploreMap opportunities={opportunities} />
          </div>
        )}
      </div>

      <SubmissionOptionsModal
        open={showOptionsModal}
        onOpenChange={setShowOptionsModal}
      />
    </div>
  );
}
