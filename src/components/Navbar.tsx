import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, SearchIcon, X, SearchIcon as Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { User, LogOut, UserCircleIcon, MoreVertical, LogIn } from 'lucide-react';
import { logoutUserAPIs, selectCurrentUser } from '@/store/slice/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { USER_ROLE } from '@/utils/contanst';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDashboardPath = () => {
    if (currentUser?.role === USER_ROLE.ADMIN) return "/dashboard";
    if (currentUser?.role === USER_ROLE.OWNER) return "/home-page";
    if (currentUser?.role === USER_ROLE.TENANT) return "/tenant-rooms";
    return "/";
  };

  const handleLogout = () => {
    dispatch(logoutUserAPIs() as any);
    navigate("/");
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 shadow-md backdrop-blur-sm' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="p-4 flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
              <img
                src='/favicon.ico'
                alt="Logo"
                className="h-8 w-8"
              />
              <span className="font-bold text-xl text-rental-500 ">RoomPro</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="navbar-link font-medium text-gray-700 hover:text-rental-600">Tính năng</a>
            <a href="#benefits" className="navbar-link font-medium text-gray-700 hover:text-rental-600">Lợi ích</a>
            <a href="#pricing" className="navbar-link font-medium text-gray-700 hover:text-rental-600">Giá cả</a>
            <a href="#testimonials" className="navbar-link font-medium text-gray-700 hover:text-rental-600">Đánh giá</a>
          </div>

          <div className="hidden md:flex space-x-4 items-center">
            <Button variant="outline" className="border-rental-500 text-rental-700 hover:bg-rental-50" onClick={() => navigate('/tim-kiem-tro')}>
              <SearchIcon className="mr-2" />
              Tìm kiếm trọ</Button>
            
            {currentUser ? (
              <Popover>
                <PopoverTrigger asChild>
                  <div className="flex items-center gap-3 p-1 px-3 rounded-full hover:bg-gray-100 cursor-pointer transition-all border border-gray-200 bg-white/50">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700 font-bold border border-gray-200">
                      {currentUser.displayName?.charAt(0).toUpperCase() || <User size={18} />}
                    </div>
                    <span className="font-semibold text-gray-700">{currentUser.displayName || 'User'}</span>
                    <MoreVertical size={16} className="text-gray-400" />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2 mt-2 shadow-xl border-gray-100 rounded-xl" align="end">
                  <div className="p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 uppercase font-bold text-lg">
                      {currentUser.displayName?.charAt(0).toUpperCase() || <User size={20} />}
                    </div>
                    <div className="flex flex-col overflow-hidden text-left">
                      <span className="font-bold text-gray-900 truncate">{currentUser.displayName}</span>
                      <span className="text-xs text-gray-500 truncate">{currentUser.email}</span>
                    </div>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex flex-col gap-1 text-left">
                    <Button
                      variant="ghost"
                      className="w-full justify-start font-medium text-gray-700 hover:bg-gray-50 rounded-lg h-10 px-3"
                      onClick={() => navigate(getDashboardPath())}
                    >
                      <UserCircleIcon className="w-5 h-5 mr-3 text-gray-400" />
                      Trang quản lý
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg h-10 px-3"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      Log out
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <Button 
                variant="outline" 
                className="border-rental-500 text-rental-700 hover:bg-rental-50 font-bold px-6" 
                onClick={() => navigate('/login')}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Đăng nhập
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 space-y-3 flex flex-col">
            <a href="#features" className="font-medium text-gray-700 hover:text-rental-600 py-2">Tính năng</a>
            <a href="#benefits" className="font-medium text-gray-700 hover:text-rental-600 py-2">Lợi ích</a>
            <a href="#pricing" className="font-medium text-gray-700 hover:text-rental-600 py-2">Giá cả</a>
            <a href="#testimonials" className="font-medium text-gray-700 hover:text-rental-600 py-2">Đánh giá</a>
            <div className="pt-2 flex flex-col space-y-3">
              {currentUser ? (
                <Button 
                  variant="default" 
                  className="bg-rental-600 hover:bg-rental-700 text-white w-full" 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate(getDashboardPath());
                  }}
                >
                  Quản lý ({currentUser.displayName || 'User'})
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  className="border-rental-500 text-rental-700 w-full" 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                >
                  Đăng nhập
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
