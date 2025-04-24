import { deleteFileFromS3 } from "@/lib/upload";
import { MultiFileUpload } from "@/components/ui/multi-file-upload";
import { useToast } from "@/components/ui/use-toast";
import { fileTypes } from "@/components/sites/form-constants";

export function AdditionalDocuments({
  documents = [],
  onDocumentsChange,
  parentId,
}) {
  const { toast } = useToast();

  const handleDeleteDocument = async (index) => {
    try {
      const document = documents[index];
      if (document.key) {
        await deleteFileFromS3(document.key);
      }

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

  const handleFilesChange = (files) => {
    onDocumentsChange(files);
  };

  return (
    <div className="space-y-4">
      <MultiFileUpload
        files={documents}
        onFilesChange={handleFilesChange}
        onFileDelete={handleDeleteDocument}
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
