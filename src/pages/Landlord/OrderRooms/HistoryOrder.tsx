"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    CalendarDays,
    MapPin,
    Phone,
    User,
    Archive,
    Building2Icon,
    Home,
} from "lucide-react"
import { useParams } from "react-router-dom"
import { fetchOrderByIdAPIs } from "@/apis/order.apis"

interface HistoryItem {
    tenantId: string[]
    contract: {
        _id: string
        contractURI?: string
        startAt?: string
        endAt?: string
    }
    startAt: string
    endAt: string
}

export default function RentalHistory() {
    const [history, setHistory] = useState<HistoryItem[]>([])
    const [orderRoom, setOrderRoom] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const { id } = useParams<{ id: string }>()

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            const res = await fetchOrderByIdAPIs(id)
            setHistory(res.data.history || [])
            setOrderRoom(res.data)
        } catch (error) {
            console.error("Error fetching data:", error)
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateString?: string | null) => {
        if (!dateString) return "Không rõ"
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    const calculateDuration = (startAt?: string, endAt?: string) => {
        if (!startAt || !endAt) return "Không rõ"
        const start = new Date(startAt)
        const end = new Date(endAt)
        const diffTime = Math.abs(end.getTime() - start.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }

    if (loading) {
        return (
            <div className="container mx-auto p-6 space-y-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                    <div className="h-32 bg-gray-200 rounded"></div>
                </div>
            </div>
        )
    }

    if (!orderRoom) {
        return (
            <div className="container mx-auto p-6">
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">
                            Không tìm thấy dữ liệu lịch sử thuê phòng
                        </p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <Archive className="h-6 w-6" />
                <h1 className="text-3xl font-bold">Lịch sử thuê phòng</h1>
                <Badge variant="outline" className="ml-2">
                    {history.length} lần thuê
                </Badge>
            </div>

            {/* Owner Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Thông tin phòng trọ
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage
                                src={orderRoom.room?.image?.[0] || "/placeholder.svg"}
                                alt={`Phòng ${orderRoom.room?.roomId}`}
                            />
                            <AvatarFallback>{orderRoom.room?.roomId}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                            <h3 className="font-semibold text-lg">
                                {orderRoom.owner?.displayName}
                            </h3>
                            <div className="grid md:grid-cols-2 gap-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <Building2Icon className="h-4 w-4 text-muted-foreground" />
                                    <span>{orderRoom.room?.departmentId?.name}</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Badge
                                        className={orderRoom?.room?.status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
                                    >
                                        {orderRoom?.room?.status
                                            ?
                                            "Đang cho thuê"
                                            :
                                            "Trống"
                                        }
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <span>{orderRoom.room?.departmentId.village + " - " + orderRoom.room?.departmentId.district + " - " + orderRoom.room?.departmentId.province}</span>
                                </div>

                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Current Contract */}


            {/* Rental History */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CalendarDays className="h-5 w-5" />
                        Lịch sử thuê phòng
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {history.map((item: any, index) => (
                            <div key={index} className="relative">
                                {index !== history.length - 1 && (
                                    <div className="absolute left-4 top-8 bottom-0 w-px bg-border"></div>
                                )}
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                                        {index + 1}
                                    </div>
                                    <Card className="flex-1">
                                        <CardContent className="p-4">
                                            <div className="grid md:grid-cols-4 gap-4">
                                                <div>
                                                    <h4 className="font-medium mb-1">Hợp đồng</h4>
                                                    <a
                                                        href={item.contract?.contractURI}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm underline text-blue-600"
                                                    >
                                                        Xem hợp đồng
                                                    </a>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium mb-1">Người thuê </h4>
                                                    <div className="">
                                                        <div className="flex items-center gap-2">
                                                            <Avatar className="h-6 w-6">
                                                                <AvatarImage
                                                                    src={item.tenant?.avatar || "/placeholder.svg"}
                                                                    alt={item.tenant?.displayName}
                                                                />
                                                                <AvatarFallback>
                                                                    {item.tenant?.displayName?.charAt(0)}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <span className="text-sm">
                                                                {item.tenant?.displayName || "Không rõ"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium mb-1">Thời gian thuê</h4>
                                                    <div className="text-sm space-y-1">
                                                        <div>
                                                            <span className="text-muted-foreground">Từ: </span>
                                                            <span>{formatDate(item.startAt)}</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-muted-foreground">Đến: </span>
                                                            <span>{formatDate(item.endAt)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium mb-1">Thời lượng</h4>
                                                    <Badge variant="outline">
                                                        {calculateDuration(item.startAt, item.endAt)} ngày
                                                    </Badge>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
