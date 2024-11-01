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
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@shadcn/components/ui/pagination";
import {
  Case,
  DengueReportPagination,
} from "@interfaces/dengue-reports/dengue-reports.interface";
import getService from "@services/get.service";

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
        await getService.getDengueReports(page, itemsPerPage);
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
    <div className="container mx-auto p-4">
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
                <TableCell>{dengueCase.patient.ca_barangay}</TableCell>
                <TableCell>{dengueCase.patient.ca_city}</TableCell>
                <TableCell>{dengueCase.date_con}</TableCell>
                <TableCell>{dengueCase.clncl_class_display}</TableCell>
                <TableCell>{dengueCase.case_class_display}</TableCell>
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
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
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
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
