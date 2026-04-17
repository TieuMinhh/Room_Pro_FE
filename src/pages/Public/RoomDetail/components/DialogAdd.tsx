'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { createBookRoomAPIs } from "@/apis/book.room.apis"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import dayjs from "dayjs"

type RentDateForm = {
    startDate: string
    endDate: string
    note?: string
}

export default function RentDateDialog({ open, setOpen, blog }: any) {
    const { register, handleSubmit, reset, watch, setValue } = useForm<RentDateForm>()
    const navigate = useNavigate()

    const today = dayjs()
    const availableFrom = dayjs(blog?.availableFrom)
    const minStartDate = today.isAfter(availableFrom) ? today : availableFrom

    const watchStartDate = watch("startDate") || minStartDate.format("YYYY-MM-DD")
    const minEndDate = dayjs(watchStartDate).add(30, 'day')

    useEffect(() => {
        // Gán mặc định khi mở form
        setValue("startDate", minStartDate.format("YYYY-MM-DD"))
        setValue("endDate", minEndDate.format("YYYY-MM-DD"))
    }, [open])

    const onSubmit = async (data: RentDateForm) => {
        const start = dayjs(data.startDate)
        const end = dayjs(data.endDate)

        if (end.diff(start, 'day') < 30) {
            toast.error("Ngày kết thúc phải cách ngày bắt đầu ít nhất 30 ngày.")
            return
        }

        await createBookRoomAPIs({
            ...data,
            blogId: blog._id,
        }).then((res) => {
            toast.success("Đặt phòng trọ thành công!")
            navigate('/book-rooms')
            setOpen(false)
            reset()
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md rounded-xl p-6">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Chọn ngày thuê trọ</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
                    <div className="grid gap-2">
                        <Label htmlFor="startDate" className="text-sm font-medium">Ngày bắt đầu</Label>
                        <Input
                            type="date"
                            id="startDate"
                            {...register("startDate", { required: true })}
                            className="rounded-lg border p-2"
                            min={minStartDate.format("YYYY-MM-DD")}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="endDate" className="text-sm font-medium">Ngày kết thúc</Label>
                        <Input
                            type="date"
                            id="endDate"
                            {...register("endDate", { required: true })}
                            className="rounded-lg border p-2"
                            min={minEndDate.format("YYYY-MM-DD")}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="note" className="text-sm font-medium">Ghi chú</Label>
                        <Textarea
                            id="note"
                            {...register("note")}
                            placeholder="Nhập ghi chú nếu có..."
                            className="rounded-lg border p-2 min-h-[100px]"
                        />
                    </div>

                    <DialogFooter className="mt-6">
                        <Button
                            type="submit"
                            className="w-full rounded-full text-white bg-primary hover:bg-primary/90"
                        >
                            Xác nhận thuê
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
