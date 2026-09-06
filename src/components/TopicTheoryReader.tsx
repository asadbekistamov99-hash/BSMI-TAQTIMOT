import React, { useState, useMemo, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import CreativeAnatomyDiagram from './CreativeAnatomyDiagram';
import Pagination from './Pagination';
import { Layers, FileText, ChevronRight, ChevronLeft } from 'lucide-react';

export interface TopicTheoryReaderProps {
  rawTheoryText: string;
  topicId?: string;
  isUserAdmin?: boolean;
  diagramReplacements?: Record<string, any>;
  onUpdateDiagramReplacement?: (diagKey: string, newRep: any) => void;
  getDiagramKey: (codeString: string) => string;
  language?: string;
}

/**
 * Splits markdown theory text into logical pages based on dividers (---) or major headings (###).
 */
export function splitTheoryIntoPages(theoryText: string): string[] {
  if (!theoryText || theoryText.trim().length < 1200) {
    return [theoryText];
  }

  // 1. Check if text has markdown horizontal rules (---)
  const hrParts = theoryText.split(/\n\s*---\s*\n/).map(p => p.trim()).filter(Boolean);
  if (hrParts.length >= 2) {
    const finalPages: string[] = [];
    let current = '';
    for (const part of hrParts) {
      if (!current) {
        current = part;
      } else if (current.length < 500) {
        current += '\n\n---\n\n' + part;
      } else {
        finalPages.push(current);
        current = part;
      }
    }
    if (current) finalPages.push(current);
    if (finalPages.length > 1) return finalPages;
  }

  // 2. Check for `### ` headings
  const h3Matches = [...theoryText.matchAll(/\n(?=###\s+)/g)];
  if (h3Matches.length >= 2) {
    const parts: string[] = [];
    let lastIndex = 0;
    for (const match of h3Matches) {
      if (match.index !== undefined && match.index > 0) {
        const chunk = theoryText.slice(lastIndex, match.index).trim();
        if (chunk) parts.push(chunk);
        lastIndex = match.index;
      }
    }
    const finalChunk = theoryText.slice(lastIndex).trim();
    if (finalChunk) parts.push(finalChunk);

    const mergedPages: string[] = [];
    let current = '';
    for (const p of parts) {
      if (!current) {
        current = p;
      } else if (current.length + p.length < 2400) {
        current += '\n\n' + p;
      } else {
        mergedPages.push(current);
        current = p;
      }
    }
    if (current) mergedPages.push(current);
    if (mergedPages.length > 1) return finalPagesOrChunk(mergedPages);
  }

  // 3. Fallback for long paragraphs (> 2400 chars)
  const paragraphs = theoryText.split(/\n\n+/);
  const pages: string[] = [];
  let currentGroup = '';
  for (const para of paragraphs) {
    if ((currentGroup + para).length > 2500 && currentGroup.length > 600) {
      pages.push(currentGroup.trim());
      currentGroup = para;
    } else {
      currentGroup = currentGroup ? `${currentGroup}\n\n${para}` : para;
    }
  }
  if (currentGroup.trim()) {
    pages.push(currentGroup.trim());
  }

  return pages.length > 0 ? pages : [theoryText];
}

function finalPagesOrChunk(pages: string[]): string[] {
  return pages.filter(Boolean);
}

export default function TopicTheoryReader({
  rawTheoryText,
  topicId,
  isUserAdmin,
  diagramReplacements,
  onUpdateDiagramReplacement,
  getDiagramKey,
  language = 'uz'
}: TopicTheoryReaderProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isPaged, setIsPaged] = useState(true); // Default to paged view to save space

  // Reset page when theory text changes
  useEffect(() => {
    setCurrentPage(1);
  }, [rawTheoryText]);

  // Compute pages
  const pages = useMemo(() => {
    return splitTheoryIntoPages(rawTheoryText);
  }, [rawTheoryText]);

  const totalPages = pages.length;
  const currentContent = isPaged && totalPages > 1 ? pages[currentPage - 1] : rawTheoryText;

  const handlePageChange = (p: number) => {
    setCurrentPage(p);
    const container = document.getElementById('topic-theory-container');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const labels = {
    paged: { uz: "Sahifalab o'qish", ru: "По страницам", en: "Paged" }[language] || "Sahifalab o'qish",
    all: { uz: "Barchasi (To'liq)", ru: "Весь текст", en: "All" }[language] || "Barchasi",
    prev: { uz: "Oldingisi", ru: "Предыдущая", en: "Previous" }[language] || "Oldingisi",
    next: { uz: "Keyingisi", ru: "Следующая", en: "Next" }[language] || "Keyingisi",
    pageInfo: { uz: "Qism", ru: "Часть", en: "Part" }[language] || "Qism",
  };

  return (
    <div id="topic-theory-container" className="space-y-6">
      {/* Markdown Content Area directly at top - NO top pagination or top clutter! */}
      <div className="prose prose-slate max-w-none prose-headings:text-brand-primary prose-p:text-brand-muted prose-p:text-lg prose-p:leading-relaxed prose-li:text-brand-muted prose-strong:text-brand-primary prose-strong:font-bold min-h-[250px]">
        <ReactMarkdown
          components={{
            code({ className, children, ...props }) {
              const codeString = String(children).replace(/\n$/, '');
              const isBlock = codeString.includes('\n');
              
              if (className?.includes('language-') || isBlock) {
                const diagKey = getDiagramKey(codeString);
                const replacement = diagramReplacements?.[diagKey] || null;
                return (
                  <CreativeAnatomyDiagram 
                    value={codeString}
                    topicId={topicId}
                    isAdmin={isUserAdmin}
                    replacement={replacement}
                    onUpdateReplacement={(newRep) => {
                      if (onUpdateDiagramReplacement) {
                        onUpdateDiagramReplacement(diagKey, newRep);
                      }
                    }}
                  />
                );
              }
              return <code className={className} {...props}>{children}</code>;
            }
          }}
        >
          {currentContent}
        </ReactMarkdown>
      </div>

      {/* Bottom Section - ONLY AT THE BOTTOM: Navigation, page switcher, and pagination */}
      {totalPages > 1 && (
        <div className="space-y-4 pt-6 border-t border-slate-100">
          {/* Quick next / prev section action cards */}
          {isPaged && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {currentPage > 1 ? (
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="flex items-center gap-2.5 p-3.5 bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-200 rounded-2xl text-left transition-all group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-indigo-600 shrink-0">
                    <ChevronLeft className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Oldingi qism</div>
                    <div className="text-xs font-bold text-slate-700 group-hover:text-indigo-600">
                      Sahifa {currentPage - 1} ga qaytish
                    </div>
                  </div>
                </button>
              ) : <div />}

              {currentPage < totalPages ? (
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="flex items-center justify-end gap-2.5 p-3.5 bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-200 rounded-2xl text-right transition-all group cursor-pointer sm:col-start-2"
                >
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">Keyingi qism</div>
                    <div className="text-xs font-bold text-slate-700 group-hover:text-indigo-600">
                      Sahifa {currentPage + 1} ni o'qish
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-indigo-600 shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              ) : <div />}
            </div>
          )}

          {/* Mode toggle and progress bar sitting right above pagination at the bottom */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-slate-50/80 border border-slate-200/80 rounded-2xl">
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setIsPaged(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  isPaged
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-indigo-600'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{labels.paged}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsPaged(false)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  !isPaged
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-indigo-600'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{labels.all}</span>
              </button>
            </div>

            {isPaged && (
              <div className="flex items-center gap-3">
                <div className="text-xs font-bold text-slate-600">
                  <span className="text-slate-400 font-medium">{labels.pageInfo}: </span>
                  <strong className="text-indigo-600 font-black">{currentPage}</strong> / {totalPages}
                </div>
                <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden hidden sm:block">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
                    style={{ width: `${(currentPage / totalPages) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Bottom Pagination Bar */}
          {isPaged && (
            <div className="bg-white p-4 rounded-2xl border border-brand-border/60 shadow-xs">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                scrollTargetId="topic-theory-container"
                prevLabel={labels.prev}
                nextLabel={labels.next}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
