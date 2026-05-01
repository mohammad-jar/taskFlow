"use client";
import {
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSearchParams } from "next/navigation";

export function PaginationTasks({
  currentPage,
  totalPages,
  workspaceId,
}: {
  currentPage: number;
  totalPages: number;
  workspaceId: string;
}) {
  const searchParams = useSearchParams();
  const createPageURL = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());

    return `/workspaces/${workspaceId}/tasks?${params.toString()}`;
  };

  return (
    <PaginationContent>
      <PaginationItem>
        <PaginationPrevious
          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
          href={createPageURL(currentPage - 1)}
        />
      </PaginationItem>

      {Array.from({ length: totalPages }).map((_, i) => {
        const page = i + 1;
        return (
          <PaginationItem key={page}>
            <PaginationLink
              href={createPageURL(page)}
              isActive={currentPage === page}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        );
      })}

      <PaginationItem>
        <PaginationNext
          className={
            currentPage === totalPages ? "pointer-events-none opacity-50" : ""
          }
          href={createPageURL(currentPage + 1)}
        />
      </PaginationItem>
    </PaginationContent>
  );
}
