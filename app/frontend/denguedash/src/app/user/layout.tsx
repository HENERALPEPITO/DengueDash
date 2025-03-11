"use client";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@shadcn/components/ui/sidebar";
import AppSidebar from "@components/user/AppSidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shadcn/components/ui/breadcrumb";
import { Separator } from "@/shadcn/components/ui/separator";
import { useEffect, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [segment, setSegment] = useState<string | null>(null);
  useEffect(() => {
    setSegment(window.location.pathname.split("/")[2]);
  }, []);

  if (segment == null) {
    return null;
  }

  return (
    <div className="flex justify-center gap-4 px-5 pt-2 pb-5">
      <div className="w-5/6">
        <SidebarProvider>
          <AppSidebar sectionSegment={segment} isAdmin={false} />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">
                        Building Your Application
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <main>{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  );
}
