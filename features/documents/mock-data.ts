export type DocStatus = 'Uploaded' | 'Processing' | 'Processed' | 'Failed' | 'Unsupported';

export interface ProjectDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadDate: string;
  status: DocStatus;
  url: string;
}

export const mockDocuments: ProjectDocument[] = [
  { id: "d1", name: "System_Architecture_V1.pdf", type: "PDF", size: "2.4 MB", uploadedBy: "Alex Dev", uploadDate: "Oct 24, 2026", status: "Processed", url: "#" },
  { id: "d2", name: "API_Endpoints.csv", type: "CSV", size: "124 KB", uploadedBy: "Sarah PM", uploadDate: "Oct 25, 2026", status: "Processing", url: "#" },
  { id: "d3", name: "User_Interviews.docx", type: "DOCX", size: "1.1 MB", uploadedBy: "Sarah PM", uploadDate: "Oct 25, 2026", status: "Uploaded", url: "#" },
  { id: "d4", name: "Old_Legacy_Code.zip", type: "ZIP", size: "45 MB", uploadedBy: "Alex Dev", uploadDate: "Oct 26, 2026", status: "Unsupported", url: "#" }
];
