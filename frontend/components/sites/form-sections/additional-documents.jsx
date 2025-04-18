import { useState } from "react";
import { FileText } from "lucide-react";

import { Card } from "@/components/ui/card";
import { MultiFileUpload } from "@/components/ui/multi-file-upload";
import { fileTypes } from "@/components/sites/form-constants";

export function AdditionalDocuments({
  documents = [],
  onDocumentsChange,
  parentId,
}) {
  const handleFilesChange = (files) => {
    onDocumentsChange(files);
  };

  return (
    <div className="space-y-4">
      <MultiFileUpload
        files={documents}
        onFilesChange={handleFilesChange}
        acceptedFileTypes={fileTypes.document}
        maxFileSize={10 * 1024 * 1024}
        folder="additional-documents"
        fileCategory="additional"
        parentId={parentId}
        maxFiles={12}
        label="Upload Additional Documents"
        description="Upload additional documents (PDF, Word, max 10MB)"
      />
    </div>
  );
}
