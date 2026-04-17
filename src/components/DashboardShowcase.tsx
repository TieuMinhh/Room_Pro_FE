
import React, { useRef, useEffect } from 'react';

const dashboardFeatures = [
  {
    id: 'overview',
    title: 'Tổng quan',
    description: 'Xem nhanh tất cả các chỉ số quan trọng về thu nhập, tỷ lệ lấp đầy, và các phòng sắp hết hạn.',
    color: 'bg-blue-500'
  },
  {
    id: 'rooms',
    title: 'Quản lý phòng',
    description: 'Theo dõi tình trạng từng phòng, lịch bảo trì, và thông tin chi tiết về người thuê hiện tại.',
    color: 'bg-green-500'
  },
  {
    id: 'tenants',
    title: 'Quản lý người thuê',
    description: 'Lưu trữ hồ sơ người thuê, thông tin liên lạc, và lịch sử thanh toán một cách có tổ chức.',
    color: 'bg-purple-500'
  },
  {
    id: 'payments',
    title: 'Quản lý thanh toán',
    description: 'Theo dõi các khoản thanh toán, tạo hóa đơn tự động, và gửi nhắc nhở cho các khoản thanh toán sắp tới.',
    color: 'bg-orange-500'
  }
];

const DashboardShowcase = () => {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const dashboard = dashboardRef.current;
      if (dashboard) {
        const rect = dashboard.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        if (isVisible) {
          dashboard.classList.remove('opacity-0');
          dashboard.classList.add('animate-fade-in');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleFeatureHover = (index: number) => {
    if (imageRef.current) {
      // In a real app, you would change the image source or highlight parts of the dashboard
      imageRef.current.style.transform = 'scale(1.02)';
      imageRef.current.style.boxShadow = `0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`;

      // Update active state for features
      featureRefs.current.forEach((ref, i) => {
        if (ref) {
          if (i === index) {
            ref.classList.add('bg-rental-50', 'border-rental-300');
          } else {
            ref.classList.remove('bg-rental-50', 'border-rental-300');
          }
        }
      });
    }
  };

  const resetFeatureStyles = () => {
    if (imageRef.current) {
      imageRef.current.style.transform = 'scale(1)';
      imageRef.current.style.boxShadow = `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)`;

      featureRefs.current.forEach((ref) => {
        if (ref) {
          ref.classList.remove('bg-rental-50', 'border-rental-300');
        }
      });
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-rental-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Bảng điều khiển trực quan</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Giao diện dễ sử dụng giúp bạn nắm bắt tình hình kinh doanh ngay lập tức
          </p>
        </div>

        <div ref={dashboardRef} className="flex flex-col lg:flex-row items-center gap-12 opacity-0">
          <div className="lg:w-1/2 order-2 lg:order-1">
            {dashboardFeatures.map((feature, index) => (
              <div
                key={feature.id}
                ref={(el) => (featureRefs.current[index] = el)}
                className="mb-6 p-6 border border-gray-200 rounded-xl transition-all duration-300 hover:bg-rental-50 hover:border-rental-300"
                onMouseEnter={() => handleFeatureHover(index)}
                onMouseLeave={resetFeatureStyles}
              >
                <div className="flex items-center mb-3">
                  <div className={`w-4 h-4 rounded-full ${feature.color} mr-3`}></div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </div>
                <p className="text-gray-600 pl-7">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="lg:w-1/2 order-1 lg:order-2 transition-all duration-500">
            <img
              ref={imageRef}
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Dashboard"
              className="rounded-xl shadow-lg transition-all duration-300 w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardShowcase;
