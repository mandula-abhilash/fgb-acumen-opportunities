"use client";

import { useRouter } from "next/navigation";
import { Edit2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function HeaderSection({ site, canEdit }) {
  const router = useRouter();

  const handleEditClick = () => {
    // Store site data in sessionStorage before navigating
    sessionStorage.setItem("editSiteData", JSON.stringify(site));
    router.push(`/dashboard/opportunities/${site.id}/edit`);
  };

  return (
    <div className="flex flex-col space-y-1 p-3 bg-muted/30 border-b">
      <h2 className="text-lg font-bold text-havelock-blue">{site.site_name}</h2>
      <div className="flex items-center justify-between">
        <div className="flex items-center text-muted-foreground">
          <span className="text-sm">{site.site_address}</span>
        </div>
        {canEdit && (
          <Button
            onClick={handleEditClick}
            size="sm"
            className="bg-web-orange hover:bg-web-orange/90 text-white shadow-lg"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Site
          </Button>
        )}
      </div>
    </div>
  );
}
