"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppBreadcrumbs } from "@/components/app-breadcrumbs";
import { navLinks } from "@/components/app-shared";

export function AppHeader() {
  const pathname = usePathname();
  const activeItem = navLinks.find((item) => item.url === pathname) ?? {
    title: "Overview",
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border bg-background px-4 md:px-6"
      )}
    >
      <div className="flex items-center gap-2">
        <SidebarTrigger className="md:hidden" />
        <Separator
          className="mr-2 data-[orientation=vertical]:h-4 md:hidden"
          orientation="vertical"
        />
        <AppBreadcrumbs page={activeItem} />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground font-medium bg-muted px-2.5 py-1 rounded-full">
          SOS Office Admin
        </span>
      </div>
    </header>
  );
}
