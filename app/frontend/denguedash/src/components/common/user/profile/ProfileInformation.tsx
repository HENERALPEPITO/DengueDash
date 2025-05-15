import { UserDetailInterface } from "@/interfaces/account/user-interface";
import { formatDateTime } from "@/lib/utils/format-datetime.util";
import { CardContent } from "@/shadcn/components/ui/card";
import { Separator } from "@/shadcn/components/ui/separator";
import { Skeleton } from "@/shadcn/components/ui/skeleton";

export default function ProfileInformation(
  isLoading: boolean,
  userData: UserDetailInterface | undefined
) {
  return (
    <CardContent className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
          {isLoading ? (
            <Skeleton className="h-5" />
          ) : (
            <p className="font-medium">{userData?.full_name}</p>
          )}
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
          {isLoading ? (
            <Skeleton className="h-5" />
          ) : (
            <p className="font-medium">{userData?.email}</p>
          )}
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground">Sex</h3>
          {isLoading ? (
            <Skeleton className="h-5" />
          ) : (
            <p className="font-medium">{userData?.sex_display}</p>
          )}
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
          {isLoading ? (
            <Skeleton className="h-5" />
          ) : (
            <p className="font-medium">{userData?.role}</p>
          )}
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground">
            Hospital (DRU)
          </h3>
          {isLoading ? (
            <Skeleton className="h-5" />
          ) : (
            <p className="font-medium">{userData?.dru}</p>
          )}
        </div>
      </div>

      <Separator />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground">
            Created At
          </h3>
          {isLoading ? (
            <Skeleton className="h-5" />
          ) : (
            <p className="font-medium">
              {userData?.created_at
                ? formatDateTime(userData.created_at)
                : "N/A"}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground">
            Updated At
          </h3>
          {isLoading ? (
            <Skeleton className="h-5" />
          ) : (
            <p className="font-medium">
              {userData?.updated_at
                ? formatDateTime(userData.updated_at)
                : "N/A"}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-muted-foreground">
            Last Login
          </h3>
          {isLoading ? (
            <Skeleton className="h-5" />
          ) : (
            <p className="font-medium">
              {userData?.last_login
                ? formatDateTime(userData.last_login)
                : "N/A"}
            </p>
          )}
        </div>
      </div>
    </CardContent>
  );
}
