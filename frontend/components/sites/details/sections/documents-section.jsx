"use client";

import Link from "next/link";
import { FileText } from "lucide-react";

import { Card } from "@/components/ui/card";

export function DocumentsSection({ site }) {
  return (
    <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
      <h2 className="text-xl font-semibold text-havelock-blue mb-4">
        Documents
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {site.proposedSpecification && (
          <Link
            href={site.proposedSpecification}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-4 border rounded-lg hover:bg-accent group transition-colors"
          >
            <FileText className="h-5 w-5 mr-2 text-web-orange group-hover:text-web-orange/80" />
            <span>View Proposed Specification</span>
          </Link>
        )}
        {site.s106Agreement && (
          <Link
            href={site.s106Agreement}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-4 border rounded-lg hover:bg-accent group transition-colors"
          >
            <FileText className="h-5 w-5 mr-2 text-web-orange group-hover:text-web-orange/80" />
            <span>View Section 106 Agreement</span>
          </Link>
        )}
      </div>
    </Card>
  );
}
