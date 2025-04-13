"use client";

import { ImagePreview } from "@/components/ui/image-preview";

export function ImageSection({ site }) {
  return (
    <ImagePreview
      src={
        "https://planning-applications-bucket.s3.eu-west-2.amazonaws.com/65ae31514a033c25afd3487b.jpeg?etag=59248ab241972cc690f857dff37b5c71" ||
        site.sitePlanImage ||
        "https://placehold.in/400"
      }
      alt={site.siteName}
      aspectRatio="16/9"
    />
  );
}
