import { updateOrderAPIs } from '@/apis/order.apis';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

export const DialogExtension = ({ open, setOpen, order, fetchData }: any) => {
    // Lấy thông tin người thuê đầu tiên
    const tenant = order?.tenants?.[0] || {};
    const room = order?.room || {};
    const [newEndDate, setNewEndDate] = useState(order?.endAt?.slice(0, 10) || '');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateOrderAPIs(order._id, {
            endAt: newEndDate,
        }).then(() => {
            toast.success("Gia hạn hợp đồng thành công");
            fetchData()
            setOpen(false);
        });
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative animate-in fade-in duration-300">
                <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
                    onClick={() => setOpen(false)}
                    aria-label="Đóng"
                >
                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Gia hạn hợp đồng thuê phòng</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex items-center gap-3 mb-2">
                        <img src={tenant.avatar || 'https://ui-avatars.com/api/?name=' + (tenant.displayName || tenant.userName || 'User')}
                            alt="avatar"
                            className="w-12 h-12 rounded-full border object-cover" />
                        <div>
                            <div className="font-semibold text-lg text-gray-800">{tenant.displayName || tenant.userName || '---'}</div>
                            <div className="text-xs text-gray-500">{tenant.email}</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Phòng thuê</label>
                            <div className="border rounded px-2 py-1 bg-gray-50 font-semibold">{room.roomId || room._id || '---'}</div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Loại phòng</label>
                            <div className="border rounded px-2 py-1 bg-gray-50">{room.type || '---'}</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Ngày bắt đầu</label>
                            <div className="border rounded px-2 py-1 bg-gray-50">{order?.startAt?.slice(0, 10) || '---'}</div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600">Ngày kết thúc hiện tại</label>
                            <div className="border rounded px-2 py-1 bg-gray-50">{order?.endAt?.slice(0, 10) || '---'}</div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1" htmlFor="endDate">Thời hạn thuê mới</label>
                        <input
                            id="endDate"
                            type="date"
                            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={newEndDate}
                            min={order?.endAt?.slice(0, 10) || ''}
                            onChange={e => setNewEndDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                            onClick={() => setOpen(false)}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-semibold"
                        >
                            Gia hạn
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
