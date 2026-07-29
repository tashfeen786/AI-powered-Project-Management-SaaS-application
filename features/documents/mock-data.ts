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


