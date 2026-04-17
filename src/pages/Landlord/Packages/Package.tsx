import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { buyPackageAPIs, getPackagesAPIs } from '@/apis/package.apis';

export const PackageList = () => {
  const [packages, setPackages] = useState<any[]>([]);
  const navigate = useNavigate();
  const [isPaying, setIsPaying] = useState(false);
  useEffect(() => {
    getPackagesAPIs()
      .then(res => setPackages(res.data))
      .catch(err => console.error('Lỗi khi lấy danh sách gói:', err));
  }, []);

  const handleBuy = (id: string, name: string, months: number, price: number) => {
    Swal.fire({
      title: 'Xác nhận mua gói?',
      html: `
        <div class="text-sm text-gray-700">
          Bạn có chắc muốn mua <strong>${name}</strong> (${months} tháng) với giá <strong>${price.toLocaleString()} VND</strong>?
        </div>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Mua ngay',
      cancelButtonText: 'Huỷ',
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsPaying(true);
        try {
          Swal.fire({
          title: 'Đang xử lý...',
          text: 'Vui lòng chờ trong giây lát',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
          await buyPackageAPIs(id);
          Swal.fire('Thành công', 'Mua gói thành công!', 'success');
          navigate('/rooms');
          window.location.reload();
        } catch (error: any) {
          Swal.close();
          setIsPaying(false);
          if (error.response?.status === 402) {
            Swal.fire('Số dư không đủ', 'Vui lòng nạp thêm tiền để mua gói.', 'warning');
          } else {
            Swal.fire('Thất bại', 'Có lỗi xảy ra khi thanh toán.', 'error');
          }
        }
      }
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
      {packages.map(pkg => (
        <Card key={pkg._id} className="rounded-2xl shadow hover:shadow-md transition-all p-4 bg-white">
          <CardContent className="space-y-3 p-0">
            <h3 className="text-lg font-semibold text-blue-700">{pkg.name}</h3>
            <div className="text-sm text-gray-600 space-y-1">
              {pkg.description?.map((desc: string, idx: number) => (
                <div key={idx}>• {desc}</div>
              ))}
            </div>
            <div className="text-sm font-medium text-gray-700">
              Thời hạn: <span className="text-black">{pkg.availableTime} tháng</span>
            </div>
            <div className="text-sm font-medium text-gray-700">
              Giá: <span className="text-green-600 font-bold">{pkg.price.toLocaleString()} VND</span>
            </div>
            <Button
              disabled={isPaying}
              className="w-full bg-sky-200 text-sky-800 hover:bg-sky-300"
              onClick={() => handleBuy(pkg._id, pkg.name, pkg.availableTime, pkg.price)}
            >
              {isPaying ? 'Đang xử lý...' : 'Mua ngay'}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
