"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shadcn/components/ui/table";
import {
  UnverifiedUserBriefDetail,
  UnverifiedUserListPagination,
} from "@/interfaces/account/user-interface";
import fetchService from "@/services/fetch.service";
import { useEffect, useState } from "react";
import CustomPagination from "../common/CustomPagination";
import { Skeleton } from "@/shadcn/components/ui/skeleton";
import { Button } from "@/shadcn/components/ui/button";
import patchService from "@/services/patch.service";
import { CustomAlertDialog } from "../common/CustomAlertDialog";
import { BaseServiceResponse } from "@/interfaces/services/services.interface";
import deleteService from "@/services/delete.service";
import { toast } from "sonner";
import { defaultToastSettings } from "@/lib/utils/common-variables.util";

export default function UnverifiedAccountsTable() {
  const [users, setUsers] = useState<UnverifiedUserBriefDetail[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const fetchUsers = async (page: number) => {
    setIsLoading(true);
    try {
      const response: UnverifiedUserListPagination =
        await fetchService.getUsersUnverifiedList(page, itemsPerPage);
      const data: UnverifiedUserBriefDetail[] = response.results;
      setUsers(data);

      const totalCount = parseInt(response.count.toString() || "0", 10);
      setTotalPages(Math.ceil(totalCount / itemsPerPage));
      console.log(totalPages);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const approveUser = async (userId: number) => {
    const response: BaseServiceResponse =
      await patchService.approveUserVerification(userId);
    if (response.success) {
      toast.success("User Approved", {
        description: "The selected user has been successfully approved",
        duration: defaultToastSettings.duration,
        dismissible: defaultToastSettings.isDismissible,
      });
      fetchUsers(currentPage);
      // todo: email the user that their account has been approved
    } else {
      toast.error("Failed to approve user", {
        description: response.message,
        duration: defaultToastSettings.duration,
        dismissible: defaultToastSettings.isDismissible,
      });
    }
  };

  const deleteUnverifiedUser = async (userId: number) => {
    const response: BaseServiceResponse =
      await deleteService.deleteUser(userId);
    if (response.success) {
      toast.success("User Deleted", {
        description: "The selected user has been successfully deleted",
        duration: defaultToastSettings.duration,
        dismissible: defaultToastSettings.isDismissible,
      });
      fetchUsers(currentPage);
      // todo: email the user that their account has been disapproved
    } else {
      toast.error("Failed to delete user", {
        description: response.message,
        duration: defaultToastSettings.duration,
        dismissible: defaultToastSettings.isDismissible,
      });
    }
  };

  return (
    <div className="container mx-auto p-4 border border-gray-200 rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Sex</TableHead>
            <TableHead>Created At</TableHead>
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
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No Pending Unverified Accounts
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.full_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.sex_display}</TableCell>
                <TableCell>{user.created_at}</TableCell>
                <TableCell className="flex gap-3">
                  <CustomAlertDialog
                    title="Approve User"
                    description="Are you sure you want to approve this user? This action cannot be undone."
                    actionLabel="Approve"
                    onAction={() => approveUser(user.id)}
                  >
                    <Button variant={"default"}>Approve</Button>
                  </CustomAlertDialog>
                  <CustomAlertDialog
                    title="Approve User"
                    description="Are you sure you want to delete this user? This action cannot be undone."
                    actionLabel="Delete"
                    variant="destructive"
                    onAction={() => deleteUnverifiedUser(user.id)}
                  >
                    <Button variant={"destructive"}>Delete</Button>
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
