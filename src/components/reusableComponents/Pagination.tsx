import React from "react";

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPageInfo?: boolean;
  maxVisiblePages?: number;
}

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  showPageInfo = true,
  maxVisiblePages = 7
}: Props) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(currentPage - half, 1);
    let end = Math.min(start + maxVisiblePages - 1, totalPages);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(end - maxVisiblePages + 1, 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const visiblePages = getVisiblePages();
  const showFirstPage = visiblePages[0] > 1;
  const showLastPage = visiblePages[visiblePages.length - 1] < totalPages;
  const showStartEllipsis = visiblePages[0] > 2;
  const showEndEllipsis = visiblePages[visiblePages.length - 1] < totalPages - 1;

  const PaginationButton = ({ 
    children, 
    onClick, 
    disabled = false, 
    active = false,
    className = ""
  }: {
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    active?: boolean;
    className?: string;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative inline-flex items-center justify-center
        min-w-[40px] h-10 px-3 py-2
        text-sm font-medium
        rounded-lg
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:cursor-not-allowed
        ${active 
          ? 'bg-blue-600 text-white shadow-lg transform scale-105 hover:bg-blue-700' 
          : disabled 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md'
        }
        ${className}
      `}
    >
      {children}
    </button>
  );

  const Ellipsis = () => (
    <span className="inline-flex items-center justify-center min-w-[40px] h-10 px-3 py-2 text-gray-500">
      ...
    </span>
  );

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Page Info */}
      {showPageInfo && (
        <div className="text-sm text-gray-600">
          Page <span className="font-semibold">{currentPage}</span> of{' '}
          <span className="font-semibold">{totalPages}</span>
        </div>
      )}

      {/* Pagination Controls */}
      <nav className="flex items-center space-x-1" aria-label="Pagination">
        {/* Previous Button */}
        <PaginationButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="mr-2"
        >
          <svg 
            className="w-4 h-4 mr-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </PaginationButton>

        {/* First Page */}
        {showFirstPage && (
          <>
            <PaginationButton
              onClick={() => onPageChange(1)}
              active={currentPage === 1}
            >
              1
            </PaginationButton>
            {showStartEllipsis && <Ellipsis />}
          </>
        )}

        {/* Visible Pages */}
        {visiblePages.map((num) => (
          <PaginationButton
            key={num}
            onClick={() => onPageChange(num)}
            active={currentPage === num}
          >
            {num}
          </PaginationButton>
        ))}

        {/* Last Page */}
        {showLastPage && (
          <>
            {showEndEllipsis && <Ellipsis />}
            <PaginationButton
              onClick={() => onPageChange(totalPages)}
              active={currentPage === totalPages}
            >
              {totalPages}
            </PaginationButton>
          </>
        )}

        {/* Next Button */}
        <PaginationButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="ml-2"
        >
          Next
          <svg 
            className="w-4 h-4 ml-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </PaginationButton>
      </nav>
    </div>
  );
};

export default Pagination;