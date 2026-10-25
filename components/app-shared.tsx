import type React from "react";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Mail,
  Globe,
} from "lucide-react";

export type SidebarNavItem = {
  title: string;
  url: string;
  icon: React.ReactNode;
  isActive?: boolean;
};

export type SidebarNavGroup = {
  label?: string;
  items: SidebarNavItem[];
};

export const navGroups: SidebarNavGroup[] = [
  {
    label: "Management",
    items: [
      {
        title: "Overview",
        url: "/sos-office",
        icon: <LayoutDashboard className="size-4" />,
        isActive: true,
      },
      {
        title: "Applicants",
        url: "/sos-office/applicants",
        icon: <Users className="size-4" />,
      },
      {
        title: "Agents",
        url: "/sos-office/agents",
        icon: <UserCheck className="size-4" />,
      },
      {
        title: "Messages",
        url: "/sos-office/messages",
        icon: <Mail className="size-4" />,
      },
    ],
  },
  {
    label: "Website",
    items: [
      {
        title: "Public Site",
        url: "/",
        icon: <Globe className="size-4" />,
      },
    ],
  },
];

export const footerNavLinks: SidebarNavItem[] = [];

export const navLinks: SidebarNavItem[] = [
  ...navGroups.flatMap((group) => group.items),
  ...footerNavLinks,
];
