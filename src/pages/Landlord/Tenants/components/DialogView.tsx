import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import dayjs from "dayjs";
import { 
    Phone, 
    Mail, 
    Fingerprint, 
    MapPin, 
    Calendar, 
    Home, 
    Clock, 
    CreditCard,
    CheckCircle2,
    XCircle,
    Info,
    CalendarCheck
} from "lucide-react";

export const DialogView = ({
    open,
    setOpen,
    user,
}: {
    open: boolean;
    setOpen: (value: boolean) => void;
    user: any;
}) => {
    if (!user) return null;

    const rentalInfo = user.rentalInfo;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md bg-white shadow-2xl rounded-[2rem] p-0 overflow-hidden border-none animate-scale-in">
                {/* Visual Header with Gradient */}
                <div className="bg-gradient-to-r from-blue-600 to-sky-500 h-32 relative">
                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                        <div className="p-1.5 bg-white rounded-full shadow-xl">
                            <UserAvatar src={user.avatar} alt={user.userName} size={96} />
                        </div>
                    </div>
                </div>

                <div className="pt-16 pb-8 px-8">
                    {/* Primary Identity */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                            {user.displayName || user.userName}
                        </h2>
                        <div className="flex items-center justify-center gap-2 mt-1.5 text-blue-500 font-medium text-sm">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            KHÁCH THUÊ ACTIVE
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Section 1: Contact & Personal Info */}
                        <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                            <div className="space-y-1.5">
                                <Label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold flex items-center gap-2">
                                    <Phone className="w-3.5 h-3.5" /> Số điện thoại
                                </Label>
                                <p className="text-sm font-bold text-gray-700">{user.phone || "---"}</p>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold flex items-center gap-2">
                                    <Fingerprint className="w-3.5 h-3.5" /> Số CCCD
                                </Label>
                                <p className="text-sm font-bold text-gray-700">{user.CCCD || "---"}</p>
                            </div>
                            <div className="col-span-2 space-y-1.5">
                                <Label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold flex items-center gap-2">
                                    <Mail className="w-3.5 h-3.5" /> Email liên hệ
                                </Label>
                                <p className="text-sm font-bold text-gray-700 truncate">{user.email || "---"}</p>
                            </div>
                            <div className="col-span-2 space-y-1.5">
                                <Label className="text-[10px] uppercase tracking-widest text-gray-400 font-bold flex items-center gap-2">
                                    <MapPin className="w-3.5 h-3.5" /> Địa chỉ thường trú
                                </Label>
                                <p className="text-sm font-bold text-gray-700 leading-relaxed">{user.address || "Chưa cập nhật địa chỉ"}</p>
                            </div>
                        </div>

                        <Separator className="bg-gray-100" />

                        {/* Section 2: Rental Information */}
                        {rentalInfo ? (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                                        <Home className="w-4 h-4 text-blue-600" />
                                        Thông tin thuê trọ
                                    </h3>
                                    <Badge className="bg-blue-50 text-blue-600 border-none font-bold text-[10px]">
                                        PHÒNG {rentalInfo.roomId}
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-1">Ngày vào ở</div>
                                        <div className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                                            <CalendarCheck className="w-3.5 h-3.5 text-blue-500" />
                                            {dayjs(rentalInfo.startAt).format("DD/MM/YYYY")}
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-1">Hạn hợp đồng</div>
                                        <div className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5 text-blue-500" />
                                            {rentalInfo.endAt ? dayjs(rentalInfo.endAt).format("DD/MM/YYYY") : "Vô thời hạn"}
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: Status Badges */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-bold border ${
                                        rentalInfo.depositPaid 
                                        ? 'bg-green-50 text-green-600 border-green-100' 
                                        : 'bg-orange-50 text-orange-600 border-orange-100'
                                    }`}>
                                        {rentalInfo.depositPaid ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Info className="w-3.5 h-3.5" />}
                                        {rentalInfo.depositPaid ? "ĐÃ CỌC" : "CHƯA CỌC"}
                                    </div>
                                    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-bold border ${
                                        rentalInfo.billStatus === 'paid' 
                                        ? 'bg-green-50 text-green-600 border-green-100' 
                                        : rentalInfo.billStatus === 'unpaid'
                                        ? 'bg-red-50 text-red-600 border-red-100'
                                        : 'bg-gray-50 text-gray-500 border-gray-100'
                                    }`}>
                                        {rentalInfo.billStatus === 'paid' ? <CreditCard className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                        {rentalInfo.billStatus === 'paid' ? "ĐÃ ĐÓNG TIỀN" : rentalInfo.billStatus === 'unpaid' ? "CHƯA ĐÓNG TIỀN" : "CHƯA CÓ BILL"}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <p className="text-xs text-gray-400 font-medium italic">Không tìm thấy thông tin hợp đồng hiện tại</p>
                            </div>
                        )}
                        
                        {/* Footer Info */}
                        <div className="pt-2 text-center">
                            <span className="text-[10px] text-gray-300 font-medium">
                                Hồ sơ tạo lúc: {dayjs(user.createdAt).format("DD/MM/YYYY")}
                            </span>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
