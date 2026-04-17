
import React from 'react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-white via-rental-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 animate-fade-in">
              Quản lý phòng trọ <br />
              <span className="text-rental-600">dễ dàng và hiệu quả</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Nền tảng quản lý phòng trọ thông minh giúp bạn tiết kiệm thời gian và tối ưu hóa doanh thu.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button size="lg" className="bg-rental-600 hover:bg-rental-700 text-white px-8 py-6">
                Dùng thử miễn phí
              </Button>
              <Button size="lg" variant="outline" className="border-rental-500 text-rental-700 hover:bg-rental-50 px-8 py-6">
                Xem demo
              </Button>
            </div>
            <div className="mt-8 flex items-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>
                ))}
              </div>
              <p className="ml-4 text-sm text-gray-600">
                <span className="font-bold">2,000+</span> chủ trọ đã sử dụng
              </p>
            </div>
          </div>
          <div className="md:w-1/2 md:pl-10 animate-float relative">
            <div className="rounded-xl bg-white shadow-xl overflow-hidden relative z-10">
              <img src="https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1084&q=80"
                alt="Dashboard"
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-rental-200 rounded-full -z-10"></div>
            <div className="absolute -left-4 -top-4 w-24 h-24 bg-rental-100 rounded-full -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
