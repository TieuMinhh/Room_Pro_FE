import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { CalendarIcon, FileBadgeIcon, History, HotelIcon, SendIcon } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom';

const items = [

  {
    title: 'Phòng Trọ',
    url: "/tenant-rooms",
    icon: HotelIcon,
    auth: true
  },
  {
    title: 'Lịch sử thuê',
    url: "/tenant/history",
    icon: History,
  },
  {
    title: 'Hợp đồng',
    url: "/contracts",
    icon: CalendarIcon,
  },

  {
    title: 'Hóa Đơn ',
    url: "/bill-tenant",
    icon: FileBadgeIcon,
  },
  {
    title: "Đặt phòng trọ",
    url: "/book-rooms",
    icon: SendIcon
  }

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
