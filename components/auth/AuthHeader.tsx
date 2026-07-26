export function AuthHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6 text-center">
      <div className="w-10 h-10 bg-primary rounded-md mx-auto mb-4 flex items-center justify-center shadow-sm">
        <span className="text-surface font-bold text-xl leading-none">A</span>
      </div>
      <h1 className="text-2xl font-semibold text-text-primary mb-1">{title}</h1>
      <p className="text-sm text-text-secondary">{subtitle}</p>
    </div>
  );
}
