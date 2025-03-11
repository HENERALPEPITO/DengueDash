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

import { Button } from "@/shadcn/components/ui/button";
import {
  Case,
  DengueReportPagination,
} from "@interfaces/dengue-reports/dengue-reports.interface";
import Link from "next/link";
import fetchService from "@/services/fetch.service";
import { Separator } from "@/shadcn/components/ui/separator";
import CustomPagination from "../common/CustomPagination";

export default function Component() {
  const [cases, setCases] = useState<Case[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchCases(currentPage);
  }, [currentPage]);

  const fetchCases = async (page: number) => {
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
    <div className="flex flex-col gap-3">
      <div className="flex flex-row justify-between gap-1">
        <div>
          <p className="text-2xl lg:text-4xl font-bold">Dengue Reports</p>
        </div>
      </div>
      <Separator className="mt-2" />
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

        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
      </div>
      ;
    </div>
  );
}
