"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Upload, Paperclip, Type, List, Link as LinkIcon, Image as ImageIcon } from "lucide-react";

export function WizardStep2({ data, onChange, onPrev, onNext, projectData }: any) {
  // A simple placeholder for a rich text editor. In a real application, you would integrate 
  // TipTap, Slate.js, or Draft.js here to support markdown, drag & drop, tables, etc.
  
  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto">
      <div className="p-8 max-w-5xl mx-auto w-full flex-1 flex flex-col">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">Requirements Workspace</h2>
            <p className="text-text-secondary">
              Dump all your ideas, user stories, existing documentation, or raw notes here.
              Our AI will analyze it to generate a structured project plan.
            </p>
          </div>
        </div>

        {/* Rich Text Editor Toolbar (Mock) */}
        <div className="flex-1 bg-surface border border-border rounded-lg shadow-sm flex flex-col overflow-hidden">
          <div className="h-12 border-b border-border bg-background flex items-center px-4 gap-2">
            <button className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface rounded-md transition-colors">
              <Type className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface rounded-md transition-colors">
              <List className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-border mx-1"></div>
            <button className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface rounded-md transition-colors">
              <LinkIcon className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface rounded-md transition-colors">
              <ImageIcon className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-surface rounded-md transition-colors">
              <Paperclip className="w-4 h-4" />
            </button>
            
            <div className="flex-1"></div>
            
            <div className="text-xs text-text-secondary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Autosaved just now
            </div>
          </div>
          
          <div className="flex-1 p-0 relative">
            <textarea 
              value={data}
              onChange={(e) => onChange(e.target.value)}
              placeholder={`Write the requirements for ${projectData.name || 'your project'} here...
              
You can include:
- Feature descriptions
- User roles
- Competitor references
- Specific constraints

Or simply drag & drop PDF, DOCX, or Markdown files here.`}
              className="w-full h-full min-h-[400px] p-6 bg-surface text-text-primary focus:outline-none resize-none font-mono text-sm leading-relaxed"
            />
            
            {/* Drag & Drop Overlay (Hidden by default, shown on drag over) */}
            <div className="absolute inset-0 bg-primary/5 border-2 border-dashed border-primary z-10 hidden flex-col items-center justify-center">
              <Upload className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-text-primary">Drop files to attach</h3>
              <p className="text-sm text-text-secondary">PDF, DOCX, TXT, MD supported</p>
            </div>
          </div>
        </div>

        {/* Uploaded Files Section */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Attached Documents (RAG Knowledge)</h3>
          <div className="flex gap-4">
            <div className="border border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/50 hover:bg-surface transition-all w-48">
              <Upload className="w-6 h-6 text-text-secondary mb-2" />
              <span className="text-sm font-medium text-text-primary">Upload Files</span>
              <span className="text-xs text-text-secondary mt-1">Max 50MB</span>
            </div>
            {/* Display attached files here */}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border bg-surface flex justify-between items-center">
        <button 
          onClick={onPrev}
          className="h-11 px-6 bg-transparent border border-border text-text-primary rounded-lg font-medium hover:bg-background transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button 
          onClick={onNext}
          disabled={!data.trim()}
          className="h-11 px-6 bg-primary text-surface rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Analyze Requirements
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
