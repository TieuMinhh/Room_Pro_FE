"use client"

import {
  BellIcon,
  ChevronDownIcon,
  CreditCardIcon,
  LogOutIcon,
  UserCircleIcon
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useDispatch, useSelector } from "react-redux"
import { logoutUserAPIs, selectCurrentUser } from "@/store/slice/userSlice"
import { Link, useNavigate } from "react-router-dom"

export function NavUser() {
  const { isMobile } = useSidebar()
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const handleLogout = () => {
    const result = dispatch(logoutUserAPIs());
  }
  const navigate = useNavigate();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground relative"
            >

              <Avatar className="h-10 w-10 rounded-lg">
                <AvatarImage src={currentUser?.avatar}
                  alt={''} />
                <AvatarFallback className="rounded-lg">{currentUser?.displayName?.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="absolute bottom-0 right-4 border-3  bg-white rounded-full">
                <ChevronDownIcon className=" h-4 w-4 text-black" />
              </div>

            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "bottom"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-4 w-4 rounded-lg">
                  <AvatarImage src={currentUser?.avatar} alt={''} />
                  <AvatarFallback className="rounded-lg">{currentUser?.displayName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{currentUser?.displayName}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {currentUser?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="flex gap-2">
                <UserCircleIcon />
                <Link to="/profile">Tài khoản</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex gap-2" onClick={() => navigate('/packages')}>
                <CreditCardIcon />
                Nâng cấp
              </DropdownMenuItem>

            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => handleLogout()}>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
