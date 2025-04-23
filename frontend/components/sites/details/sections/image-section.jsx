"use client";

import { ImagePreview } from "@/components/ui/image-preview";

export function ImageSection({ site }) {
  return (
    <ImagePreview
      src={site.site_plan_image || "/assets/application.png"}
      alt={site.siteName}
      aspectRatio="16/9"
    />
  );
}
