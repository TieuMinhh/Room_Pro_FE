
import React, { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';

const benefitGroups = [
  {
    title: "Tiết kiệm thời gian",
    benefits: [
      "Tự động hóa việc gửi thông báo và nhắc nhở",
      "Quản lý thanh toán và hóa đơn chỉ với vài cú nhấp chuột",
      "Tạo báo cáo nhanh chóng cho mục đích kế toán",
      "Truy cập thông tin nhanh chóng từ bất kỳ đâu"
    ],
    image: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80"
  },
  {
    title: "Tăng doanh thu",
    benefits: [
      "Giảm thiểu thời gian trống giữa các hợp đồng",
      "Tối ưu giá thuê dựa trên dữ liệu thị trường",
      "Giảm chi phí quản lý và vận hành",
      "Theo dõi chi tiêu và thu nhập hiệu quả"
    ],
    image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
  }
];

const Benefits = () => {
  const benefitRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    benefitRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      benefitRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <section id="benefits" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Lợi ích của RoomRentPro</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Khám phá cách chúng tôi giúp bạn quản lý tài sản hiệu quả hơn
          </p>
        </div>

        {benefitGroups.map((group, groupIndex) => (
          <div 
            key={groupIndex}
            ref={el => benefitRefs.current[groupIndex] = el}
            className={`flex flex-col ${groupIndex % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 mb-20 reveal-item`}
          >
            <div className="md:w-1/2">
              <img 
                src={group.image} 
                alt={group.title} 
                className="rounded-xl shadow-lg w-full h-auto object-cover"
                style={{height: '400px'}}
              />
            </div>
            <div className="md:w-1/2">
              <h3 className="text-2xl font-bold mb-6 text-rental-700">{group.title}</h3>
              <ul className="space-y-4">
                {group.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <div className="mr-3 mt-1 bg-rental-100 rounded-full p-1">
                      <Check className="w-4 h-4 text-rental-600" />
                    </div>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Benefits;
