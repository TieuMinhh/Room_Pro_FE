import { useEffect, useState } from "react";
import { getTenantRooms } from "@/apis/order.apis";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";
import { 
    Home, 
    Maximize, 
    Zap, 
    Droplets, 
    Infinity, 
    CheckCircle2, 
    ExternalLink, 
    MapPin,
    BadgeDollarSign,
    Info,
    Calendar
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

export const TenantRooms = () => {
    const [rooms, setRooms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        getTenantRooms()
            .then(res => {
                setRooms(res.data || []);
            })
            .catch(err => {
                toast.error("Không thể tải danh sách phòng đã thuê");
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
            {/* Header section with blue gradient background */}
            <div className="bg-gradient-to-r from-blue-500 to-sky-500 pt-10 pb-24 px-6 md:px-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="animate-fade-in">
                        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                            <Home className="w-8 h-8" />
                            Phòng đang thuê
                        </h1>
                        <p className="text-blue-50 mt-2 font-medium opacity-90">
                            Quản lý các phòng trọ bạn đang ở và theo dõi thông tin chi tiết.
                        </p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 animate-scale-in">
                        <div className="text-white text-sm font-semibold opacity-80 uppercase tracking-wider">Tổng số phòng</div>
                        <div className="text-3xl font-bold text-white">{rooms.length}</div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-6 md:px-10 -mt-12">
                {rooms.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-sm border border-white rounded-[2rem] p-16 text-center animate-scale-in shadow-xl">
                        <div className="bg-blue-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 border border-blue-100 shadow-inner">
                            <Home className="w-12 h-12 text-blue-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-3 tracking-tight">Bạn chưa thuê phòng nào!</h3>
                        <p className="text-muted-foreground mb-8 max-w-sm mx-auto font-medium leading-relaxed">
                            Hãy khám phá các phòng trọ tuyệt vời trên hệ thống của chúng tôi và bắt đầu hành trình của bạn.
                        </p>
                        <Button 
                            size="lg"
                            className="rounded-xl px-10 py-6 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 shadow-lg shadow-blue-200 transition-all duration-300 font-bold"
                            onClick={() => navigate('/tim-kiem-tro')}
                        >
                            Tìm kiếm phòng ngay
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {rooms.map((room, index) => (
                            <Card 
                                key={room._id} 
                                className="group border-none shadow-xl hover:shadow-2xl transition-all duration-500 animate-slide-up bg-white overflow-hidden rounded-[2rem]"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Room Image Header */}
                                <div className="relative h-60 overflow-hidden">
                                    <img
                                        src={room.image?.[0] || "/default-room.jpg"}
                                        alt={`Phòng ${room.roomId}`}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                                    
                                    <Badge className="absolute top-5 right-5 bg-white/90 backdrop-blur-md text-blue-600 border-none shadow-xl px-4 py-2 rounded-full flex gap-2 items-center font-bold">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                        ĐANG THUÊ
                                    </Badge>

                                    <div className="absolute bottom-5 left-5 text-white">
                                        <div className="flex items-center gap-2 text-sm font-bold bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/30">
                                            <MapPin className="w-4 h-4" />
                                            {room.departmentId?.name || "Khu vực trung tâm"}
                                        </div>
                                    </div>
                                </div>
                                
                                <CardContent className="p-8">
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                                                Phòng {room.roomId}
                                            </h2>
                                            <div className="flex flex-col gap-2 mt-3">
                                                <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                                                    <Maximize className="w-4 h-4 text-blue-500" />
                                                    <span>Diện tích: {room.area} m²</span>
                                                </div>
                                                {room.startAt && (
                                                    <div className="flex items-center gap-2 text-gray-400 font-medium text-xs">
                                                        <Calendar className="w-4 h-4 text-blue-400" />
                                                        <span>
                                                            {dayjs(room.startAt).format('DD/MM/YYYY')} - {room.endAt ? dayjs(room.endAt).format('DD/MM/YYYY') : 'Đang ở'}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-2xl inline-block">
                                                <div className="text-2xl font-bold text-blue-600">
                                                    {room.price?.toLocaleString()}
                                                </div>
                                                <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest text-center">VNĐ / Tháng</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        {/* Tiện ích - Thẻ tinh tế hơn */}
                                        <div>
                                            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
                                                <Infinity className="w-4 h-4 text-blue-500" />
                                                Tiện ích sẵn có
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {Array.isArray(room.utilities) ? (
                                                    room.utilities.map((util, i) => (
                                                        <span key={i} className="text-xs bg-gray-50 border border-gray-100 text-gray-600 px-3 py-1.5 rounded-lg font-semibold hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all cursor-default">
                                                            {util}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">Liên hệ chủ trọ để xem tiện ích</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Dịch vụ & Chi phí - Phân chia rõ ràng */}
                                        <div className="pt-6 border-t border-gray-100">
                                            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-5 flex items-center gap-2">
                                                <Zap className="w-4 h-4 text-blue-500" />
                                                Dịch vụ hằng tháng
                                            </div>
                                            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                                {Array.isArray(room.serviceFee) && room.serviceFee.length > 0 ? (
                                                    room.serviceFee.map((fee, idx) => (
                                                        <div key={idx} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors group/item">
                                                            <div className="p-2 bg-blue-50 rounded-lg group-hover/item:bg-blue-100 transition-colors">
                                                                {fee.name.toLowerCase().includes('điện') ? <Zap className="w-4 h-4 text-blue-500" /> : 
                                                                 fee.name.toLowerCase().includes('nước') ? <Droplets className="w-4 h-4 text-blue-500" /> : 
                                                                 <Info className="w-4 h-4 text-blue-400" />}
                                                            </div>
                                                            <div>
                                                                <div className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">{fee.name}</div>
                                                                <div className="text-sm font-bold text-gray-700">
                                                                    {fee.price?.toLocaleString()}
                                                                    <span className="text-[10px] text-gray-400 ml-1 font-normal">/{fee.unit}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-xs text-gray-400 italic col-span-2">Đang cập nhật chi phí dịch vụ...</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Footer */}
                                    <div className="mt-8 pt-8 border-t border-gray-100 flex gap-4">
                                        <Button 
                                            variant="outline" 
                                            className="flex-1 rounded-xl h-12 font-bold border-blue-100 text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all duration-300"
                                            onClick={() => navigate(`/contracts`)}
                                        >
                                            Hợp đồng
                                        </Button>
                                        <Button 
                                            className="flex-1 rounded-xl h-12 font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all duration-300 gap-2"
                                            onClick={() => navigate(`/tro/${room._id}`)}
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            Chi tiết
                                        </Button>
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
