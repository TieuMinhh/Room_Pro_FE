
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const pricingPlans = [
  {
    name: "Cơ bản",
    price: "199.000",
    period: "tháng",
    description: "Dành cho chủ sở hữu nhỏ với ít phòng",
    features: [
      "Tối đa 10 phòng",
      "Quản lý người thuê",
      "Theo dõi thanh toán",
      "Thông báo cơ bản",
      "Hỗ trợ email",
    ],
    highlighted: false
  },
  {
    name: "Chuyên nghiệp",
    price: "499.000",
    period: "tháng",
    description: "Dành cho các chủ nhà có nhiều phòng",
    features: [
      "Tối đa 50 phòng",
      "Tất cả tính năng Cơ bản",
      "Báo cáo nâng cao",
      "Hệ thống nhắn tin tích hợp",
      "Hợp đồng điện tử",
      "Hỗ trợ 24/7",
    ],
    highlighted: true
  },
  {
    name: "Doanh nghiệp",
    price: "999.000",
    period: "tháng",
    description: "Dành cho doanh nghiệp bất động sản",
    features: [
      "Không giới hạn số phòng",
      "Tất cả tính năng Chuyên nghiệp",
      "API tích hợp",
      "Quản lý nhiều vị trí",
      "Báo cáo tùy chỉnh",
      "Trợ lý riêng",
    ],
    highlighted: false
  }
];

const Pricing = () => {
  const [annualBilling, setAnnualBilling] = useState(false);

  const getDiscountedPrice = (price: string) => {
    const numPrice = parseFloat(price.replace(/\./g, ''));
    const annual = annualBilling ? numPrice * 10 * 0.8 : numPrice;
    return annual.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <section id="pricing" className="py-20 bg-gradient-to-br from-rental-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Gói dịch vụ phù hợp với bạn</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Chọn gói phù hợp với nhu cầu quản lý phòng trọ của bạn
          </p>

          <div className="flex items-center justify-center mb-12">
            <span className={`mr-3 ${!annualBilling ? 'font-bold' : 'text-gray-600'}`}>Thanh toán hàng tháng</span>
            <button
              onClick={() => setAnnualBilling(!annualBilling)}
              className={`relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none ${
                annualBilling ? 'bg-rental-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-transform duration-300 ${
                  annualBilling ? 'transform translate-x-6' : ''
                }`}
              />
            </button>
            <span className={`ml-3 ${annualBilling ? 'font-bold' : 'text-gray-600'}`}>
              Thanh toán hàng năm <span className="text-rental-600 font-bold">(Tiết kiệm 20%)</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 ${
                plan.highlighted
                  ? 'border-2 border-rental-500 shadow-xl'
                  : 'border border-gray-200 shadow-lg'
              }`}
            >
              {plan.highlighted && (
                <div className="bg-rental-500 text-white py-1 px-4 text-center text-sm font-bold">
                  Phổ biến nhất
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{getDiscountedPrice(plan.price)}đ</span>
                  <span className="text-gray-500">/{annualBilling ? 'năm' : plan.period}</span>
                </div>
                <Button
                  className={`w-full ${
                    plan.highlighted
                      ? 'bg-rental-600 hover:bg-rental-700 text-white'
                      : 'bg-white border border-rental-600 text-rental-600 hover:bg-rental-50'
                  }`}
                >
                  Bắt đầu dùng thử
                </Button>
                <div className="mt-8">
                  <p className="font-medium mb-4">Bao gồm:</p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <div className="mr-3 mt-1">
                          <Check className="w-4 h-4 text-rental-600" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
