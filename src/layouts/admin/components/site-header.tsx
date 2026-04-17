import { fetchWalletAdmin } from "@/apis/wallet.apis"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Wallet2 } from 'lucide-react'
export function SiteHeader() {
    const [walletBalance, setWalletBalance] = useState<number>(0)
    const navigate = useNavigate()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetchWalletAdmin()
                setWalletBalance(res.data.walletBalance)
            } catch (err) {
                console.error("Lỗi khi lấy số dư ví", err)
            }
        }

        fetchData()
    }, [])
    return (
        <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
            <div className="flex w-full justify-between items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mx-2 data-[orientation=vertical]:h-4"
                    />
                    <h1 className="text-base font-medium">Documents</h1>
                </div>
                <div
                    onClick={() => navigate("/history")}
                    className="flex items-center gap-2 cursor-pointer bg-green-100 hover:bg-green-200 text-green-700 text-sm font-semibold px-4 py-1 rounded-full transition-all duration-200"
                >
                    <Wallet2 className="w-5 h-5 text-green-700" />
                    <span>Số dư ví: {walletBalance.toLocaleString("vi-VN")} VND</span>
                </div>
            </div>

        </header>
    )
}
