"use client";

import { Download, FileText, FileSpreadsheet, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function ExportMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExportCSV = () => {
    const data: any = queryClient.getQueryData(["analytics"]);
    if (!data) return alert("No analytics data available to export");

    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\n"
      + `Total Projects,${data.kpis.totalProjects}\n`
      + `Active Projects,${data.kpis.activeProjects}\n`
      + `Average Sprint Velocity,${data.kpis.averageSprintVelocity}\n`
      + `AI Generated Docs,${data.kpis.aiGeneratedDocs}\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "enterprise_analytics.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsOpen(false);
  };

  const handleExportPDF = () => {
    window.print();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 px-3 bg-surface border border-border rounded-md text-sm font-medium text-text-primary flex items-center gap-2 hover:bg-background transition-colors focus:outline-none focus:ring-1 focus:ring-primary shrink-0"
      >
        <Download className="w-4 h-4 text-text-secondary" />
        Export
        <ChevronDown className={`w-3 h-3 text-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-md shadow-lg overflow-hidden z-50">
          <button 
            onClick={handleExportCSV}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-text-primary hover:bg-background transition-colors text-left"
          >
            <FileSpreadsheet className="w-4 h-4 text-green-500" />
            Export to CSV
          </button>
          <button 
            onClick={handleExportPDF}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-text-primary hover:bg-background transition-colors text-left border-t border-border"
          >
            <FileText className="w-4 h-4 text-red-500" />
            Export to PDF
          </button>
        </div>
      )}
    </div>
  );
}
