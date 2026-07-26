import { cn } from "@/lib/utils";
import { FileStatus } from "@/features/requirements/mock-data";
import { CheckCircle2, Loader2, AlertCircle, XCircle } from "lucide-react";

export function UploadStatus({ status }: { status: FileStatus }) {
  const config = {
    'Processing': { icon: Loader2, color: 'text-primary', animate: 'animate-spin' },
    'Processed': { icon: CheckCircle2, color: 'text-success', animate: '' },
    'Unsupported': { icon: AlertCircle, color: 'text-warning', animate: '' },
    'Failed': { icon: XCircle, color: 'text-danger', animate: '' },
  };
  const { icon: Icon, color, animate } = config[status] || config['Processing'];

  return (
    <div className={cn("flex items-center gap-1.5 text-xs font-medium", color)}>
      <Icon className={cn("w-3.5 h-3.5", animate)} />
      {status}
    </div>
  );
}
