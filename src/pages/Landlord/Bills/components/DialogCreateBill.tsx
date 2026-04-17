import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from 'react-toastify';
import { createBillAPIs } from '@/apis/bill.apis';

export const DialogCreateBill = ({ open, setOpen, orderRooms, departments, fetchData }: { open: boolean, setOpen: (value: boolean) => void, orderRooms: any, departments: any, fetchData: () => void }) => {
    const [date, setDate] = useState("");
    const [house, setHouse] = useState("all");
    const [room, setRoom] = useState("all");


    const handleSubmit = () => {
        const data = {
            date,
            roomId: room
        }
        toast.promise(
            createBillAPIs(data),
            {
                pending: 'Đang tạo hóa đơn...',
                success: 'Tạo hóa đơn thành công!',
            }
        ).then(() => {
            fetchData();
            setOpen(false);
        })
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="mb-2">TÍNH TIỀN</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="month" className="mb-1"><span className="text-red-500">*</span> Tháng:</Label>
                        <Input
                            id="month"
                            type="month"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="house" className="mb-1"><span className="text-red-500">*</span> Tòa:</Label>
                        <Select value={house} onValueChange={setHouse}>
                            <SelectTrigger id="house">
                                <SelectValue placeholder="Tất cả" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={"all"}>Tất cả</SelectItem>

                                {departments.map(h => (
                                    <SelectItem key={h._id} value={h._id}>{h.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="room" className="mb-1"><span className="text-red-500">*</span> Phòng:</Label>
                        <Select value={room} onValueChange={setRoom}>
                            <SelectTrigger id="room">
                                <SelectValue placeholder="Tất cả" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={"all"}>Tất cả</SelectItem>
                                {orderRooms.map(r => (
                                    <SelectItem key={r._id} value={r.room._id}>{r.room.roomId}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {/* <div className="flex items-center gap-2">
                        <Checkbox id="recalculate" checked={recalculate} onCheckedChange={setRecalculate} />
                        <Label htmlFor="recalculate">Tính lại các nhà trong tháng</Label>
                    </div> */}
                </div>
                <DialogFooter className="mt-4 flex gap-2 justify-center">
                    <Button type="button" onClick={handleSubmit} className="flex items-center gap-2" size='sm'>
                        <span className="i-mdi-calculator" /> Tạo hóa đơn
                    </Button>
                    <Button type="button" variant="destructive" onClick={() => setOpen(false)} size='sm'>
                        X Đóng
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
