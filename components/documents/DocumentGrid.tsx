import { ProjectDocument } from "@/features/documents/mock-data";
import { DocumentCard } from "./DocumentCard";

interface DocumentGridProps {
  documents: ProjectDocument[];
  onDocumentClick: (doc: ProjectDocument) => void;
}

export function DocumentGrid({ documents, onDocumentClick }: DocumentGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {documents.map(doc => (
        <DocumentCard 
          key={doc.id} 
          document={doc} 
          onClick={onDocumentClick} 
        />
      ))}
    </div>
  );
}
