"use client";

import AccountsTable from "@/components/accounts/AccountsTable";
import UnverifiedAccountsTable from "@/components/accounts/UnverifiedAccountsTable";
import { defaultToastSettings } from "@/lib/utils/common-variables.util";
import { Separator } from "@/shadcn/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@shadcn/components/ui/tabs";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function ManageAccounts() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const toastShownRef = useRef(false);

  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "user-deleted" && !toastShownRef.current) {
      // Prevent showing the toast again
      toastShownRef.current = true;

      toast.success("User Deleted", {
        description: "The selected user has been successfully deleted",
        duration: defaultToastSettings.duration,
        dismissible: defaultToastSettings.isDismissible,
      });

      // Remove the query parameter from the URL to prevent showing the toast again on refresh
      // This creates a new URL without the status parameter
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("status");

      // Replace the current URL without the status parameter
      // Using replace() instead of push() to avoid adding to the browser history
      router.replace(newUrl.pathname + newUrl.search);
    }
  }, [searchParams, router]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row justify-between gap-1">
        <div>
          <p className="text-2xl lg:text-4xl font-bold">Manage Accounts</p>
        </div>
      </div>
      <Separator className="mt-2" />

      <div className="container mx-auto py-6">
        <Tabs defaultValue="verified" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="verified" className="px-6">
              Verified
            </TabsTrigger>
            <TabsTrigger value="pending" className="px-6">
              Pending
            </TabsTrigger>
            <TabsTrigger value="blacklisted" className="px-6">
              Blacklisted
            </TabsTrigger>
          </TabsList>

          <TabsContent value="verified">
            <AccountsTable />
          </TabsContent>

          <TabsContent value="pending">
            <UnverifiedAccountsTable />
          </TabsContent>

          <TabsContent value="blacklisted">
            {/* <RequestsTable status="discontinued" /> */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
