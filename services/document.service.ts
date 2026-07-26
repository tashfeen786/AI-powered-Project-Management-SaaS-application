import { mockDocuments, ProjectDocument } from "@/features/documents/mock-data";

let currentDocs = [...mockDocuments];

export const DocumentService = {
  getDocuments: async (projectId: string): Promise<ProjectDocument[]> => {
    return new Promise(resolve => setTimeout(() => resolve([...currentDocs]), 600));
  },
  uploadDocument: async (projectId: string, file: File): Promise<ProjectDocument> => {
    return new Promise(resolve => setTimeout(() => {
      const newDoc: ProjectDocument = {
        id: Math.random().toString(),
        name: file.name,
        type: file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        uploadedBy: "Current User",
        uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: "Uploaded",
        url: "#"
      };
      currentDocs = [newDoc, ...currentDocs];
      resolve(newDoc);
    }, 1500)); // Simulate longer upload time
  },
  deleteDocument: async (documentId: string): Promise<void> => {
    return new Promise((resolve) => setTimeout(() => {
      currentDocs = currentDocs.filter(d => d.id !== documentId);
      resolve();
    }, 500));
  }
};
