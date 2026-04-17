
import React, { useEffect, useRef } from 'react';
import { 
  Home, Calendar, Users, Bell, MessageSquare, Settings
} from 'lucide-react';

const features = [
  {
    icon: <Home className="feature-icon" />,
    title: "Quản lý phòng",
    description: "Quản lý hiệu quả tất cả các phòng trọ, trạng thái thuê và thông tin liên quan."
  },
  {
    icon: <Calendar className="feature-icon" />,
    title: "Lịch thanh toán",
    description: "Theo dõi và quản lý lịch thanh toán tiền thuê nhà, gửi thông báo tự động."
  },
  {
    icon: <Users className="feature-icon" />,
    title: "Quản lý người thuê",
    description: "Lưu trữ thông tin chi tiết về người thuê, hợp đồng và lịch sử thanh toán."
  },
  {
    icon: <Bell className="feature-icon" />,
    title: "Thông báo thông minh",
    description: "Gửi thông báo tự động về hạn thanh toán, bảo trì và các vấn đề khẩn cấp."
  },
  {
    icon: <MessageSquare className="feature-icon" />,
    title: "Chat với người thuê",
    description: "Kênh liên lạc nhanh chóng với người thuê để giải quyết vấn đề hiệu quả."
  },
  {
    icon: <Settings className="feature-icon" />,
    title: "Báo cáo và thống kê",
    description: "Xem báo cáo thu chi chi tiết, tỷ lệ lấp đầy và các chỉ số quan trọng khác."
  }
];

const Features = () => {
  const featuresRef = useRef<HTMLDivElement>(null);

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

    const revealItems = document.querySelectorAll('.reveal-item');
    revealItems.forEach((item) => observer.observe(item));

    return () => {
      revealItems.forEach((item) => observer.unobserve(item));
    };
  }, []);

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Tính năng nổi bật</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Khám phá các công cụ mạnh mẽ giúp quản lý phòng trọ trở nên dễ dàng và hiệu quả
          </p>
        </div>

        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="reveal-item p-6 bg-white rounded-xl hover-card border border-gray-100"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
