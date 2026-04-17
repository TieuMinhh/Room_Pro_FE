"use client"
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { CircleHelpIcon, MessageSquareIcon, SettingsIcon } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const items = [
  {
    title: 'Feedback',
    url: "/feedback-tenant",
    icon: MessageSquareIcon
  }
]
export const SupportSection = () => {
  const location = useLocation();
  return (
    <SidebarGroup>
      <SidebarGroupLabel className='text-black-foreground text-lg'>Hỗ trợ</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu >
          {items.map((item) => (
            <SidebarMenuItem key={item.title} >
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                isActive={location.pathname === item.url}
              // onClick={() => {}}
              >
                <Link to={item.url} className='flex items-center gap-2 p-2 text-sm font-semibold text-black-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors'>
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
