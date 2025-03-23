"use client";

export function ImageSection({ site }) {
  return (
    <div className="relative w-full h-[400px] border-b">
      <img
        src={
          "https://planning-applications-bucket.s3.eu-west-2.amazonaws.com/65ae31514a033c25afd3487b.jpeg?etag=59248ab241972cc690f857dff37b5c71" ||
          site.sitePlanImage ||
          "https://placehold.in/400"
        }
        alt={site.siteName}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
