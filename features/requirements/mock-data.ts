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

export const mockConversation: Message[] = [
  { id: '1', role: 'ai', content: 'Hi! Tell me about your software project. What are we building today?', timestamp: '10:00 AM' },
  { id: '2', role: 'user', content: 'We are building an inventory management system for small retailers. It needs barcode scanning.', timestamp: '10:02 AM' },
  { id: '3', role: 'ai', content: 'Great! I\'ve started drafting the Scope and Features. Will this be a mobile app, web app, or both?', timestamp: '10:03 AM' },
];

export const mockDraft: SRSData = {
  projectId: '1',
  aiStatus: 'Ready',
  confidence: 'Medium',
  lastSaved: 'Just now',
  documents: [
    { id: 'd1', name: 'initial_requirements.pdf', status: 'Processed' },
  ],
  sections: [
    { id: 's1', title: 'Scope', content: 'The system is an inventory management platform aimed at small to medium retailers. It will support real-time stock tracking and reporting.', isLocked: false },
    { id: 's2', title: 'Modules', content: '1. Inventory Tracking\n2. Barcode Scanning\n3. Reporting Dashboard\n4. User Management', isLocked: false },
    { id: 's3', title: 'Features', content: '- Add/Edit/Delete Products\n- Stock Alerts\n- Barcode generating and scanning capabilities.', isLocked: true },
    { id: 's4', title: 'User Roles', content: 'Admin, Store Manager, Cashier', isLocked: false },
    { id: 's5', title: 'Functional Requirements', content: 'FR1: The system shall allow users to scan barcodes using a mobile device camera.\nFR2: The system shall alert the store manager when stock falls below a predefined threshold.', isLocked: false },
    { id: 's6', title: 'Non-Functional Requirements', content: 'NFR1: 99.9% uptime.\nNFR2: API response time under 200ms.', isLocked: false },
  ],
  assumptions: ['Users have stable internet access.', 'Retailers use standard UPC barcodes.'],
  missingInfo: ['Budget', 'Timeline', 'Authentication Method', 'Deployment Platform']
};
