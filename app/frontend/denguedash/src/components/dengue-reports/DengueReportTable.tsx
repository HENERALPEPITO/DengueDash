"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shadcn/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@shadcn/components/ui/pagination";
import { Button } from "@/shadcn/components/ui/button";
import {
  Case,
  DengueReportPagination,
} from "@interfaces/dengue-reports/dengue-reports.interface";
import Link from "next/link";
import fetchService from "@/services/fetch.service";

export default function Component() {
  const [cases, setCases] = useState<Case[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const fetchUsers = async (page: number) => {
    setIsLoading(true);
    try {
      const response: DengueReportPagination =
        await fetchService.getDengueReports(page, itemsPerPage);
      const data: Case[] = response.results;
      setCases(data);

      const totalCount = parseInt(response.count.toString() || "0", 10);
      setTotalPages(Math.ceil(totalCount / itemsPerPage));
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4 border border-gray-200 rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Case ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Barangay</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Date Consulted</TableHead>
            <TableHead>Clincal Classification</TableHead>
            <TableHead>Case Classification</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : (
            cases.map((dengueCase) => (
              <TableRow key={dengueCase.case_id}>
                <TableCell>{dengueCase.case_id}</TableCell>
                <TableCell>{dengueCase.patient.full_name}</TableCell>
                <TableCell>{dengueCase.patient.addr_barangay}</TableCell>
                <TableCell>{dengueCase.patient.addr_city}</TableCell>
                <TableCell>{dengueCase.date_con}</TableCell>
                <TableCell>{dengueCase.clncl_class_display}</TableCell>
                <TableCell>{dengueCase.case_class_display}</TableCell>
                <TableCell>
                  <Button variant={"outline"} asChild>
                    <Link href={`dengue-reports/${dengueCase.case_id}`}>
                      Open
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
                size="default"
              />
            </PaginationItem>

            {(() => {
              const pageNumbers = [];
              if (totalPages <= 5) {
                // If there are 5 or fewer pages, show all
                for (let i = 1; i <= totalPages; i++) {
                  pageNumbers.push(i);
                }
              } else {
                // Always show first page
                pageNumbers.push(1);

                if (currentPage > 3) {
                  pageNumbers.push(null); // null represents ellipsis
                }

                // Show current page and one or two surrounding pages
                for (
                  let i = Math.max(2, currentPage - 1);
                  i <= Math.min(totalPages - 1, currentPage + 1);
                  i++
                ) {
                  pageNumbers.push(i);
                }

                if (currentPage < totalPages - 2) {
                  pageNumbers.push(null); // null represents ellipsis
                }

                // Always show last page
                pageNumbers.push(totalPages);
              }

              return pageNumbers.map((page, index) =>
                page === null ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                      size="default"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              );
            })()}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
                size="default"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
