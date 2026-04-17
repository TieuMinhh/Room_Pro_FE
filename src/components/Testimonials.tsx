
import React, { useState, useEffect } from 'react';

const testimonials = [
  {
    quote: "Phần mềm RoomRentPro đã giúp tôi tiết kiệm rất nhiều thời gian trong việc quản lý phòng trọ. Tôi có thể dễ dàng theo dõi thanh toán và gửi thông báo tự động.",
    author: "Nguyễn Văn A",
    position: "Chủ nhà trọ, Hà Nội",
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80"
  },
  {
    quote: "Trước đây tôi quản lý bằng Excel và rất hay quên các khoản thanh toán. Với RoomRentPro, mọi thứ đều được tự động nhắc nhở và báo cáo chi tiết.",
    author: "Trần Thị B",
    position: "Chủ căn hộ cho thuê, TP.HCM",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1061&q=80"
  },
  {
    quote: "Tôi đã tăng doanh thu 20% nhờ khả năng quản lý hiệu quả của RoomRentPro. Không còn tình trạng phòng trống kéo dài nữa!",
    author: "Lê Văn C",
    position: "Nhà đầu tư bất động sản, Đà Nẵng",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80"
  }
];

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Khách hàng nói gì về chúng tôi</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Những trải nghiệm thực tế từ các chủ nhà đã sử dụng RoomRentPro
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative h-[400px]">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`absolute w-full transition-all duration-700 ${
                  activeIndex === index
                    ? 'opacity-100 translate-y-0 z-10'
                    : 'opacity-0 translate-y-8 -z-10'
                }`}
              >
                <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="md:w-1/3">
                      <div className="w-32 h-32 rounded-full overflow-hidden mx-auto md:mx-0">
                        <img
                          src={testimonial.image}
                          alt={testimonial.author}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="md:w-2/3 text-center md:text-left">
                      <svg className="w-10 h-10 text-rental-200 mb-4 mx-auto md:mx-0" fill="currentColor" viewBox="0 0 32 32">
                        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                      </svg>
                      <p className="text-xl mb-6">"{testimonial.quote}"</p>
                      <div>
                        <p className="font-bold">{testimonial.author}</p>
                        <p className="text-gray-500">{testimonial.position}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full mx-1 transition-colors duration-300 ${
                  activeIndex === index ? 'bg-rental-600' : 'bg-gray-300'
                }`}
                aria-label={`Testimonial ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
