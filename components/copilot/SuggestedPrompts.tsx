"use client";

interface SuggestedPromptsProps {
  onSelect: (prompt: string) => void;
}

export function SuggestedPrompts({ onSelect }: SuggestedPromptsProps) {
  const prompts = [
    "Summarize project status",
    "Generate sprint plan",
    "Find blocked tasks",
    "Estimate delivery date",
    "Review architecture",
    "Create meeting summary"
  ];

  return (
    <div className="flex flex-wrap gap-2 justify-center mt-8 max-w-2xl mx-auto">
      {prompts.map((prompt, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(prompt)}
          className="px-3 py-1.5 text-xs font-medium bg-surface border border-border text-text-secondary rounded-full hover:border-primary hover:text-primary transition-colors focus:outline-none"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
