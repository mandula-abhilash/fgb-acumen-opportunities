"use client";

import { ExternalLink, FileText } from "lucide-react";

import { Card } from "@/components/ui/card";

export function AdditionalDocuments({ site }) {
  if (!site.additional_documents?.length) return null;

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return "Unknown size";
    // Always show in KB if under 1MB for consistency with browser
    const kb = (bytes / 1000).toFixed(2);
    return `${kb} KB`;
  };

  return (
    <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow">
      <h2 className="text-xl font-semibold text-havelock-blue mb-4">
        Additional Documents
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {site.additional_documents.map((doc, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
          >
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium truncate max-w-[200px]">{doc.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(doc.size)}
                </p>
              </div>
            </div>
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only">View {doc.name}</span>
            </a>
          </div>
        ))}
      </div>
    </Card>
  );
}
