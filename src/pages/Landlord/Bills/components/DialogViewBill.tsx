import React, { useState, useRef } from 'react';
import { X, Download, Camera, FileText, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DialogViewBill = ({ open, setOpen, billData, departments }) => {
    const invoiceRef = useRef(null);
    const [isExporting, setIsExporting] = useState(false);

    if (!open || !billData) return null;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN');
    };

    const exportToImage = async () => {
        setIsExporting(true);
        try {
            const html2canvas = (await import('html2canvas')).default;
            const canvas = await html2canvas(invoiceRef.current, {
                backgroundColor: '#ffffff',
                scale: 2,
                useCORS: true,
                allowTaint: true,
                scrollX: 0,
                scrollY: 0,
                width: invoiceRef.current.scrollWidth,
                height: invoiceRef.current.scrollHeight
            });

            const link = document.createElement('a');
            link.download = `hoa-don-${billData.roomId?.roomId}-${formatDate(billData.time)}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Lỗi xuất ảnh:', error);
            alert('Có lỗi xảy ra khi xuất ảnh. Vui lòng thử lại.');
        } finally {
            setIsExporting(false);
        }
    };

    const exportToPDF = () => {
        const printWindow = window.open('', '_blank');
        const invoiceHTML = invoiceRef.current.innerHTML;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Hóa đơn - ${billData.roomId?.roomId}</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 20px;
                            line-height: 1.6;
                        }
                        .invoice-container {
                            max-width: 800px;
                            margin: 0 auto;
                            padding: 20px;
                            border: 1px solid #ddd;
                        }
                        .invoice-header {
                            text-align: center;
                            margin-bottom: 30px;
                            border-bottom: 2px solid #3498db;
                            padding-bottom: 20px;
                        }
                        .invoice-header h1 {
                            color: #2c3e50;
                            margin-bottom: 10px;
                        }
                        .invoice-info {
                            display: grid;
                            grid-template-columns: 1fr 1fr;
                            gap: 20px;
                            margin-bottom: 30px;
                        }
                        .info-section h3 {
                            color: #3498db;
                            margin-bottom: 10px;
                            font-size: 16px;
                        }
                        .info-section p {
                            margin: 5px 0;
                            color: #2c3e50;
                        }
                        .services-table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-bottom: 20px;
                        }
                        .services-table th,
                        .services-table td {
                            border: 1px solid #ddd;
                            padding: 10px;
                            text-align: left;
                        }
                        .services-table th {
                            background-color: #3498db;
                            color: white;
                            font-weight: bold;
                        }
                        .services-table tr:nth-child(even) {
                            background-color: #f8f9fa;
                        }
                        .total-section {
                            text-align: right;
                            border-top: 2px solid #3498db;
                            padding-top: 20px;
                            margin-top: 20px;
                        }
                        .total-amount {
                            font-size: 20px;
                            font-weight: bold;
                            color: #e74c3c;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 30px;
                            font-size: 12px;
                            color: #7f8c8d;
                        }
                        @media print {
                            body { margin: 0; }
                            .invoice-container { border: none; }
                        }
                    </style>
                </head>
                <body>
                    <div class="invoice-container">
                        ${invoiceHTML}
                    </div>
                </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.print();
    };

    const getDepartmentName = (departmentId) => {
        const dept = departments?.find(d => d._id === departmentId);
        return dept ? dept.name : 'N/A';
    };

    // Phân loại các dịch vụ
    const electricityService = billData.serviceFee?.find(s => s.name === "Tiền điện");
    const waterService = billData.serviceFee?.find(s => s.name === "Tiền nước");
    const otherServices = billData.serviceFee?.filter(s => s.name !== "Tiền điện" && s.name !== "Tiền nước") || [];

    // Tính toán số lượng và thành tiền
    const electricityQuantity = (billData.newElectricity || 0) - (billData.oldElectricity || 0);
    const waterQuantity = (billData.newWater || 0) - (billData.oldWater || 0);
    const electricityTotal = electricityQuantity * (electricityService?.price || 0);
    const waterTotal = waterQuantity * (waterService?.price || 0);
    const otherServicesTotal = otherServices.reduce((sum, service) => sum + (service.price || 0), 0);
    const roomPrice = billData.price || 0;
    const totalAmount = electricityTotal + waterTotal + otherServicesTotal + roomPrice;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <FileText className="h-6 w-6" />
                        Hóa đơn tiền phòng
                    </h2>
                    <button
                        onClick={() => setOpen(false)}
                        className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div
                        ref={invoiceRef}
                        className="bg-white p-8 border rounded-lg"
                        style={{ minHeight: '600px' }}
                    >
                        {/* Invoice Header */}
                        <div className="text-center mb-8 border-b-2 border-blue-500 pb-6">
                            <h1 className="text-3xl font-bold text-gray-800 mb-4">HÓA ĐƠN TIỀN PHÒNG</h1>
                            <div className="text-gray-600 space-y-1">
                                <p><strong>Mã hóa đơn:</strong> {billData._id}</p>
                                <p><strong>Thời gian:</strong> {formatDate(billData.time)}</p>
                                <p><strong>Ngày lập:</strong> {formatDate(billData.createdAt)}</p>
                                <p><strong>Hạn thanh toán:</strong> {formatDate(billData.duration)}</p>
                            </div>
                        </div>

                        {/* Customer and Room Info */}
                        <div className="grid grid-cols-2 gap-8 mb-8">
                            <div className="info-section">
                                <h3 className="text-lg font-semibold text-blue-600 mb-4 border-b border-blue-200 pb-2">
                                    THÔNG TIN KHÁCH HÀNG
                                </h3>
                                <div className="space-y-2 text-gray-700">
                                    <p><strong>Tên khách hàng:</strong> {billData.tenantId?.displayName || 'N/A'}</p>
                                    <p><strong>Số điện thoại:</strong> {billData.tenantId?.phone || 'N/A'}</p>
                                    <p><strong>Email:</strong> {billData.tenantId?.email || 'N/A'}</p>
                                </div>
                            </div>

                            <div className="info-section">
                                <h3 className="text-lg font-semibold text-blue-600 mb-4 border-b border-blue-200 pb-2">
                                    THÔNG TIN PHÒNG
                                </h3>
                                <div className="space-y-2 text-gray-700">
                                    <p><strong>Tòa nhà:</strong> {getDepartmentName(billData.roomId?.departmentId?._id)}</p>
                                    <p><strong>Mã phòng:</strong> {billData.roomId?.roomId}</p>
                                    <p><strong>Giá phòng:</strong> {formatCurrency(roomPrice)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Services Table */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-blue-600 mb-4">CHI TIẾT THANH TOÁN</h3>
                            <table className="services-table w-full border-collapse">
                                <thead>
                                    <tr className="bg-blue-500 text-white">
                                        <th className="border p-3 text-left">STT</th>
                                        <th className="border p-3 text-left">Nội dung</th>
                                        <th className="border p-3 text-center">Chỉ số cũ</th>
                                        <th className="border p-3 text-center">Chỉ số mới</th>
                                        <th className="border p-3 text-center">Số lượng</th>
                                        <th className="border p-3 text-right">Đơn giá</th>
                                        <th className="border p-3 text-right">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Tiền phòng */}
                                    <tr className="bg-white">
                                        <td className="border p-3 font-medium">1</td>
                                        <td className="border p-3">Tiền phòng</td>
                                        <td className="border p-3 text-center">-</td>
                                        <td className="border p-3 text-center">-</td>
                                        <td className="border p-3 text-center">1</td>
                                        <td className="border p-3 text-right">{formatCurrency(roomPrice)}</td>
                                        <td className="border p-3 text-right">{formatCurrency(roomPrice)}</td>
                                    </tr>

                                    {/* Tiền điện */}
                                    {electricityService && (
                                        <tr className="bg-gray-50">
                                            <td className="border p-3 font-medium">2</td>
                                            <td className="border p-3">Tiền điện</td>
                                            <td className="border p-3 text-center">{billData.oldElectricity || 0}</td>
                                            <td className="border p-3 text-center">{billData.newElectricity || 0}</td>
                                            <td className="border p-3 text-center">{electricityQuantity}</td>
                                            <td className="border p-3 text-right">{formatCurrency(electricityService.price)}</td>
                                            <td className="border p-3 text-right">{formatCurrency(electricityTotal)}</td>
                                        </tr>
                                    )}

                                    {/* Tiền nước */}
                                    {waterService && (
                                        <tr className="bg-white">
                                            <td className="border p-3 font-medium">3</td>
                                            <td className="border p-3">Tiền nước</td>
                                            <td className="border p-3 text-center">{billData.oldWater || 0}</td>
                                            <td className="border p-3 text-center">{billData.newWater || 0}</td>
                                            <td className="border p-3 text-center">{waterQuantity}</td>
                                            <td className="border p-3 text-right">{formatCurrency(waterService.price)}</td>
                                            <td className="border p-3 text-right">{formatCurrency(waterTotal)}</td>
                                        </tr>
                                    )}

                                    {/* Các dịch vụ khác */}
                                    {otherServices.map((service, index) => (
                                        <tr key={service._id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                            <td className="border p-3 font-medium">{4 + index}</td>
                                            <td className="border p-3">{service.name}</td>
                                            <td className="border p-3 text-center">-</td>
                                            <td className="border p-3 text-center">-</td>
                                            <td className="border p-3 text-center">1</td>
                                            <td className="border p-3 text-right">{formatCurrency(service.price)}</td>
                                            <td className="border p-3 text-right">{formatCurrency(service.price)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Payment Summary */}
                        <div className="border-t-2 border-blue-500 pt-6">
                            <div className="grid grid-cols-2 gap-8">
                                <div></div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-lg">
                                        <span className="font-semibold">Tổng tiền:</span>
                                        <span className="font-bold text-blue-600">{formatCurrency(totalAmount)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-lg">
                                        <span className="font-semibold">Đã thanh toán:</span>
                                        <span className="font-bold text-green-600">{formatCurrency(billData.prepay || 0)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xl border-t pt-3">
                                        <span className="font-bold">Còn phải trả:</span>
                                        <span className="font-bold text-red-600 total-amount">
                                            {formatCurrency(totalAmount - (billData.prepay || 0))}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center mt-8 pt-6 border-t border-gray-200">
                            <p className="text-gray-600 mb-2">Cảm ơn bạn đã tin tưởng sử dụng dịch vụ!</p>
                            <p className="text-sm text-gray-500">
                                Hóa đơn được tạo tự động bởi hệ thống quản lý nhà trọ
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Ngày in: {formatDateTime(new Date())}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4 p-6 bg-gray-50 border-t">
                    <Button
                        onClick={exportToImage}
                        disabled={isExporting}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isExporting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                Đang xuất...
                            </>
                        ) : (
                            <>
                                <Camera className="h-5 w-5" />
                                Xuất ảnh PNG
                            </>
                        )}
                    </Button>

                    <Button
                        onClick={exportToPDF}
                        className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <Printer className="h-5 w-5" />
                        In PDF
                    </Button>


                </div>
            </div>
        </div>
    );
};

export default DialogViewBill;