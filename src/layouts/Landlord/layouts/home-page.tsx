import { SidebarProvider } from '@/components/ui/sidebar'
import React, { useEffect } from 'react'
import { HomeNavbar } from '../components/home-navbar'
import HomeSidebar from '../components/home-sidebar'
import { Outlet, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/store/slice/userSlice'
import { USER_ROLE } from '@/utils/contanst'
const ALLOWED_ROLES = [USER_ROLE.OWNER];
export const HomeLayout = () => {
  const currentUser = useSelector(selectCurrentUser);

  const navigate = useNavigate();
  useEffect(() => {
    if (currentUser) {
      if (currentUser && !ALLOWED_ROLES.includes(currentUser.role)) {
        navigate("/not-found");
      }
    }

  }, [])
  return (
    <SidebarProvider >
      <div className="w-full min-h-screen">
        <HomeNavbar />
        <div className="flex flex-col md:flex-row ">
          <HomeSidebar />
          <main className='flex-1 !overflow-y-hidden min-h-[calc(80vh)] p-3 ' style={{ backgroundColor: 'hsl(0, 0%, 99%)' }}>
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
