"use client"

import { fetchBillsByTenantAPIs } from "@/apis/bill.apis"
import { fetchIncidentalCostByTenant } from "@/apis/incidentalCosts.apis"
import { createPaymentBill, createPaymentIncidentalCost } from "@/apis/payment.apis"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Calendar, CreditCard, Droplets, Eye, FileText, Home, ImageIcon, User, Zap } from "lucide-react"
import { useEffect, useMemo, useState } from "react"

interface Bill {
    _id: string
    createdAt: string
    duration: string
    time: string
    newElectricity: number
    oldElectricity: number
    newWater: number
    oldWater: number
    ownerId: {
        _id: string
        displayName: string
        email: string
        phone: string
    }
    roomId: {
        _id: string
        roomId: string
        price: number
    }
    tenantId: {
        _id: string
        displayName: string
        phone: string
    }
    serviceFee: Array<{
        name: string
        price: number
        _id: string
    }>
    status: boolean
    total: number
    prepay: number
    isPaid: boolean
}

export const BillsTenant = () => {
    const [bills, setBills] = useState<Bill[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [selectedMonth, setSelectedMonth] = useState<string>("")
    const [selectedYear, setSelectedYear] = useState<string>("")
    const [open, setOpen] = useState<boolean>(false)
    const [IncidentalCosts, setIncidentalCosts] = useState<any[]>([])
    // Set current month and year as default
    useEffect(() => {
        const now = new Date()
        setSelectedMonth((now.getMonth() + 1).toString().padStart(2, "0"))
        setSelectedYear(now.getFullYear().toString())
    }, [])

    useEffect(() => {
        fetchBillsByTenantAPIs()
            .then((res) => {
                setBills(res.data)
                setLoading(false)
            })
            .catch(() => {
                setLoading(false)
            })
        fetchIncidentalCostByTenant()
            .then((res) => {
                setIncidentalCosts(res.data)
            })
    }, [])


    // Filter bills by selected month and year
    const filteredBills = useMemo(() => {
        if (!selectedMonth || !selectedYear) return bills

        return bills.filter((bill) => {
            const billDate = new Date(bill.time)
            const billMonth = (billDate.getMonth() + 1).toString().padStart(2, "0")
            const billYear = billDate.getFullYear().toString()

            return billMonth === selectedMonth && billYear === selectedYear
        })
    }, [bills, selectedMonth, selectedYear])

    // Generate month and year options
    const monthOptions = Array.from({ length: 12 }, (_, i) => ({
        value: (i + 1).toString().padStart(2, "0"),
        label: `Tháng ${i + 1}`,
    }))

    const yearOptions = Array.from({ length: 5 }, (_, i) => {
        const year = new Date().getFullYear() - 2 + i
        return {
            value: year.toString(),
            label: `Năm ${year}`,
        }
    })

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount)
    }

    const handleViewBill = (billId: string) => {
        // Handle view bill action
        console.log("View bill:", billId)
    }

    const handlePayment = async (bill: Bill) => {
        await createPaymentBill({
            _id: bill._id,
            amount: bill.total
        }).then((res) => {
            window.location.href = res.data;
        });
    }
    const handlePaymentCost = async (cost) => {
        await createPaymentIncidentalCost({
            _id: cost._id,
            amount: cost.amount
        }).then((res) => {
            window.location.href = res.data;
        });
    }

    if (loading) {
        return (
            <Card className="w-full">
                <CardContent className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Đang tải dữ liệu...</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const handleViewImage = () => {

    }
    const handleViewPDF = () => {
        // Handle view PDF action
        console.log("View PDF")
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Hóa đơn của tôi
                    </CardTitle>
                    <CardDescription>Quản lý và theo dõi các hóa đơn tiền phòng của bạn</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Filter Section */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium">Lọc theo:</label>
                            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Chọn tháng" />
                                </SelectTrigger>
                                <SelectContent>
                                    {monthOptions.map((month) => (
                                        <SelectItem key={month.value} value={month.value}>
                                            {month.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select value={selectedYear} onValueChange={setSelectedYear}>
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Chọn năm" />
                                </SelectTrigger>
                                <SelectContent>
                                    {yearOptions.map((year) => (
                                        <SelectItem key={year.value} value={year.value}>
                                            {year.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center">
                            Tìm thấy {filteredBills.length} hóa đơn
                        </div>
                    </div>

                    {/* Table */}
                    <div className="rounded-md border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="font-semibold">
                                        <div className="flex items-center gap-2">
                                            <Home className="h-4 w-4" />
                                            Phòng
                                        </div>
                                    </TableHead>
                                    <TableHead className="font-semibold">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Chủ trọ
                                        </div>
                                    </TableHead>
                                    <TableHead className="font-semibold">Kỳ hạn</TableHead>
                                    <TableHead className="font-semibold">
                                        <div className="flex items-center gap-2">
                                            <Zap className="h-4 w-4" />
                                            Điện
                                        </div>
                                    </TableHead>
                                    <TableHead className="font-semibold">
                                        <div className="flex items-center gap-2">
                                            <Droplets className="h-4 w-4" />
                                            Nước
                                        </div>
                                    </TableHead>
                                    <TableHead className="font-semibold">Dịch vụ</TableHead>
                                    <TableHead className="font-semibold">Tổng tiền</TableHead>
                                    <TableHead className="font-semibold">Trạng thái</TableHead>
                                    <TableHead className="font-semibold text-center">Thao tác</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredBills.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                                            Không có hóa đơn nào trong tháng {selectedMonth}/{selectedYear}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredBills.map((bill) => (
                                        <TableRow key={bill._id} className="hover:bg-muted/30">
                                            <TableCell className="font-medium">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold">{bill?.roomId?.roomId}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {formatCurrency(bill?.roomId?.price)}/tháng
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{bill?.ownerId?.displayName}</span>
                                                    <span className="text-xs text-muted-foreground">{bill?.ownerId?.phone}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">{format(new Date(bill?.duration), "dd/MM/yyyy", { locale: vi })}</div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <div>{bill?.newElectricity - bill?.oldElectricity} kWh</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {bill?.oldElectricity} → {bill?.newElectricity}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <div>{bill?.newWater - bill?.oldWater} m³</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {bill?.oldWater} → {bill?.newWater}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    {bill.serviceFee.filter((s: any) => s.name !== "Điện" && s.name !== "Nước").map((service) => (
                                                        <div key={service._id} className="text-xs">
                                                            <span className="font-medium">{service?.name}:</span> {formatCurrency(service.price)}
                                                        </div>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-semibold text-lg">{formatCurrency(bill?.total)}</div>
                                                {bill.prepay > 0 && (
                                                    <div className="text-xs text-muted-foreground">Đã trả: {formatCurrency(bill?.prepay)}</div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {bill.isPaid ? <Badge
                                                    variant={bill?.status ? "default" : "destructive"}
                                                    className={bill?.status ? "bg-green-100 text-green-800 hover:bg-green-200" : ""}
                                                >
                                                    Đã thanh toán
                                                </Badge> :
                                                    <Badge variant="destructive">Chưa thanh toán</Badge>}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-2 justify-center">
                                                    <Popover open={open} onOpenChange={setOpen}>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className={`h-8 w-8 p-0 hover:bg-primary/10 hover:border-primary/20 transition-colors `}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-48 p-2" align="end">
                                                            <div className="space-y-1">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={handleViewImage}
                                                                    className="w-full justify-start gap-2 h-9 hover:bg-blue-50 hover:text-blue-700"
                                                                >
                                                                    <ImageIcon className="h-4 w-4 text-blue-600" />
                                                                    View Image
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={handleViewImage}
                                                                    className="w-full justify-start gap-2 h-9 hover:bg-red-50 hover:text-red-700"
                                                                >
                                                                    <FileText className="h-4 w-4 text-red-600" />
                                                                    View PDF
                                                                </Button>
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>
                                                    {!bill.isPaid && (
                                                        <Button
                                                            variant="default"
                                                            size="sm"
                                                            onClick={() => handlePayment(bill)}
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <CreditCard className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    {IncidentalCosts
                        .filter((item) => {
                            const date = new Date(item.createdAt)
                            const month = (date.getMonth() + 1).toString().padStart(2, '0')
                            const year = date.getFullYear().toString()
                            return month === selectedMonth && year === selectedYear
                        }).length > 0 && <>
                            <div className="mt-2">
                                <div className="text-xl font-semibold">Phí phát sinh:</div>
                            </div>

                            <div className="rounded-md border overflow-hidden mt-2">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50">
                                            <TableHead className="font-semibold">
                                                <div className="flex items-center gap-2">
                                                    <Home className="h-4 w-4" />
                                                    Phòng
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-semibold">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4" />
                                                    Chủ trọ
                                                </div>
                                            </TableHead>
                                            <TableHead className="font-semibold">Ngày tạo</TableHead>
                                            <TableHead className="font-semibold">Mô tả</TableHead>
                                            <TableHead className="font-semibold">Số tiền</TableHead>
                                            <TableHead className="font-semibold">Trạng thái</TableHead>
                                            <TableHead className="font-semibold">Chức năng</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {IncidentalCosts.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                    Không có phí phát sinh nào trong tháng {selectedMonth}/{selectedYear}
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            IncidentalCosts
                                                .filter((item) => {
                                                    const date = new Date(item.createdAt)
                                                    const month = (date.getMonth() + 1).toString().padStart(2, '0')
                                                    const year = date.getFullYear().toString()
                                                    return month === selectedMonth && year === selectedYear
                                                })
                                                .map((cost) => (
                                                    <TableRow key={cost._id} className="hover:bg-muted/30">
                                                        <TableCell className="font-medium">
                                                            <div className="flex flex-col">
                                                                <span className="font-semibold">{cost?.roomId?.roomId}</span>
                                                                <span className="text-xs text-muted-foreground">
                                                                    {formatCurrency(cost?.roomId?.price)}/tháng
                                                                </span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-col">
                                                                <span className="font-medium">{cost?.ownerId?.displayName}</span>
                                                                <span className="text-xs text-muted-foreground">{cost?.ownerId?.phone}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {format(new Date(cost.createdAt), "dd/MM/yyyy", { locale: vi })}
                                                        </TableCell>
                                                        <TableCell className="max-w-[200px] truncate" title={cost.description}>
                                                            {cost.description || "-"}
                                                        </TableCell>
                                                        <TableCell className="font-semibold text-lg">
                                                            {formatCurrency(cost.amount)}
                                                        </TableCell>
                                                        <TableCell>
                                                            {cost.isPaid ? (
                                                                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Đã thanh toán</Badge>
                                                            ) : (
                                                                <Badge variant="destructive">Chưa thanh toán</Badge>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="font-semibold text-lg">
                                                            <Button
                                                                onClick={() => handlePaymentCost(cost)}
                                                                className="h-8 w-8 p-0"
                                                            >
                                                                <CreditCard className="h-4 w-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </>}


                </CardContent>
            </Card>
        </div>
    )
}
