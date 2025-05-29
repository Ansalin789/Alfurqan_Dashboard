// components/Pagination.tsx
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const generatePageNumbers = (current: number, total: number): (number | string)[] => {
  const pages: (number | string)[] = [];

  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  pages.push(1);

  if (current > 3) pages.push("...");

  const startPage = Math.max(2, current - 1);
  const endPage = Math.min(total - 1, current + 1);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (current < total - 2) pages.push("...");

  pages.push(total);

  return pages;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pages = generatePageNumbers(currentPage, totalPages);

  return (
    <div className="flex items-end justify-end space-x-2 mt-6 dark:bg-[">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((page, index) =>
        typeof page === "number" ? (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`w-9 h-9 text-sm flex items-center justify-center rounded-md ${
              currentPage === page
                ? "bg-white border border-blue-500 text-blue-700"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            {page}
          </button>
        ) : (
          <span
            key={index}
            className="w-9 h-9 flex items-center justify-center text-gray-500"
          >
            ...
          </span>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
