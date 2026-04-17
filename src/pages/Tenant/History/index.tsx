import { useEffect, useState } from "react";
import { getTenantHistory } from "@/apis/order.apis";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";
import { 
    History, 
    Calendar, 
    MapPin,
    ArrowUpRight,
    CheckCircle2,
    Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export const TenantHistory = () => {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getTenantHistory()
            .then(res => {
                setHistory(res.data || []);
            })
            .catch(err => {
                toast.error("Không thể tải lịch sử thuê phòng");
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 pb-20">
            {/* Header section with historical context */}
            <div className="bg-gradient-to-r from-blue-400 to-indigo-500 pt-10 pb-24 px-6 md:px-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="animate-fade-in">
                        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                            <History className="w-8 h-8" />
                            Lịch sử thuê trọ
                        </h1>
                        <p className="text-blue-50 mt-2 font-medium opacity-90">
                            Xem lại hành trình và các phòng trọ bạn đã từng gắn bó.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-6 md:px-10 -mt-12">
                {history.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-sm border border-white rounded-[2rem] p-16 text-center animate-scale-in shadow-xl">
                        <div className="bg-blue-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 border border-blue-100">
                            <History className="w-12 h-12 text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3 tracking-tight">Chưa có lịch sử thuê!</h3>
                        <p className="text-muted-foreground mb-8 max-w-sm mx-auto font-medium leading-relaxed">
                            Các phòng bạn đã kết thúc thuê sẽ xuất hiện tại đây để bạn dễ dàng tra cứu thông tin hợp đồng cũ.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {history.map((item, index) => (
                            <Card 
                                key={index} 
                                className="group border-none shadow-premium hover:shadow-xl transition-all duration-500 animate-slide-up bg-white overflow-hidden rounded-3xl"
                                style={{ animationDelay: `${index * 50}ms` }}
                            >
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row">
                                        {/* Image Section */}
                                        <div className="md:w-72 h-48 md:h-auto relative overflow-hidden">
                                            <img
                                                src={item.roomData?.image?.[0] || "/default-room.jpg"}
                                                alt={`Phòng ${item.roomId}`}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent md:hidden" />
                                            
                                            {/* Status Badge Over Image on Mobile */}
                                            <div className="absolute top-4 left-4 md:hidden">
                                                <Badge className={`rounded-full px-3 py-1 border-none font-bold text-[10px] shadow-lg ${
                                                    item.status === 'ACTIVE' 
                                                    ? 'bg-green-500 text-white' 
                                                    : 'bg-gray-500/80 backdrop-blur-md text-white'
                                                }`}>
                                                    {item.status === 'ACTIVE' ? 'ĐANG Ở' : 'ĐÃ KẾT THÚC'}
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* Info Section */}
                                        <div className="flex-1 p-6 md:p-8">
                                            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                                                <div>
                                                    <div className="flex items-center gap-4">
                                                        <h2 className="text-2xl font-bold text-gray-800">
                                                            Phòng {item.roomId}
                                                        </h2>
                                                        <Badge className={`hidden md:flex rounded-full px-4 py-1 border-none font-bold text-[10px] tracking-wider ${
                                                            item.status === 'ACTIVE' 
                                                            ? 'bg-blue-50 text-blue-600' 
                                                            : 'bg-gray-100 text-gray-500'
                                                        }`}>
                                                            {item.status === 'ACTIVE' ? (
                                                                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> ĐANG Ở</span>
                                                            ) : (
                                                                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> ĐÃ KẾT THÚC</span>
                                                            )}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-500 font-medium text-sm mt-2">
                                                        <MapPin className="w-4 h-4 text-blue-500" />
                                                        <span>{item.roomData?.location || "Khu vực trung tâm"}</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col md:items-end">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-1.5">Thời gian cư trú</span>
                                                    <div className="flex items-center gap-2 bg-blue-50/50 text-blue-700 px-4 py-2 rounded-xl font-bold text-sm border border-blue-100/50">
                                                        <Calendar className="w-4 h-4" />
                                                        {dayjs(item.startAt).format('DD/MM/YYYY')} — {dayjs(item.endAt).format('DD/MM/YYYY')}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-gray-100">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 tracking-wide">Giá thuê (Lần cuối)</span>
                                                    <span className="font-bold text-gray-700">{item.roomData?.price?.toLocaleString()} đ</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 tracking-wide">Diện tích</span>
                                                    <span className="font-bold text-gray-700">{item.roomData?.area} m²</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 tracking-wide">Mã hợp đồng</span>
                                                    <code className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded w-fit text-sm">#{item.contract?.slice(-8).toUpperCase() || "N/A"}</code>
                                                </div>
                                                <div className="flex items-end justify-end">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl px-4 h-10 transition-all gap-1.5"
                                                        onClick={() => navigate(`/contract-detail/${item.contract}`)}
                                                        disabled={!item.contract}
                                                    >
                                                        Xem chi tiết
                                                        <ArrowUpRight className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
