"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/visdak-auth/src/hooks/useAuth";
import { Building2, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

// Dummy data for demonstration
const opportunities = [
  {
    id: 1,
    title: "Riverside Development Site",
    location: "Manchester City Center",
    plots: 120,
    planningStatus: "Outline Approval",
    purchaseStatus: "Land Offer Stage",
    price: "£4.2M",
    type: "Section 106",
  },
  {
    id: 2,
    title: "Urban Regeneration Project",
    location: "Liverpool Docklands",
    plots: 85,
    planningStatus: "Full Approval",
    purchaseStatus: "Heads of Terms Agreed",
    price: "£3.8M",
    type: "Grant Funded",
  },
  // Add more dummy opportunities as needed
];

export default function OpportunitiesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Live Opportunities</h2>
        <Button className="bg-web-orange hover:bg-web-orange/90 text-white">
          View on Map
        </Button>
      </div>

      <div className="grid gap-4">
        {opportunities.map((opportunity) => (
          <Card key={opportunity.id} className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {opportunity.title}
                  </h3>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{opportunity.location}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center gap-1 text-muted-foreground mb-1">
                      <Building2 className="h-4 w-4" />
                      <span className="text-sm">Number of Plots</span>
                    </div>
                    <p className="font-medium">{opportunity.plots} units</p>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Planning Status
                    </div>
                    <p className="font-medium">{opportunity.planningStatus}</p>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Purchase Status
                    </div>
                    <p className="font-medium">{opportunity.purchaseStatus}</p>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      Type
                    </div>
                    <p className="font-medium">{opportunity.type}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between gap-4 md:w-48">
                <div className="text-center md:text-right">
                  <div className="text-sm text-muted-foreground mb-1">
                    Guide Price
                  </div>
                  <p className="text-xl font-bold text-web-orange">
                    {opportunity.price}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button className="bg-web-orange hover:bg-web-orange/90 text-white w-full">
                    View Details
                  </Button>
                  <Button variant="outline" className="w-full">
                    Shortlist
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
