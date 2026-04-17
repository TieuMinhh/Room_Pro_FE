
import { useEffect, useState } from 'react'
import { Sidebar, SidebarContent } from '@/components/ui/sidebar'
import React from 'react'
import { MainSection } from './main-section'
import { Separator } from '@/components/ui/separator'
import { SupportSection } from './support-section'

export default function HomeSidebar() {
  return (
    <Sidebar className='mt-16 z-40 border-none' collapsible='icon'>
      <SidebarContent className='bg-[#F8FAFD] shadow-md'>
        <MainSection />
        <Separator />
        <SupportSection />
      </SidebarContent>
    </Sidebar>
  )
}
