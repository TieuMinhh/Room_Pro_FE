
import React from 'react';
import { Button } from '@/components/ui/button';

const CTA = () => {
  return (
    <section className="py-20 bg-rental-700 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bắt đầu quản lý phòng trọ hiệu quả ngay hôm nay
          </h2>
          <p className="text-xl opacity-90 mb-10">
            Dùng thử miễn phí 14 ngày, không cần thẻ tín dụng. Khám phá sự khác biệt mà RoomRentPro mang lại.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-rental-700 hover:bg-rental-100 px-8 py-6">
              Dùng thử miễn phí
            </Button>
            <Button size="lg" variant="outline" className="border-white text-black hover:bg-rental-600 px-8 py-6">
              Xem demo
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
