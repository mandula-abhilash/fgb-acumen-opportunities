"use client";

import { useRouter } from "next/navigation";
import { Building2, Edit2, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";

export function HeaderSection({ site, canEdit }) {
  const router = useRouter();

  const handleEditClick = () => {
    router.push(`/dashboard/opportunities/${site.id}/edit`);
  };

  return (
    <div className="p-4 sm:p-6 border-b">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-havelock-blue">
            <Building2 className="h-5 w-5 flex-shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-bold">{site.site_name}</h1>
          </div>
          <div className="flex items-start gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
            <p className="text-base sm:text-lg">
              {site.customSiteAddress || site.siteAddress}
            </p>
          </div>
        </div>
        {canEdit && (
          <Button
            onClick={handleEditClick}
            size="sm"
            variant="outline"
            className="w-full sm:w-auto border-2 hover:bg-accent"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Site
          </Button>
        )}
      </div>
    </div>
  );
}
