import { deleteOrderAndSaveAPIs, deleteOrderAPIs, fetchOrders } from '@/apis/order.apis'
import { fetchTenantAPIs } from '@/apis/tenant.apis'
import Loader from '@/components/ui-customize/Loader'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import dayjs from "dayjs"
import { CirclePlusIcon, ClipboardPenLineIcon, EyeIcon, Trash2, UserPlus2Icon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import AddUserDialog from './components/DialogAdd'
import { getDepartmentsByOwner } from '@/apis/departmentApi'
import { DialogExtension } from './components/DialogExtension'
import { toast } from 'react-toastify'

export const OrderRooms = () => {
    const navigate = useNavigate()
    const [orders, setOrders] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [page, setPage] = useState(1)
    const [open, setOpen] = useState(false)
    const [activeOrder, setActiveOrder] = useState(null)
    const [orderId, setOrderId] = useState(null)
    const [openAddUser, setOpenAddUser] = useState(false)
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [openConfirm, setOpenConfirm] = useState(false)
    const [openExtension, setOpenExtension] = useState(false)

    const [departments, setDepartments] = useState<any[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState("");

    useEffect(() => {
        fetchData()
    }, [])
    const fetchData = async () => {
        setLoading(true)
        const orders = await fetchOrders();
        const tenant = await fetchTenantAPIs();
        const department = await getDepartmentsByOwner();
        setOrders(orders.data);
        setUsers(tenant.data);
        setDepartments(department.data);
        setLoading(false)
    };

    const handleDelete = async (data: any) => {
        Swal.fire({
            title: `Bạn có muốn xóa người thuê ra khỏi phòng ${data.room.roomId}?`,
            text: data.contract
                ? "Phòng này đã tạo hợp đồng. Nếu xóa trước khi hết hạn có thể phải đền bù hợp đồng!"
                : "Hành động này không thể phục hồi!",
            icon: "warning",
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonColor: "#d33", // Màu đỏ cho "Xóa"
            denyButtonColor: "#f39c12", // Màu vàng cho "Xóa và lưu lịch sử"
            cancelButtonColor: "#3085d6", // Màu xanh cho "Hủy"
            confirmButtonText: "Xóa",
            denyButtonText: "Xóa & lưu lịch sử",
            cancelButtonText: "Hủy",
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteOrderAPIs(data._id).then(() => {
                    toast.success("Xóa người thuê thành công");
                    fetchData();
                })
            } else if (result.isDenied) {
                await deleteOrderAndSaveAPIs(data._id).then(() => {
                    toast.success("Xóa người thuê thành công");
                    fetchData();
                })
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // Người dùng nhấn Hủy
                console.log("Đã hủy");
            }
        });
    };

    // Helper function to render contract status beautifully
    const renderContractStatus = (tenant: any) => {
        if (tenant?.contract?.status === "pending_signature" && tenant?.contract?.paid) {
            return <span className="px-2 py-1 rounded text-blue-700 bg-blue-100 border border-blue-300 font-medium">Đã thanh toán(chưa ký)</span>;
        }
        if (tenant?.contract?.status === "pending_signature") {
            return <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700 font-medium">Đang đợi phản hồi của người thuê</span>;
        }
        if (tenant?.contract?.status === "pending_review") {
            return <span className="px-2 py-1 rounded text-green-700 bg-green-100 border border-green-300 font-medium"> Đã thanh toán</span>;
        }
        if (tenant?.contract?.status === "rejected") {
            return <span className="px-2 py-1 rounded bg-red-100 text-red-700 font-medium">Bị từ chối</span>;
        }
        if (tenant?.tenants) {
            return <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 font-medium">Chưa tạo hợp đồng</span>;
        }
        return "";
    }

    // Lọc orders theo department và search
    const filteredOrders = orders
        .filter((o: any) =>
            !selectedDepartment || o.room.departmentId === selectedDepartment
        )
        .filter((o: any) => {
            if (!searchTerm.trim()) return true;
            const roomId = o?.room?.roomId?.toLowerCase() || "";
            const tenantNames = (o?.tenants || []).map((t: any) => t.displayName?.toLowerCase() || "").join(" ");
            const search = searchTerm.toLowerCase();
            return roomId.includes(search) || tenantNames.includes(search);
        });


    if (loading) return <Loader />
    return (
        <div className="p-2 md:p-6 max-w-7xl mx-auto">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 md:p-6 mb-6 flex flex-col md:flex-row md:items-center md:gap-6 gap-4">
                <div className="flex-1 flex flex-col md:flex-row gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Chọn tòa nhà</label>
                        <select
                            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 min-w-[160px]"
                            value={selectedDepartment}
                            onChange={e => setSelectedDepartment(e.target.value)}
                        >
                            <option value="">Tất cả tòa</option>
                            {departments.map((d: any) => (
                                <option key={d._id} value={d._id}>{d.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
                        <input
                            type="text"
                            placeholder="Tên người thuê hoặc ID phòng..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value)
                                setPage(1)
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-md bg-white">
                <Table className="min-w-[900px]">
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead className="font-semibold text-gray-700">ID phòng</TableHead>
                            <TableHead className="font-semibold text-gray-700">Người thuê</TableHead>
                            <TableHead className="font-semibold text-gray-700">Ngày bắt đầu</TableHead>
                            <TableHead className="font-semibold text-gray-700">Thời hạn</TableHead>
                            <TableHead className="font-semibold text-gray-700">Tiền cọc</TableHead>
                            <TableHead className="font-semibold text-gray-700">Hợp đồng</TableHead>
                            <TableHead className="font-semibold text-gray-700">Trạng thái</TableHead>
                            <TableHead className="text-right font-semibold text-gray-700">Chức năng</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredOrders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-gray-400">Không có dữ liệu phù hợp</TableCell>
                            </TableRow>
                        ) : filteredOrders.map((tenant: any) => (
                            <TableRow key={tenant._id} className="hover:bg-blue-50 transition">
                                <TableCell>
                                    <span className="font-bold text-blue-700 text-base">{tenant?.room?.roomId}</span>
                                </TableCell>
                                <TableCell>
                                    <ul>
                                        {tenant?.tenants?.map((t: any) => (
                                            <li key={t._id} className='mb-2 text-gray-800 font-medium'>
                                                {t?.displayName}
                                            </li>
                                        ))}
                                    </ul>
                                </TableCell>
                                <TableCell>{tenant?.startAt ? dayjs(tenant?.startAt).format('DD/MM/YYYY') : ""}</TableCell>
                                <TableCell>{tenant?.startAt ? dayjs(tenant?.endAt).format('DD/MM/YYYY') : ""}</TableCell>
                                <TableCell>
                                    <span className=" text-base">{tenant?.contract?.deposit.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>
                                </TableCell>
                                <TableCell>{tenant?.tenants ?
                                    <Tooltip >
                                        <TooltipTrigger>
                                            <Button variant="outline" size="icon" onClick={() => navigate(`/landlord/contract?orderId=${tenant._id}`)}>
                                                <ClipboardPenLineIcon className="w-4 h-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            hợp đồng
                                        </TooltipContent>
                                    </Tooltip> : ""
                                }</TableCell>
                                <TableCell>{renderContractStatus(tenant)}</TableCell>
                                <TableCell className="text-right space-x-2">
                                    {tenant.tenants && <Button variant={"destructive"} size="icon" onClick={() => handleDelete(tenant)}>
                                        <Tooltip >
                                            <TooltipTrigger>
                                                <Button variant="destructive" size="icon" >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                Xóa người thuê
                                            </TooltipContent>
                                        </Tooltip>
                                    </Button>}
                                    <Tooltip >
                                        <TooltipTrigger>
                                            <Button variant="outline" size="icon" onClick={() => {
                                                navigate(`/order-room/history/${tenant._id}`)
                                            }}>
                                                <EyeIcon className="w-4 h-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Xem lịch sử thuê trọ
                                        </TooltipContent>
                                    </Tooltip>
                                    {tenant.tenants && tenant.tenants.length > 0
                                        ?
                                        <Button variant="outline" size="icon" onClick={() => {
                                            setActiveOrder(tenant);
                                            setOpenExtension(true)
                                        }}>
                                            <Tooltip >
                                                <TooltipTrigger>
                                                    <Button variant="outline" size="icon" onClick={() => {
                                                        setActiveOrder(tenant);
                                                        setOpenExtension(true)
                                                    }}>
                                                        <CirclePlusIcon className="w-4 h-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Gia hạn phòng
                                                </TooltipContent>
                                            </Tooltip>
                                        </Button>
                                        :
                                        <Button variant="outline" size="icon" onClick={() => {
                                            setActiveOrder(tenant);
                                            setOpenAddUser(true)
                                        }}>
                                            <Tooltip >
                                                <TooltipTrigger>
                                                    <Button variant="outline" size="icon" onClick={() => {
                                                        setActiveOrder(tenant);
                                                        setOpenAddUser(true)
                                                    }}>
                                                        <UserPlus2Icon className="w-4 h-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Cho thuê phòng
                                                </TooltipContent>
                                            </Tooltip>
                                        </Button>}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {openAddUser && <AddUserDialog open={openAddUser} setOpen={setOpenAddUser} order={activeOrder} users={users} fetchData={fetchData} />}
            {openExtension && <DialogExtension open={openExtension} setOpen={setOpenExtension} order={activeOrder} fetchData={fetchData} />}
        </div>
    )
}
