import React from 'react';

interface MarkdownProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownProps) {
  // A highly simplified markdown parser for bold, italics, code blocks, and tables
  const parseMarkdown = (text: string) => {
    // Escape HTML first
    let html = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    
    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-surface text-text-primary p-3 rounded-md my-2 overflow-x-auto text-sm border border-border"><code>$1</code></pre>');
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-surface text-primary px-1 py-0.5 rounded text-xs">$1</code>');
    
    // Bold
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Italic
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-5 mb-2 border-b border-border pb-1">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-3">$1</h1>');
    
    // Lists
    html = html.replace(/^\s*-\s+(.*)/gim, '<li class="ml-4 list-disc marker:text-text-secondary">$1</li>');
    
    // Tables (extremely naive)
    if (html.includes('|')) {
      const rows = html.split('\n');
      let inTable = false;
      let newRows = [];
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (row.includes('|')) {
          if (!inTable) {
            inTable = true;
            newRows.push('<div class="overflow-x-auto my-3"><table class="w-full text-sm text-left border-collapse border border-border">');
          }
          if (row.includes('---')) continue; // Skip separator
          
          const cells = row.split('|').filter(c => c.trim() !== '');
          const isHeader = newRows.length === 1; // Simplification
          
          let tr = '<tr>';
          for (const cell of cells) {
            tr += `<${isHeader ? 'th' : 'td'} class="border border-border px-3 py-2 ${isHeader ? 'bg-surface font-semibold' : ''}">${cell.trim()}</${isHeader ? 'th' : 'td'}>`;
          }
          tr += '</tr>';
          newRows.push(tr);
        } else {
          if (inTable) {
            inTable = false;
            newRows.push('</table></div>');
          }
          newRows.push(row);
        }
      }
      if (inTable) {
        newRows.push('</table></div>');
      }
      html = newRows.join('\n');
    }
    
    // Paragraphs
    html = html.replace(/^(?!<[a-z])(.*$)/gim, '<p class="mb-2">$1</p>');
    
    return html;
  };

  return (
    <div 
      className="markdown-body text-sm leading-relaxed"
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  );
}
