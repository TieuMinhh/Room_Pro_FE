import { useState, useMemo, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import { Search, User, CalendarCheck, CheckCircle2, Phone } from "lucide-react"
import DatePicker from "react-datepicker"
import { format } from "date-fns"
import { updateOrderAPIs } from "@/apis/order.apis"
import { createTenantAndAssignAPI } from "@/apis/tenant.apis"

export default function AddUserDialog({ open, setOpen, users, order, fetchData }: {
    open: boolean,
    setOpen: (value: boolean) => void,
    users: any[],
    order: any,
    fetchData: any
}) {
    const [phoneInput, setPhoneInput] = useState("")
    const [selectedUser, setSelectedUser] = useState<any>(null)
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)
    const [electricityNumber, setElectricityNumber] = useState("")
    const [mode, setMode] = useState<"add" | "create">("add")

    const [newUserData, setNewUserData] = useState({
        displayName: "",
        email: "",
        password: "",
        phone: "",
    })

    useEffect(() => {
        setSelectedUser(null)
        setStartDate(null)
        setElectricityNumber("")
        setPhoneInput("")
    }, [open])

    const filteredUsers = useMemo(() => {
        if (phoneInput.length !== 10) return []
        return users.filter(user =>
            user.phone && user.phone.includes(phoneInput)
        )
    }, [phoneInput, users])

    const handleAddUser = async () => {
        if (!selectedUser || !startDate) {
            alert("Vui lòng điền đầy đủ thông tin")
            return
        }

        const updateData = {
            tenantId: selectedUser._id,
            startAt: startDate ? format(startDate, "yyyy-MM-dd") : "",
            endAt: endDate ? format(endDate, "yyyy-MM-dd") : "",
            contract: null
        }
        await updateOrderAPIs(order._id, updateData).then(() => {
            toast.success("Thêm người dùng thuê trọ thanh cong")
            setOpen(false)
            fetchData()
        }).catch((error) => {
            toast.error(error.response.data.message)
            fetchData()
        })

    }

    const handleCreateAccount = async () => {
        const { displayName, email, password, phone } = newUserData
        if (!displayName || !email || !password || !phone || !startDate) {
            alert("Vui lòng nhập đầy đủ thông tin")
            return
        }

        try {
            const res = await createTenantAndAssignAPI({
                displayName,
                email,
                password,
                phone,
                orderId: order._id,
                startAt: startDate ? format(startDate, "yyyy-MM-dd") : "",
                endAt: endDate ? format(endDate, "yyyy-MM-dd") : "",
            })

            toast.success("Tạo tài khoản và gán phòng thành công")
            setOpen(false)
            fetchData()
        } catch (err) {
            console.error(err)
            toast.error("Tạo tài khoản thất bại")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl w-[90%] max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl">
                <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" /> Cho người dùng thuê trọ
                </DialogTitle>
                <div className="flex gap-3 mb-4">
                    <Button
                        variant={mode === "add" ? "default" : "outline"}
                        onClick={() => setMode("add")}
                    >
                        ➕ Chọn người dùng có sẵn
                    </Button>
                    <Button
                        variant={mode === "create" ? "default" : "outline"}
                        onClick={() => setMode("create")}
                    >
                        ✍️ Tạo tài khoản mới
                    </Button>
                </div>
                {mode === "add" && (
                    <DialogDescription className="space-y-5 mt-4">
                        {!selectedUser ? <div>
                            <label className="font-medium flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-500" />
                                Nhập số điện thoại
                            </label>
                            <Input
                                placeholder="Nhập số điện thoại người dùng..."
                                value={phoneInput}
                                maxLength={10}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '') // chỉ cho phép số
                                    setPhoneInput(value)
                                }}
                                className="mt-2"
                            />
                        </div> :
                            <div className="background-blue-50 border text-black border-blue-200 rounded-lg p-3 flex items-center gap-2">
                                Phòng  {order.room.roomId}
                            </div>

                        }

                        {filteredUsers.length > 0 && (
                            <div className="border rounded-lg p-3 max-h-60 overflow-y-auto space-y-2 bg-white shadow-sm">
                                {filteredUsers.map((user) => (
                                    <div
                                        key={user._id}
                                        className="cursor-pointer hover:bg-blue-50 border border-transparent hover:border-blue-400 p-3 rounded-lg transition"
                                        onClick={() => {
                                            setSelectedUser(user)
                                            setPhoneInput("")
                                        }}
                                    >
                                        <div className="font-semibold">{user.displayName}</div>
                                        <div className="text-sm text-gray-500">{user.phone}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {selectedUser && (
                            <>
                                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-sm space-y-2">
                                    <div className="flex items-center gap-2 text-blue-700 font-semibold">
                                        <CheckCircle2 className="w-5 h-5" />
                                        Người dùng đã chọn
                                    </div>
                                    <div><strong>Tên:</strong> {selectedUser.displayName}</div>
                                    <div><strong>Email:</strong> {selectedUser.email}</div>
                                    <div><strong>SĐT:</strong> {selectedUser.phone}</div>
                                </div>

                                <div className="flex items-center gap-3 mt-4">
                                    <label className="w-1/3 flex items-center gap-2 font-medium">
                                        <CalendarCheck className="w-4 h-4 text-gray-600" />
                                        Ngày bắt đầu:
                                    </label>
                                    <DatePicker
                                        selected={startDate}
                                        onChange={(date) => setStartDate(date)}
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText="dd/mm/yyyy"
                                        className="w-2/3 px-3 py-2 border rounded-md"
                                    />
                                </div>

                                <div className="flex items-center gap-3 mt-4">
                                    <label className="w-1/3 flex items-center gap-2 font-medium">
                                        <CalendarCheck className="w-4 h-4 text-gray-600" />
                                        Ngày kết thúc:
                                    </label>
                                    <DatePicker
                                        selected={endDate}
                                        onChange={(date) => setEndDate(date)}
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText="dd/mm/yyyy"
                                        className="w-2/3 px-3 py-2 border rounded-md"
                                    />
                                </div>


                                <div className="flex justify-end">
                                    <Button
                                        onClick={handleAddUser}
                                        className="mt-4 bg-gradient-to-br from-blue-500 to-blue-700 text-white font-semibold hover:opacity-90 rounded-xl px-6 py-2"
                                    >
                                        ➕ Thêm
                                    </Button>
                                </div>
                            </>
                        )}
                    </DialogDescription>)}
                {mode === "create" && (
                    <>
                        <div className="space-y-3">
                            <div>
                                <label className="font-medium">Tên hiển thị</label>
                                <Input
                                    value={newUserData.displayName}
                                    onChange={(e) => setNewUserData({ ...newUserData, displayName: e.target.value })}
                                    placeholder="Tên người dùng"
                                />
                            </div>

                            <div>
                                <label className="font-medium">Email</label>
                                <Input
                                    value={newUserData.email}
                                    onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                                    placeholder="Email"
                                />
                            </div>

                            <div>
                                <label className="font-medium">Mật khẩu</label>
                                <Input
                                    type="password"
                                    value={newUserData.password}
                                    onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                                    placeholder="Mật khẩu"
                                />
                            </div>

                            <div>
                                <label className="font-medium">SĐT</label>
                                <Input
                                    value={newUserData.phone}
                                    onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                                    placeholder="Số điện thoại"
                                />
                            </div>

                            {/* Chọn ngày bắt đầu */}
                            <div className="flex items-center gap-3 mt-4">
                                <label className="w-1/3 flex items-center gap-2 font-medium">
                                    <CalendarCheck className="w-4 h-4 text-gray-600" />
                                    Ngày bắt đầu:
                                </label>
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="dd/mm/yyyy"
                                    className="w-2/3 px-3 py-2 border rounded-md"
                                />
                            </div>

                            {/* Chọn ngày kết thúc */}
                            <div className="flex items-center gap-3 mt-4">
                                <label className="w-1/3 flex items-center gap-2 font-medium">
                                    <CalendarCheck className="w-4 h-4 text-gray-600" />
                                    Ngày kết thúc:
                                </label>
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="dd/mm/yyyy"
                                    className="w-2/3 px-3 py-2 border rounded-md"
                                />
                            </div>

                            <div className="mt-4 flex justify-end">
                                <Button
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl"
                                    onClick={handleCreateAccount}
                                >
                                    Tạo tài khoản và gán phòng
                                </Button>
                            </div>
                        </div>
                    </>
                )}

            </DialogContent>
        </Dialog>
    )
}
