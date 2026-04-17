"use client";

import * as React from "react";
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  Receipt,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavDocuments } from "./nav-documents";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Trang chủ",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },

    {
      title: "Quản lý tài khoản",
      url: "/manage-user",
      icon: UsersIcon,
    },
    {
      title: "Quản lý gói",
      url: "/package",
      icon: Receipt,
    },
    {
      title: "Lịch sử thanh toán",
      url: "/history",
      icon: FolderIcon,
    },
  ],

  navSecondary: [
    {
      title: "Cài đặt",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: "Trợ giúp",
      url: "#",
      icon: HelpCircleIcon,
    },
    {
      title: "Tìm kiếm",
      url: "#",
      icon: SearchIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <img title="icon" src="/favicon.ico" className="h-6 w-6" />
                <span className="text-base font-semibold text-rental-500">
                  RoomPro
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <hr className="my-2 border-border" />
        <NavSecondary items={data.navSecondary} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
