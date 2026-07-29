export type ActivityType = 
  | 'Task Created' | 'Task Updated' | 'Task Deleted' | 'Task Assigned' | 'Task Completed'
  | 'Sprint Generated' | 'Sprint Approved'
  | 'SRS Generated' | 'SRS Approved'
  | 'Document Uploaded' | 'Document Processed'
  | 'Comment Added'
  | 'Project Created'
  | 'Member Invited' | 'Role Changed'
  | 'AI Conversation' | 'AI Draft Updated';

export interface ActivityLog {
  id: string;
  type: ActivityType;
  userName: string;
  userInitials: string;
  timestamp: string;
  description: string;
  taskRef?: string;
  documentRef?: string;
}


