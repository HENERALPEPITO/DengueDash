"use client";

import { Separator } from "@/shadcn/components/ui/separator";
import { useEffect, useState } from "react";
import { Trash2, UserCog } from "lucide-react";
import { Button } from "@shadcn/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@shadcn/components/ui/card";
import { CustomAlertDialog } from "@/components/common/CustomAlertDialog";
import { toast } from "sonner";
import { UserDetailInterface } from "@/interfaces/account/user-interface";
import fetchService from "@/services/fetch.service";
import { formatDateTime } from "@/lib/utils/format-datetime.util";
import { BaseServiceResponse } from "@/interfaces/services/services.interface";
import deleteService from "@/services/delete.service";
import { useRouter } from "next/navigation";
import { defaultToastSettings } from "@/lib/utils/common-variables.util";
import patchService from "@/services/patch.service";

export default function UserDetailView({ params }: any) {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { id } = await params;
        const response: UserDetailInterface =
          await fetchService.getUserDetails(id);
        setUserData(response);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };
    fetchData();
  }, [params]);

  const router = useRouter();

  const [userData, setUserData] = useState<UserDetailInterface>();

  const handleRoleToggle = async () => {
    if (userData?.role !== undefined && userData?.id !== undefined) {
      const response: BaseServiceResponse = await patchService.toggleUserRole(
        userData.id
      );
      if (response.success) {
        const newRole = userData.role === "Encoder" ? "Admin" : "Encoder";
        setUserData({ ...userData, role: newRole });
        toast.success("User Role Updated", {
          description: `The user role has been successfully updated to ${newRole}`,
          duration: defaultToastSettings.duration,
          dismissible: defaultToastSettings.isDismissible,
        });
      } else {
        toast.error("Failed to update user role", {
          description: response.message,
          duration: defaultToastSettings.duration,
          dismissible: defaultToastSettings.isDismissible,
        });
      }
    } else {
      toast.error("Failed to update user role", {
        description: "Something went wrong",
        duration: defaultToastSettings.duration,
        dismissible: defaultToastSettings.isDismissible,
      });
    }
  };

  const handleDelete = async () => {
    if (userData?.id !== undefined) {
      const response: BaseServiceResponse = await deleteService.deleteUser(
        userData.id
      );
      if (response.success) {
        router.push("/admin/accounts/manage/?status=user-deleted");
      } else {
        toast.error("Failed to delete user", {
          description: response.message,
          duration: defaultToastSettings.duration,
          dismissible: defaultToastSettings.isDismissible,
        });
      }
    } else {
      toast.error("Failed to delete user", {
        description: "Something went wrong",
        duration: defaultToastSettings.duration,
        dismissible: defaultToastSettings.isDismissible,
      });
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row justify-between gap-1">
        <div>
          <p className="text-2xl lg:text-4xl font-bold">User Profile</p>
          <p className="mt-1 lg:mt-2 text-sm lg:text-md text-gray-500">
            View and manage user details
          </p>
        </div>
      </div>
      <Separator className="mt-2" />
      <div className="container py-5">
        <Card className="shadow-md">
          <CardHeader className="pb-4"></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Name
                </h3>
                <p className="font-medium">{userData?.full_name}</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Email
                </h3>
                <p className="font-medium">{userData?.email}</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Sex
                </h3>
                <p className="font-medium">{userData?.sex_display}</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Role
                </h3>
                <p className="font-medium capitalize">{userData?.role}</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Hospital (DRU)
                </h3>
                <p className="font-medium">{userData?.dru}</p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-6 md:grid-cols-3">
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Created At
                </h3>
                <p className="font-medium">
                  {userData?.created_at
                    ? formatDateTime(userData.created_at)
                    : "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Updated At
                </h3>
                <p className="font-medium">
                  {userData?.updated_at
                    ? formatDateTime(userData.updated_at)
                    : "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Last Login
                </h3>
                <p className="font-medium">
                  {userData?.last_login
                    ? formatDateTime(userData.last_login)
                    : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between gap-2 pt-4">
            <CustomAlertDialog
              title="Update User Role"
              description={`Are you sure you want to ${
                userData?.role === "Encoder" ? "promote" : "demote"
              } this user?`}
              actionLabel="Update Role"
              onAction={handleRoleToggle}
            >
              <Button variant="outline" className="flex-1">
                <UserCog className="mr-2 h-4 w-4" />
                {userData?.role === "Encoder"
                  ? "Promote to Admin"
                  : "Demote to Encoder"}
              </Button>
            </CustomAlertDialog>

            <CustomAlertDialog
              title="Delete User"
              description="Are you sure you want to delete this user? This action cannot be undone."
              actionLabel="Delete"
              onAction={handleDelete}
              variant="destructive"
            >
              <Button variant="destructive" className="flex-1">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete User
              </Button>
            </CustomAlertDialog>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
