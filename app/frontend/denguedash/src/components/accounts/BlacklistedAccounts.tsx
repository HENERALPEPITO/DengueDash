"use client";

import {
  BlacklistedAccount,
  BlacklistedAccountListPagination,
} from "@/interfaces/account/user-interface";
import fetchService from "@/services/fetch.service";
import { useEffect, useState } from "react";
import CustomPagination from "../common/CustomPagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shadcn/components/ui/table";
import { Skeleton } from "@/shadcn/components/ui/skeleton";
import { CustomAlertDialog } from "../common/CustomAlertDialog";
import { Button } from "@/shadcn/components/ui/button";

export default function BlacklistedAccounts() {
  const [blacklistedAccounts, setBlacklistedAccounts] = useState<
    BlacklistedAccount[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchBlacklistedAccounts(currentPage);
  }, []);

  const fetchBlacklistedAccounts = async (page: number) => {
    setIsLoading(true);
    try {
      const response: BlacklistedAccountListPagination =
        await fetchService.getBlacklistedAccounts(page, itemsPerPage);
      const data: BlacklistedAccount[] = response.results;
      setBlacklistedAccounts(data);

      const totalCount = parseInt(response.count.toString() || "0", 10);
      setTotalPages(Math.ceil(totalCount / itemsPerPage));
      console.log(totalPages);
    } catch (error) {
      console.error("Failed to fetch blacklisted accounts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const unbanUser = async (userId: number) => {
    console.log(userId);
  };

  return (
    <div className="container mx-auto p-4 border border-gray-200 rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Date Added</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                <Skeleton className="h-5" />
              </TableCell>
            </TableRow>
          ) : blacklistedAccounts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No Pending Unverified Accounts
              </TableCell>
            </TableRow>
          ) : (
            blacklistedAccounts.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.date_added.split("T")[0]}</TableCell>
                <TableCell className="flex gap-3">
                  <CustomAlertDialog
                    title="Approve User"
                    description="Are you sure you want to unban this user? This action cannot be undone."
                    actionLabel="Approve"
                    onAction={() => unbanUser(user.id)}
                  >
                    <Button variant={"default"}>Unban</Button>
                  </CustomAlertDialog>
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
  );
}
