import { Activity } from "lucide-react";

export function EmptyActivity() {
  return (
    <div className="w-full bg-surface border border-border rounded-lg border-dashed p-16 flex flex-col items-center justify-center text-center mt-6">
      <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mb-4">
        <Activity className="w-8 h-8 text-text-secondary" />
      </div>
      <h2 className="text-lg font-semibold text-text-primary mb-2">No project activity yet</h2>
      <p className="text-text-secondary text-sm max-w-sm mb-6">
        Once you start creating tasks, generating requirements, or uploading documents, the history will appear here.
      </p>
    </div>
  );
}
