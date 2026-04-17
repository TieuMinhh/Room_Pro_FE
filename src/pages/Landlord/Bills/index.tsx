import { getDepartmentsByOwner } from '@/apis/departmentApi';
import { fetchOrders } from '@/apis/order.apis';
import { Button } from '@/components/ui/button';
import { ChevronDown, Delete, EditIcon, NotepadText, SendIcon, ViewIcon } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { DialogCreateBill } from './components/DialogCreateBill';
import { useNavigate, useLocation } from 'react-router-dom';
import Loader from '@/components/ui-customize/Loader';
import { deleteBillAPIs, fetchBillsAPIs, sendMailByIdAPIs } from '@/apis/bill.apis';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import DialogViewBill from './components/DialogViewBill';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { toast } from 'react-toastify';

export const Bills = () => {
    const [orderRooms, setOrderRooms] = useState<any[]>([]);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const getDefaultMonth = () => {
        const now = new Date();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        return `${now.getFullYear()}-${m}`;
    };
    const [month, setMonth] = useState(() => searchParams.get('month') || getDefaultMonth());
    const [departments, setDepartments] = useState<any[]>([]);
    const [house, setHouse] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [openDialogCreate, setOpenDialogCreate] = useState(false);
    const [openDialogView, setOpenDialogView] = useState(false);
    const [selectedBill, setSelectedBill] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [bills, setBills] = useState<any[]>([]);

    const navigate = useNavigate();


    // Khi URL query param month thay đổi, cập nhật state và fetch lại dữ liệu
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const urlMonth = params.get('month') || getDefaultMonth();
        setMonth(urlMonth);
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search]);

    const fetchData = async () => {
        setLoading(true);
        const [ordersRes, deptRes, billsRes] = await Promise.all([
            fetchOrders(),
            getDepartmentsByOwner(),
            fetchBillsAPIs(),
        ]);
        setOrderRooms(ordersRes.data.filter((item: any) => item.startAt));
        setDepartments(deptRes.data);
        setBills(billsRes.data);
        setLoading(false);
    };

    const handleDeleteBill = async (id: string) => {
        Swal.fire({
            title: 'Bạn có chắc chắn muốn xóa hóa đơn này?',
            text: 'Hành động này không thể hoàn tác!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteBillAPIs(id);
                const res = await fetchBillsAPIs();
                setBills(res.data);
            }
        });
    };

    const handleViewBill = (bill: any) => {
        setSelectedBill(bill);
        setOpenDialogView(true);
    };

    const handleSendBill = async (bill: any) => {
        toast.promise(sendMailByIdAPIs(bill?._id), {
            pending: 'Đang tạo hóa đơn...',
            success: 'Tạo hóa đơn thanh cong!',
        });


    };

    const filteredBills = useMemo(() => {
        return bills.filter((bill) => {
            const billMonth = dayjs(bill.time).format('YYYY-MM');
            const matchMonth = month === '' || billMonth === month;
            const matchHouse = house === '' || bill?.roomId?.departmentId?._id === house;
            const matchRoomCode = roomCode === '' || bill?.roomId?.roomId?.toLowerCase().includes(roomCode.toLowerCase());
            return matchMonth && matchHouse && matchRoomCode;
        });
    }, [bills, month, house, roomCode]);

    if (loading) return <Loader />;

    const handleExport = (type: 'all' | 'month') => {
        let exportData = type === 'all' ? bills : filteredBills;

        const data = exportData.map((item: any) => ({
            'Thời gian': dayjs(item.time).format('MM/YYYY'),
            'Tòa': item?.roomId?.departmentId?.name || '',
            'Phòng': item?.roomId?.roomId || '',
            'Khách thuê': item?.tenantId?.displayName || '',
            'Tổng tiền (VND)': item?.total || '',
            'Đã trả (VND)': item?.prepay || '',
            'Còn lại (VND)': item?.total - item?.prepay || '',
            'Trạng thái': item?.status ? 'Đã tính' : 'Chưa cập nhật'
        }));

        const worksheet = XLSX.utils.json_to_sheet(data);

        // Làm đậm dòng đầu tiên (header)
        const header = Object.keys(data[0] || {});
        header.forEach((key, colIdx) => {
            const cellAddress = XLSX.utils.encode_cell({ c: colIdx, r: 0 });
            if (worksheet[cellAddress]) {
                worksheet[cellAddress].s = {
                    font: { bold: true }
                };
            }
        });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "HoaDon");

        const fileName = type === 'all' ? 'hoa_don_tat_ca.xlsx' : `hoa_don_${dayjs(month).format('MM_YYYY')}.xlsx`;

        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
            cellStyles: true
        });

        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, fileName);
    };



    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <div className="flex">
                    <NotepadText className="text-2xl text-gray-700 mr-2" />
                    <h2 className="font-bold text-lg mb-4">Tính tiền</h2>
                </div>
                <div className="flex gap-10">
                    <Button className="bg-green-600 text-white px-4 py-1 rounded" size='sm' onClick={() => setOpenDialogCreate(true)}>Tạo hóa đơn</Button>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button className="bg-orange-500 text-white px-4 py-1 rounded" size="sm">
                                Xuất dữ liệu
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48 p-2">
                            <div className="flex flex-col gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => handleExport('all')}
                                    className="w-full justify-start"
                                >
                                    Tất cả
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => handleExport('month')}
                                    className="w-full justify-start"
                                >
                                    Tháng ({dayjs(month).format("MM/YYYY")})
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="bg-white rounded shadow">
                <div className="font-semibold mb-2 rounded bg-gray-100 p-1 flex">
                    <ChevronDown className="text-2xl text-gray-700 mr-2" />
                    <span>Bộ lọc tìm kiếm</span>
                </div>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center p-4 gap-4">
                    <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex items-center gap-2">
                            <label className="whitespace-nowrap">Tháng/năm:</label>
                            <input
                                type="month"
                                value={month}
                                onChange={e => {
                                    const newMonth = e.target.value;
                                    // Cập nhật URL với query param month
                                    navigate({
                                        pathname: location.pathname,
                                        search: `?month=${newMonth}`
                                    });
                                }}
                                className="border rounded px-2 py-1 min-w-[130px]"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="whitespace-nowrap">Tòa:</label>
                            <select
                                value={house}
                                onChange={e => setHouse(e.target.value)}
                                className="border rounded px-2 py-1 min-w-[150px]"
                            >
                                <option value="">Tất cả</option>
                                {departments.map(h => (
                                    <option key={h._id} value={h._id}>{h.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="whitespace-nowrap">Mã phòng:</label>
                            <input
                                type="text"
                                value={roomCode}
                                onChange={e => setRoomCode(e.target.value)}
                                placeholder="Nhập mã phòng..."
                                className="border rounded px-2 py-1 min-w-[140px]"
                            />
                        </div>
                    </div>
                    <div>
                        <Button className="bg-green-600 text-white px-4 py-2 rounded" size="sm">
                            Gửi Mail
                        </Button>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-white rounded shadow mt-5">
                {filteredBills.length === 0 ? (
                    <div className="text-center text-gray-500">Không tìm thấy hóa đơn phù hợp</div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="border px-2 py-1">STT</th>
                                        <th className="border px-2 py-1">Thời gian</th>
                                        <th className="border px-2 py-1">Nhà</th>
                                        <th className="border px-2 py-1">Phòng</th>
                                        <th className="border px-2 py-1">Tên khách</th>
                                        <th className="border px-2 py-1">Số tiền (VND)</th>
                                        <th className="border px-2 py-1">Đã trả (VND)</th>
                                        <th className="border px-2 py-1">Còn lại (VND)</th>
                                        <th className="border px-2 py-1">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBills.map((row: any, idx) => (
                                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="border px-2 py-1 text-center">{idx + 1}</td>
                                            <td className="border px-2 py-1 text-center">{dayjs(row?.time).format("MM/YYYY")}</td>
                                            <td className="border px-2 py-1 text-center">{departments.find(d => d._id === row?.roomId?.departmentId._id)?.name}</td>
                                            <td className="border px-2 py-1 text-center">{row?.roomId?.roomId}</td>
                                            <td className="border px-2 py-1">{row?.tenantId.displayName}</td>
                                            <td className="border px-2 py-1 text-right">{row?.status ? row?.total.toLocaleString() :
                                                <div className='bg-yellow-100 text-yellow-800 px-2 w-fit rounded'>chưa cập nhật</div>}</td>
                                            <td className="border px-2 py-1 text-right">{row?.status ? row?.prepay.toLocaleString() :
                                                <div className='bg-yellow-100 text-yellow-800 px-2 w-fit rounded'>chưa cập nhật</div>}</td>
                                            <td className="border px-2 py-1 text-right">{row?.status ? (row?.total - row?.prepay).toLocaleString() :
                                                <div className='bg-yellow-100 text-yellow-800 px-2 w-fit rounded'>chưa cập nhật</div>}</td>
                                            <td className="border px-2 py-1 text-center">
                                                <div className="flex gap-2 justify-center">
                                                    {row.status && (
                                                        <>
                                                            <button title="Xem" onClick={() => handleViewBill(row)} className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded">
                                                                <ViewIcon className='w-4 h-4' />
                                                            </button>
                                                            <button title="Gửi" onClick={() => handleSendBill(row)} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded">
                                                                <SendIcon className='w-4 h-4' />
                                                            </button>
                                                        </>
                                                    )}
                                                    <button title="Sửa" onClick={() => navigate(`/calculate-bill/${row._id}`)} className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded">
                                                        <EditIcon className='w-4 h-4' />
                                                    </button>
                                                    <button title="Xóa" onClick={() => handleDeleteBill(row._id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">
                                                        <Delete className='w-4 h-4' />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                            <div></div>
                            <div>Page 1 of 1</div>
                        </div>
                    </>
                )}
            </div>

            <DialogCreateBill open={openDialogCreate} setOpen={setOpenDialogCreate} orderRooms={orderRooms} departments={departments} fetchData={fetchData} />

            <DialogViewBill open={openDialogView} setOpen={setOpenDialogView} billData={selectedBill} departments={departments} />
        </div>
    );
};
