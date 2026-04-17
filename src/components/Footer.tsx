
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4">RoomRent<span className="text-rental-500">Pro</span></h3>
            <p className="text-gray-600 mb-4">
              Nền tảng quản lý phòng trọ dễ dàng và hiệu quả cho chủ nhà, người quản lý bất động sản.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Sản phẩm</h4>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-600 hover:text-rental-600">Tính năng</a></li>
              <li><a href="#pricing" className="text-gray-600 hover:text-rental-600">Bảng giá</a></li>
              <li><a href="#" className="text-gray-600 hover:text-rental-600">Demo</a></li>
              <li><a href="#" className="text-gray-600 hover:text-rental-600">Hướng dẫn</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Công ty</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-rental-600">Về chúng tôi</a></li>
              <li><a href="#" className="text-gray-600 hover:text-rental-600">Blog</a></li>
              <li><a href="#" className="text-gray-600 hover:text-rental-600">Tuyển dụng</a></li>
              <li><a href="#" className="text-gray-600 hover:text-rental-600">Liên hệ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Pháp lý</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-rental-600">Điều khoản sử dụng</a></li>
              <li><a href="#" className="text-gray-600 hover:text-rental-600">Chính sách bảo mật</a></li>
              <li><a href="#" className="text-gray-600 hover:text-rental-600">Chính sách hoàn tiền</a></li>
              <li><a href="#" className="text-gray-600 hover:text-rental-600">Hỗ trợ khách hàng</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} RoomRentPro. Đã đăng ký bản quyền.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-rental-600">
                Facebook
              </a>
              <a href="#" className="text-gray-600 hover:text-rental-600">
                Twitter
              </a>
              <a href="#" className="text-gray-600 hover:text-rental-600">
                Instagram
              </a>
              <a href="#" className="text-gray-600 hover:text-rental-600">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
