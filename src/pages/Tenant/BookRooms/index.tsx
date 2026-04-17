"use client"

import { fetchBookRoomInTenantAPIs } from "@/apis/book.room.apis"
import Loader from "@/components/ui-customize/Loader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Edit, X } from "lucide-react"
import { useEffect, useState } from "react"

interface Booking {
    id: string
    name: string
    roomImage: string // Thay đổi từ image thành roomImage
    startTime: string
    endTime: string
    status: "confirmed" | "pending" | "cancelled" | "completed"
    note: string
    feedback: string
    room: string
}


export const BookRoom = () => {
    const [bookRooms, setBookRooms] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        fetchBookRoomInTenantAPIs().then(res => {
            setBookRooms(res.data)
            setLoading(false)
        })
    }

    if (loading) return <Loader />





    const formatDateTime = (dateTime: string) => {
        const date = new Date(dateTime)
        return {
            date: date.toLocaleDateString("vi-VN"),
            time: date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        }
    }

    return (
        <div className="w-full space-y-4">
            {bookRooms.length > 0 ?
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Danh sách đặt phòng
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">Ảnh phòng</TableHead>
                                        <TableHead className="w-[120px]">Tên phòng</TableHead>
                                        <TableHead className="w-[140px]">Bắt đầu</TableHead>
                                        <TableHead className="w-[140px]">Kết thúc</TableHead>
                                        <TableHead className="w-[120px]">Trạng thái</TableHead>
                                        <TableHead className="w-[200px]">Ghi chú</TableHead>
                                        <TableHead className="w-[200px]">Phản hồi</TableHead>
                                        <TableHead className="w-[150px] text-center">Chức năng</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {bookRooms.map((booking) => {
                                        const startDateTime = formatDateTime(booking.startDate)
                                        const endDateTime = formatDateTime(booking.endDate)

                                        return (
                                            <TableRow key={booking.id}>

                                                <TableCell>
                                                    <img
                                                        src={booking.roomId?.image[0] || "/placeholder.svg"}
                                                        alt={`Ảnh `}
                                                        width={80}
                                                        height={60}
                                                        className="rounded-lg object-cover border"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{booking.blogId.title || "Phòng gần trợ"}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="text-sm font-medium">{startDateTime.date}</div>

                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        <div className="text-sm font-medium">{endDateTime.date}</div>
                                                        <div className="text-sm text-muted-foreground flex items-center gap-1">

                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{(booking.status)}</TableCell>
                                                <TableCell>
                                                    <div className="max-w-[200px] truncate text-sm" title={booking.note}>
                                                        {booking.note || "Không có ghi chú"}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="max-w-[200px]">
                                                        {booking.reply ? (
                                                            <div className="flex items-start gap-1">
                                                                <span className="text-sm truncate" title={booking.reply}>
                                                                    {booking.reply}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm text-muted-foreground">Chưa có phản hồi</span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2 justify-center">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 w-8 p-0"
                                                            title="Chỉnh sửa"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            disabled={booking.status === "cancelled" || booking.status === "completed"}
                                                            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                                            title="Hủy đặt phòng"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
                :
                <div className="flex items-center justify-center h-full">
                    <h1 className=" font-semibold">Chưa có đặt phòng</h1>
                </div>
            }
        </div >
    )
}
