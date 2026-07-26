interface ProgressBarProps {
  progress: number;
}

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
      <div 
        className="bg-primary h-full transition-all duration-500 ease-out" 
        style={{ width: `${progress}%` }} 
      />
    </div>
  );
}
