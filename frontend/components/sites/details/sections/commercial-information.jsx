"use client";

import { Coins, PoundSterling, Users } from "lucide-react";

import { Card } from "@/components/ui/card";

export function CommercialInformation({ site }) {
  return (
    <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
      <h2 className="text-xl font-semibold text-havelock-blue mb-4">
        Commercial Information
      </h2>
      <div className="space-y-4">
        {site.paymentTerms && (
          <div>
            <h3 className="flex items-center gap-2 font-medium text-muted-foreground mb-2">
              <PoundSterling className="h-4 w-4" />
              Payment Terms
            </h3>
            <p className="text-foreground whitespace-pre-wrap">
              {site.paymentTerms}
            </p>
          </div>
        )}

        {site.vatPosition && (
          <div>
            <h3 className="flex items-center gap-2 font-medium text-muted-foreground mb-2">
              <Coins className="h-4 w-4" />
              VAT Position
            </h3>
            <p className="text-foreground">{site.vatPosition}</p>
          </div>
        )}

        {site.agentTerms && (
          <div>
            <h3 className="flex items-center gap-2 font-medium text-muted-foreground mb-2">
              <Users className="h-4 w-4" />
              Agent Terms
            </h3>
            <p className="text-foreground whitespace-pre-wrap">
              {site.agentTerms}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
