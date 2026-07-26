import { Paperclip } from "lucide-react";

export function UploadDocumentButton() {
  return (
    <button type="button" className="p-2 text-text-secondary hover:text-primary hover:bg-primary/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary shrink-0" title="Upload Document">
      <Paperclip className="w-5 h-5" />
    </button>
  );
}
