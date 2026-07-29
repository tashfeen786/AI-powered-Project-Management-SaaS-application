"use client";

import { SettingsData } from "@/types/api";
import { Sparkles } from "lucide-react";

interface AISettingsProps {
  settings: SettingsData;
  onChange: (updates: any) => void;
}

export function AISettings({ settings, onChange }: AISettingsProps) {
  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-background/50 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <h2 className="text-base font-semibold text-text-primary">AI Preferences</h2>
      </div>
      <div className="p-6 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-border">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Default AI Provider</label>
            <select
              value={(settings as any).aiProvider || (settings as any).ai?.provider || "OpenAI"}
              onChange={(e) => onChange({ aiProvider: e.target.value })}
              className="w-full h-9 px-3 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="OpenAI">OpenAI</option>
              <option value="Anthropic" disabled>Anthropic (Coming Soon)</option>
              <option value="Google" disabled>Google Gemini (Coming Soon)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Default Model</label>
            <select
              value={(settings as any).aiModel || (settings as any).ai?.model || "gpt-4o"}
              onChange={(e) => onChange({ aiModel: e.target.value })}
              className="w-full h-9 px-3 bg-background border border-border rounded-md text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="gpt-4o">GPT-4o (Recommended)</option>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-text-primary">Auto-save AI Drafts</div>
            <div className="text-xs text-text-secondary">Automatically save the SRS document while AI is streaming.</div>
          </div>
          <button 
            onClick={() => onChange({ autoSaveDraft: !((settings as any).autoSaveDraft || (settings as any).ai?.autoSaveDraft) })}
            className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${((settings as any).autoSaveDraft || (settings as any).ai?.autoSaveDraft) ? 'bg-primary' : 'bg-[#E5E5E5]'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all shadow-sm ${((settings as any).autoSaveDraft || (settings as any).ai?.autoSaveDraft) ? 'left-[18px]' : 'left-0.5'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-text-primary">Auto-generate Suggestions</div>
            <div className="text-xs text-text-secondary">Show AI suggestions preemptively in text editors.</div>
          </div>
          <button 
            onClick={() => onChange({ autoGenerateSuggestions: !((settings as any).autoGenerateSuggestions || (settings as any).ai?.autoGenerateSuggestions) })}
            className={`w-9 h-5 rounded-full transition-colors relative shrink-0 ${((settings as any).autoGenerateSuggestions || (settings as any).ai?.autoGenerateSuggestions) ? 'bg-primary' : 'bg-[#E5E5E5]'}`}
          >
            <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all shadow-sm ${((settings as any).autoGenerateSuggestions || (settings as any).ai?.autoGenerateSuggestions) ? 'left-[18px]' : 'left-0.5'}`} />
          </button>
        </div>

        <div className="pt-6 border-t border-border">
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-text-primary">Confidence Threshold</label>
            <span className="text-xs font-semibold px-2 py-0.5 bg-background border border-border rounded">{((settings as any).aiConfidenceThreshold || (settings as any).ai?.confidenceThreshold || 80)}%</span>
          </div>
          <input 
            type="range" 
            min="50" max="100" step="5"
            value={((settings as any).aiConfidenceThreshold || (settings as any).ai?.confidenceThreshold || 80)}
            onChange={(e) => onChange({ aiConfidenceThreshold: parseInt(e.target.value) })}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-[10px] text-text-secondary mt-2">
            <span>Higher Speed (50%)</span>
            <span>Higher Accuracy (100%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
