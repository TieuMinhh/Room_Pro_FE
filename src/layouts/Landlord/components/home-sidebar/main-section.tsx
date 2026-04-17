import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { CalendarIcon, FileBadgeIcon, FilePenLineIcon, FlameIcon, HomeIcon, HotelIcon, LibraryBigIcon, PenLineIcon, PlaySquareIcon, UserPenIcon } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom';

const items = [
  {
    title: 'Trang chủ',
    url: "/home-page",
    icon: HomeIcon,
    auth: true
  },
  {
    title: 'Phòng Trọ',
    url: "/rooms",
    icon: HotelIcon,
    auth: true
  },
  {
    title: 'Thuê Phòng',
    url: "/order-rooms",
    icon: CalendarIcon,
  },
  {
    title: 'Người thuê phòng',
    url: "/tenants",
    icon: UserPenIcon,
  },
  {
    title: 'Hóa Đơn ',
    url: "/bills",
    icon: FileBadgeIcon,
  },
  {
    title: 'Chi Phí Phát Sinh',
    url: "/incidental-costs",
    icon: PenLineIcon,
  },
  {
    title: 'Đơn Đặt Phòng',
    url: "/book-room-manager",
    icon: FilePenLineIcon,
  },


]
export const MainSection = () => {
  const location = useLocation();
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu >
          {items.map((item) => (
            <SidebarMenuItem key={item.title} >
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                isActive={location.pathname === item.url}

              >
                <Link to={item.url} className='flex items-center gap-2 p-2 text-sm font-medium text-black-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors'>
                  <item.icon />
                  <span className='text-sm font-medium'>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
