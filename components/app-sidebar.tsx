"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { footerNavLinks, navGroups } from "@/components/app-shared";
import { NavUser } from "@/components/nav-user";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      className="static min-h-full *:data-[slot=sidebar-inner]:bg-background"
      collapsible="offcanvas"
      variant="sidebar"
    >
      <SidebarHeader className="relative h-14 justify-center px-4 py-0">
        <Link
          className="flex items-center gap-1.5 font-bold text-base"
          href="/sos-office"
        >
          <span>SOS</span>
          <span className="text-primary font-extrabold">Office</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group, index) => (
          <SidebarGroup key={`sidebar-group-${index}`}>
            {group.label && (
              <SidebarGroupLabel className="font-medium text-xs text-muted-foreground uppercase tracking-wider">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarMenu>
              {group.items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.title}
                      render={<Link href={item.url} />}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="gap-0 p-0">
        {footerNavLinks.length > 0 && (
          <SidebarMenu className="border-t p-2">
            {footerNavLinks.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  className="text-muted-foreground"
                  isActive={pathname === item.url}
                  size="sm"
                  render={<Link href={item.url} />}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        )}
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
