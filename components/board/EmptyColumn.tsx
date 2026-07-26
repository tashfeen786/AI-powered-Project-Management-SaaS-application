export function EmptyColumn({ message = "No tasks here." }: { message?: string }) {
  return (
    <div className="h-24 rounded border-2 border-dashed border-border flex items-center justify-center text-sm font-medium text-text-secondary">
      {message}
    </div>
  );
}
