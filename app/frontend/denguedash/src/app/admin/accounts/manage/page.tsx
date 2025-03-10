"use client";

import {
  UserBriefDetail,
  UserListPagination,
} from "@/interfaces/account/user-interface";
import fetchService from "@/services/fetch.service";
import { Separator } from "@/shadcn/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@shadcn/components/ui/table";
import { useEffect, useState } from "react";

export default function ManageAccounts() {
  const [users, setUsers] = useState<UserBriefDetail[]>([]);
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
      const response: UserListPagination = await fetchService.getUsersList(
        page,
        itemsPerPage
      );
      const data: UserBriefDetail[] = response.results;
      setUsers(data);

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
          <p className="text-2xl lg:text-4xl font-bold">Manage Accounts</p>
        </div>
      </div>
      <Separator className="mt-2" />
      <div className="container mx-auto p-4 border border-gray-200 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.full_name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  {/* Todo: Change this shit */}
                  <TableCell>
                    <button className="text-blue-500">Edit</button>
                    <button className="text-red-500">Delete</button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
