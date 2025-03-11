import AccountsTable from "@/components/accounts/AccountsTable";
import UnverifiedAccountsTable from "@/components/accounts/UnverifiedAccountsTable";
import { Separator } from "@/shadcn/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@shadcn/components/ui/tabs";

export default function ManageAccounts() {
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
