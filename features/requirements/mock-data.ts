export type MessageRole = 'user' | 'ai';
export type AiStatus = 'Thinking' | 'Updating Draft' | 'Ready' | 'Generating Final Version';
export type ConfidenceLevel = 'High' | 'Medium' | 'Low';
export type FileStatus = 'Processed' | 'Processing' | 'Unsupported' | 'Failed';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
}

export interface Document {
  id: string;
  name: string;
  status: FileStatus;
}

export interface DraftSectionData {
  id: string;
  title: string;
  content: string;
  isLocked: boolean;
}

export interface SRSData {
  projectId: string;
  aiStatus: AiStatus;
  confidence: ConfidenceLevel;
  lastSaved: string;
  sections: DraftSectionData[];
  assumptions: string[];
  missingInfo: string[];
  documents: Document[];
}

export const mockDataRemoved = [];

export const mockDataRemoved = {};
