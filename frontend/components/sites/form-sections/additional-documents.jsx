import { useState } from "react";
import { FileText, Plus, Trash2, X } from "lucide-react";

import { deleteFileFromS3 } from "@/lib/upload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { fileTypes } from "@/components/sites/form-constants";

export function AdditionalDocuments({
  documents = [],
  onDocumentsChange,
  parentId,
}) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadComplete = (fileUrl) => {
    setUploadedFile({ url: fileUrl });
    setIsDialogOpen(true);
  };

  const handleUploadError = (error) => {
    console.error("Upload error:", error);
    toast({
      variant: "destructive",
      title: "Upload Failed",
      description: "Failed to upload file. Please try again.",
    });
  };

  const handleSaveDocument = () => {
    if (!documentName.trim()) {
      toast({
        variant: "destructive",
        title: "Name Required",
        description: "Please provide a name for the document.",
      });
      return;
    }

    const newDocument = {
      name: documentName.trim(),
      url: uploadedFile.url,
    };

    onDocumentsChange([...documents, newDocument]);
    setIsDialogOpen(false);
    setDocumentName("");
    setUploadedFile(null);
  };

  const handleDeleteDocument = async (index, url) => {
    try {
      const urlParts = url.split("/");
      const key = urlParts.slice(3).join("/");
      await deleteFileFromS3(key);

      const updatedDocuments = [...documents];
      updatedDocuments.splice(index, 1);
      onDocumentsChange(updatedDocuments);

      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete document. Please try again.",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Document List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
          >
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{doc.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View
              </a>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
                onClick={() => handleDeleteDocument(index, doc.url)}
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete document</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Button */}
      {documents.length < 12 && (
        <div className="mt-4">
          <FileUpload
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
            acceptedFileTypes={fileTypes.document}
            maxFileSize={10 * 1024 * 1024}
            folder="additional-documents"
            fileCategory="additional"
            parentId={parentId}
            label={"Add Document"}
            description="Upload additional documents (PDF, Word, max 10MB)"
            fileType="document"
          />
        </div>
      )}

      {/* Name Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Document Details</DialogTitle>
            <DialogDescription>
              Please provide a name for this document
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="documentName">Document Name</Label>
              <Input
                id="documentName"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="Enter document name"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveDocument}
              disabled={isUploading || !documentName.trim()}
              className="bg-web-orange hover:bg-web-orange/90 text-white"
            >
              Save Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
