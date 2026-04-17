import { SidebarTrigger } from '@/components/ui/sidebar'
import Notification from './notification'
import { Image } from '@radix-ui/react-avatar'
import { Link } from 'react-router-dom'
import { NavUser } from './nav-user'

export const HomeNavbar = () => {


  return (
    <nav className="flex top-0 left-0 w-full h-16 bg-[#F8FAFD] border-b items-center justify-between px-4" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
      <div className="flex items-center flex-shrink-0">
        <SidebarTrigger />
        <Link to='/' >
          <div className="p-4 flex items-center gap-2 cursor-auto">
            <img
              src='/favicon.ico'
              alt="Logo"
              className="h-8 w-8"
            />
            <span className="font-bold text-xl text-rental-500 ">RoomPro</span>
          </div>
        </Link>


      </div>
      <div className="flex items-center gap-5 ">
        {/* <Input placeholder="Search" className="w-80" /> */}

        <Notification />

        <div className="flex-shrink-0 items-center  flex gap-4">

          <NavUser />
        </div>
      </div>

    </nav>
  )
}
