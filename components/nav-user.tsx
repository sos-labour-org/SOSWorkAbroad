"use client";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ChevronsUpDownIcon, LogOutIcon, ShieldCheck } from "lucide-react";
import { signOut } from "@/app/sos-office/login/actions";

export function NavUser() {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu className="border-t border-border p-2">
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton className="text-muted-foreground hover:text-foreground" />
            }
          >
            <Avatar className="size-6">
              <AvatarFallback className="bg-primary text-on-primary text-xs font-bold">
                SA
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-left text-xs leading-tight">
              <span className="font-semibold text-foreground">SOS Admin</span>
              <span className="text-[10px] text-muted-foreground">Officer</span>
            </div>
            <ChevronsUpDownIcon className="ml-auto size-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="min-w-48"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <ShieldCheck className="size-3.5 text-primary" />
              Verified Administrator
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer"
              onClick={() => signOut()}
            >
              <LogOutIcon className="size-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
