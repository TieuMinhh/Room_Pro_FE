import React from "react"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export const PaymentSuccess = () => {
    const navigate = useNavigate()
    const searchParams = new URLSearchParams(window.location.search);
    const type = searchParams.get("type");

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-white px-4">
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center max-w-md w-full">
                <CheckCircle2 className="text-green-500 w-16 h-16 mb-4" />
                <h1 className="text-2xl font-bold mb-2 text-green-700">Thanh toán thành công!</h1>
                <p className="text-gray-600 mb-6 text-center">
                    Cảm ơn bạn đã hoàn tất thanh toán.<br />
                    Đơn hàng của bạn đã được xác nhận.
                </p>
                <Button
                    className="w-full"
                    onClick={() => type === "bill" ? navigate("/bill-tenant") : type === "incidentalCost" ? navigate("/bill-tenant") : navigate("/contracts")}
                >
                    Quay về trang chủ
                </Button>
            </div>
        </div>
    )
}
