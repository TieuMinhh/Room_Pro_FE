"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    ToggleGroup,
    ToggleGroupItem,
} from "@/components/ui/toggle-group"

const chartConfig = {
    total: {
        label: "Tổng tiền",
        color: "hsl(var(--chart-1))",
    },
    paid: {
        label: "Đã thanh toán",
        color: "hsl(var(--chart-2))",
    },
    unpaid: {
        label: "Chưa thanh toán",
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig

export function ChartAreaInteractive({ bills }: { bills: any[] }) {
    const [timeRange, setTimeRange] = React.useState("30d")

    // Xử lý dữ liệu bills
    const processedData = React.useMemo(() => {
        if (!bills || bills.length === 0) return []

        // Sắp xếp bills theo thời gian time
        const sortedBills = [...bills].sort((a, b) =>
            new Date(a.time).getTime() - new Date(b.time).getTime()
        )

        // Nhóm bills theo ngày và tính tổng
        const groupedData = sortedBills.reduce((acc, bill) => {
            const date = new Date(bill.time).toISOString().split('T')[0] // Lấy YYYY-MM-DD

            if (!acc[date]) {
                acc[date] = {
                    date,
                    paid: 0,
                    unpaid: 0,
                    total: 0
                }
            }

            if (bill.isPaid) {
                acc[date].paid += bill.total || 0
            } else {
                acc[date].unpaid += bill.total || 0
            }
            acc[date].total += bill.total || 0

            return acc
        }, {})

        return Object.values(groupedData)
    }, [bills])

    // Lọc dữ liệu theo timeRange
    const filteredData = React.useMemo(() => {
        if (processedData.length === 0) return []

        const now = new Date()
        let daysToSubtract = 90

        if (timeRange === "30d") {
            daysToSubtract = 30
        } else if (timeRange === "7d") {
            daysToSubtract = 7
        }

        const startDate = new Date(now)
        startDate.setDate(startDate.getDate() - daysToSubtract)

        return processedData.filter((item) => {
            const itemDate = new Date(item.date)
            return itemDate >= startDate
        })
    }, [processedData, timeRange])

    // Tính tổng tiền cho hiển thị
    const totalAmount = React.useMemo(() => {
        return filteredData.reduce((sum, item) => sum + item.total, 0)
    }, [filteredData])

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount)
    }

    const getTimeRangeText = () => {
        switch (timeRange) {
            case "7d": return "7 ngày qua"
            case "30d": return "30 ngày qua"
            case "90d": return "3 tháng qua"
            default: return "3 tháng qua"
        }
    }

    return (
        <Card className="@container/card">
            <CardHeader className="relative">
                <CardTitle>Doanh thu hóa đơn</CardTitle>
                <CardDescription>
                    <span className="@[540px]/card:block hidden">
                        Tổng doanh thu {getTimeRangeText()}: {formatCurrency(totalAmount)}
                    </span>
                    <span className="@[540px]/card:hidden">
                        {getTimeRangeText()}: {formatCurrency(totalAmount)}
                    </span>
                </CardDescription>
                <div className="absolute right-4 top-4">
                    <ToggleGroup
                        type="single"
                        value={timeRange}
                        onValueChange={setTimeRange}
                        variant="outline"
                        className="@[767px]/card:flex hidden"
                    >
                        <ToggleGroupItem value="90d" className="h-8 px-2.5">
                            3 tháng qua
                        </ToggleGroupItem>
                        <ToggleGroupItem value="30d" className="h-8 px-2.5">
                            30 ngày qua
                        </ToggleGroupItem>
                        <ToggleGroupItem value="7d" className="h-8 px-2.5">
                            7 ngày qua
                        </ToggleGroupItem>
                    </ToggleGroup>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger
                            className="@[767px]/card:hidden flex w-40"
                            aria-label="Select a value"
                        >
                            <SelectValue placeholder="3 tháng qua" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="90d" className="rounded-lg">
                                3 tháng qua
                            </SelectItem>
                            <SelectItem value="30d" className="rounded-lg">
                                30 ngày qua
                            </SelectItem>
                            <SelectItem value="7d" className="rounded-lg">
                                7 ngày qua
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                {filteredData.length === 0 ? (
                    <div className="flex h-[250px] items-center justify-center text-muted-foreground">
                        Không có dữ liệu hóa đơn trong khoảng thời gian này
                    </div>
                ) : (
                    <ChartContainer
                        config={chartConfig}
                        className="aspect-auto h-[250px] w-full"
                    >
                        <AreaChart data={filteredData}>
                            <defs>
                                <linearGradient id="fillPaid" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor="var(--color-paid)"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="var(--color-paid)"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                                <linearGradient id="fillUnpaid" x1="0" y1="0" x2="0" y2="1">
                                    <stop
                                        offset="5%"
                                        stopColor="var(--color-unpaid)"
                                        stopOpacity={0.8}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="var(--color-unpaid)"
                                        stopOpacity={0.1}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={32}
                                tickFormatter={(value) => {
                                    const date = new Date(value)
                                    return date.toLocaleDateString("vi-VN", {
                                        month: "short",
                                        day: "numeric",
                                    })
                                }}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        labelFormatter={(value) => {
                                            return new Date(value).toLocaleDateString("vi-VN", {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })
                                        }}
                                        formatter={(value, name) => [
                                            formatCurrency(value),
                                            chartConfig[name]?.label || name
                                        ]}
                                        indicator="dot"
                                    />
                                }
                            />
                            <Area
                                dataKey="unpaid"
                                type="natural"
                                fill="url(#fillUnpaid)"
                                stroke="var(--color-unpaid)"
                                stackId="a"
                            />
                            <Area
                                dataKey="paid"
                                type="natural"
                                fill="url(#fillPaid)"
                                stroke="var(--color-paid)"
                                stackId="a"
                            />
                        </AreaChart>
                    </ChartContainer>
                )}
            </CardContent>
        </Card>
    )
}