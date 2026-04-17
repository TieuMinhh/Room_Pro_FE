import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import { HomeNavbar } from "../components/home-navbar";
import HomeSidebar from "../components/home-sidebar";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/slice/userSlice";

export const TenantLayout = () => {
  const currentUser = useSelector(selectCurrentUser);
  console.log(
    "🚀 ~ file: home-page.tsx:8 ~ TenantLayout ~ currentUser:",
    currentUser
  );
  return (
    <SidebarProvider>
      <div className="w-full min-h-screen">
        <HomeNavbar />
        <div className="flex flex-col md:flex-row ">
          <HomeSidebar />
          <main
            className="flex-1 !overflow-y-hidden min-h-[calc(80vh)] p-3 "
            style={{ backgroundColor: "hsl(0, 0%, 99%)" }}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
