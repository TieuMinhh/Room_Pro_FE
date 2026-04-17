import { TrendingUpIcon } from "lucide-react"

import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export function SectionCards({ bills, tenants, order }: { bills: any[], tenants: any[], order: any[] }) {
    console.log("🚀 ~ SectionCards ~ order:", order)

    return (
        <div className="flex flex-wrap gap-4 px-4 lg:px-6">
            <Card className="w-full sm:w-[48%] lg:w-[23.5%] bg-gradient-to-t from-primary/5 to-card dark:bg-card shadow-xs">
                <CardHeader className="relative">
                    <CardDescription>Tổng doanh thu</CardDescription>
                    <CardTitle className="text-2xl @[250px]/card:text-3xl font-semibold tabular-nums">
                        {bills.length > 0 ? bills.reduce((acc, bill) => acc + bill.total, 0).toLocaleString() : 0}
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="flex gap-2 font-medium line-clamp-1">
                        Tăng trưởng ổn định  <TrendingUpIcon className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        Doanh thu trong mấy tháng gần nhất
                    </div>
                </CardFooter>
            </Card>

            <Card className="w-full sm:w-[48%] lg:w-[23.5%] bg-gradient-to-t from-primary/5 to-card dark:bg-card shadow-xs">
                <CardHeader className="relative">
                    <CardDescription>Doanh thu tháng này</CardDescription>
                    <CardTitle className="text-2xl @[250px]/card:text-3xl font-semibold tabular-nums">
                        {bills.length > 0
                            ? bills
                                .filter((bill) => new Date(bill.time).getMonth() === new Date().getMonth())
                                .reduce((acc, bill) => acc + bill.total, 0)
                                .toLocaleString()
                            : 0}
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="flex gap-2 font-medium line-clamp-1">
                        Tiền điện trong tháng này
                    </div>
                    <div className="text-muted-foreground">
                        Cần chú ý đến việc thu tiền
                    </div>
                </CardFooter>
            </Card>

            <Card className="w-full sm:w-[48%] lg:w-[23.5%] bg-gradient-to-t from-primary/5 to-card dark:bg-card shadow-xs">
                <CardHeader className="relative">
                    <CardDescription>Tổng số người thuê</CardDescription>
                    <CardTitle className="text-2xl @[250px]/card:text-3xl font-semibold tabular-nums">
                        {tenants.length}
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="flex gap-2 font-medium line-clamp-1">
                        Người thuê duy trì ổn định <TrendingUpIcon className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        Mức độ gắn bó vượt kỳ vọng
                    </div>
                </CardFooter>
            </Card>

            <Card className="w-full sm:w-[48%] lg:w-[23.5%] bg-gradient-to-t from-primary/5 to-card dark:bg-card shadow-xs">
                <CardHeader className="relative">
                    <CardDescription>Người thuê mới tháng này</CardDescription>
                    <CardTitle className="text-2xl @[250px]/card:text-3xl font-semibold tabular-nums">
                        {order.filter(o => o.startAt && new Date(o.startAt).getMonth() > new Date().getMonth()).length}
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="flex gap-2 font-medium line-clamp-1">
                        Tăng trưởng đều đặn <TrendingUpIcon className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        Đúng với dự đoán tăng trưởng
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
