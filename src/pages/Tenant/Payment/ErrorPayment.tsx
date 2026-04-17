import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { XCircle } from 'lucide-react'

export const ErrorPayment = () => {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted">
            <Alert variant="destructive" className="max-w-md w-full">
                <XCircle className="h-8 w-8 text-destructive mb-2" />
                <AlertTitle className="text-xl">Giao dịch thất bại</AlertTitle>
                <AlertDescription>
                    Đã có lỗi xảy ra trong quá trình thanh toán.<br />
                    Vui lòng thử lại hoặc liên hệ hỗ trợ.
                </AlertDescription>
                <Button
                    className="mt-6"
                    variant="destructive"
                    onClick={() => navigate('/')}
                >
                    Quay lại trang chủ
                </Button>
            </Alert>
        </div>
    )
}
