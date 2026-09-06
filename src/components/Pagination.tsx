import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  scrollTargetId?: string;
  className?: string;
  totalItems?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  prevLabel?: string;
  nextLabel?: string;
  theme?: 'light' | 'dark';
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  scrollTargetId,
  className = '',
  totalItems,
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
  prevLabel = "Oldingisi",
  nextLabel = "Keyingisi",
  theme = 'light'
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);

    if (scrollTargetId) {
      const el = document.getElementById(scrollTargetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Generate compact page numbers (max 7 items total, prevents overflowing screen)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Near start
    if (currentPage <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push('...');
      pages.push(totalPages);
      return pages;
    }

    // Near end
    if (currentPage >= totalPages - 3) {
      pages.push(1);
      pages.push('...');
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // In middle
    pages.push(1);
    pages.push('...');
    pages.push(currentPage - 1);
    pages.push(currentPage);
    pages.push(currentPage + 1);
    pages.push('...');
    pages.push(totalPages);
    
    return pages;
  };

  const pageNumbers = getPageNumbers();
  const isDark = theme === 'dark';

  return (
    <div className={`w-full flex flex-col md:flex-row items-center justify-between gap-3 py-2 px-1 max-w-full overflow-hidden ${className}`}>
      {/* Optional count / items indicator */}
      {totalItems !== undefined && pageSize !== undefined ? (
        <div className={`text-xs font-semibold shrink-0 text-center md:text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Ko'rsatilmoqda:{' '}
          <strong className={isDark ? 'text-white' : 'text-slate-900'}>
            {Math.min((currentPage - 1) * pageSize + 1, totalItems)}–{Math.min(currentPage * pageSize, totalItems)}
          </strong>{' '}
          / jami <strong className={isDark ? 'text-amber-400' : 'text-indigo-600'}>{totalItems}</strong> ta
        </div>
      ) : (
        <div className={`text-xs font-semibold shrink-0 text-center md:text-left ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Sahifa <strong className={isDark ? 'text-white' : 'text-slate-900'}>{currentPage}</strong> / {totalPages}
        </div>
      )}

      {/* Main pagination numbers & Next/Prev bar - safe from overflowing */}
      <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-center select-none max-w-full">
        {/* Previous Button */}
        {currentPage > 1 && (
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
              isDark
                ? 'text-sky-400 hover:text-sky-300 hover:bg-sky-950/40 active:scale-95'
                : 'text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 active:scale-95'
            }`}
          >
            <ChevronLeft className="w-4 h-4 shrink-0" />
            <span className="hidden xs:inline sm:inline">{prevLabel}</span>
          </button>
        )}

        {/* Page Numbers */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-center">
          {pageNumbers.map((p, idx) => {
            if (p === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className={`px-1.5 py-1 text-xs font-bold shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}
                >
                  ...
                </span>
              );
            }

            const pageNum = Number(p);
            const isActive = pageNum === currentPage;

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => handlePageChange(pageNum)}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                  isActive
                    ? isDark
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm scale-105'
                      : 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105'
                    : isDark
                      ? 'text-sky-400 hover:text-sky-300 hover:bg-slate-800/80 active:scale-95'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/80 active:scale-95'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        {currentPage < totalPages && (
          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
              isDark
                ? 'text-sky-400 hover:text-sky-300 hover:bg-sky-950/40 active:scale-95'
                : 'text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 active:scale-95'
            }`}
          >
            <span className="hidden xs:inline sm:inline">{nextLabel}</span>
            <ChevronRight className="w-4 h-4 shrink-0" />
          </button>
        )}
      </div>

      {/* Optional Page Size Selector */}
      {pageSizeOptions && onPageSizeChange && pageSize && (
        <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
          <span>Har sahifada:</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className={`px-2 py-1 rounded-lg border text-xs font-bold outline-none cursor-pointer ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-white'
                : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            {pageSizeOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt} ta
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
