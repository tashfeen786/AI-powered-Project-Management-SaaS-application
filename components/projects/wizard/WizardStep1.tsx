"use client";

import { useState } from "react";
import { ArrowRight, Info } from "lucide-react";

export function WizardStep1({ data, onChange, onNext }: any) {
  const handleChange = (field: string, value: string) => {
    onChange({ [field]: value });
  };

  const isComplete = data.name && data.project_type && data.industry;

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto">
      <div className="p-8 max-w-4xl mx-auto w-full flex-1">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Project Foundation</h2>
        <p className="text-text-secondary mb-8">Define the core parameters of your project. Our AI will use this context to generate relevant requirements, architecture, and task assignments.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-text-primary mb-1">Project Name <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={data.name || ""} 
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g. AI E-Commerce Platform"
              className="w-full h-11 px-4 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Project Type <span className="text-red-500">*</span></label>
            <select 
              value={data.project_type || ""} 
              onChange={(e) => handleChange("project_type", e.target.value)}
              className="w-full h-11 px-4 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Select Type</option>
              <option value="Web Application">Web Application</option>
              <option value="Mobile App">Mobile App</option>
              <option value="Desktop Application">Desktop Application</option>
              <option value="API / Backend">API / Backend</option>
              <option value="AI / ML System">AI / ML System</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Industry <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={data.industry || ""} 
              onChange={(e) => handleChange("industry", e.target.value)}
              placeholder="e.g. Healthcare, FinTech, Retail"
              className="w-full h-11 px-4 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Target Platform(s)</label>
            <input 
              type="text" 
              value={data.target_platform || ""} 
              onChange={(e) => handleChange("target_platform", e.target.value)}
              placeholder="e.g. iOS, Android, Web, Windows"
              className="w-full h-11 px-4 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Expected Users (Scale)</label>
            <select 
              value={data.expected_users || ""} 
              onChange={(e) => handleChange("expected_users", e.target.value)}
              className="w-full h-11 px-4 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Select Scale</option>
              <option value="Internal Tool (1-100)">Internal Tool (1-100)</option>
              <option value="Small Business (100-10k)">Small Business (100-10k)</option>
              <option value="Startup / Mid-Market (10k-1M)">Startup / Mid-Market (10k-1M)</option>
              <option value="Enterprise / Global (1M+)">Enterprise / Global (1M+)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Estimated Budget</label>
            <input 
              type="text" 
              value={data.budget || ""} 
              onChange={(e) => handleChange("budget", e.target.value)}
              placeholder="e.g. $50k - $100k, Open"
              className="w-full h-11 px-4 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Target Deadline</label>
            <input 
              type="date" 
              value={data.deadline || ""} 
              onChange={(e) => handleChange("deadline", e.target.value)}
              className="w-full h-11 px-4 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Priority</label>
            <select 
              value={data.priority || ""} 
              onChange={(e) => handleChange("priority", e.target.value)}
              className="w-full h-11 px-4 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-text-primary mb-1">Technology Preferences</label>
            <textarea 
              value={data.tech_preferences || ""} 
              onChange={(e) => handleChange("tech_preferences", e.target.value)}
              placeholder="e.g. React, Node.js, PostgreSQL, AWS (leave blank if you want AI to recommend)"
              className="w-full min-h-[100px] p-4 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
            />
            <div className="flex items-center gap-2 mt-2 text-xs text-text-secondary">
              <Info className="w-4 h-4" />
              <span>If you are unsure, our AI Architect will recommend the best stack for you based on the requirements.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border bg-surface flex justify-end">
        <button 
          onClick={onNext}
          disabled={!isComplete}
          className="h-11 px-6 bg-primary text-surface rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next: Requirements Workspace
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
