"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function PaginationTasks({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const previousPage = currentPage - 1;
  const nextPage = currentPage + 1;
  

  const getPageNumbers = () => {
    let pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={`${currentPage === 1 ? "pointer-events-none opacity-50" : ""}`}
            href={`/tasks?page=${previousPage}`}
          />
        </PaginationItem>
        {getPageNumbers().map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href={`/tasks?page=${page}`}
              isActive={currentPage === page}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        

        <PaginationItem>
          <PaginationNext
            className={`${totalPages - currentPage === 0 ? "pointer-events-none opacity-50" : ""}`}
            href={`/tasks?page=${nextPage}`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
