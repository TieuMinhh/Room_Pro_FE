
import { getDepartmentsByOwner } from '@/apis/departmentApi';
import { createIncidentalCostAPIs, deleteIncidentalCostAPIs, getAllIncidentalCosts, updateIncidentalCostAPIs } from '@/apis/incidentalCosts.apis';
import { getAllRooms } from '@/apis/roomApi';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Pencil, Trash2 } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { NumericFormat } from 'react-number-format';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

interface IncidentalCost {
    _id: string;
    roomId: {
        _id: string;
        roomId: string;
        departmentId: string;
        images: string[];
    };
    tenantId: any;
    ownerId: any;
    description: string;
    whoPaid: 'Landlord' | 'Tenant';
    amount: number;
    isPaid: boolean;
    createdAt: string;
}

interface Department {
    _id: string;
    name: string;
    electricPrice: number;
    waterPrice: number;
    province: string;
    district: string;
    ward: string;
}

export const IncidentalCosts = () => {

    const [costs, setCosts] = useState<IncidentalCost[]>([]);
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, reset, setValue, watch } = useForm();
    const [open, setOpen] = useState(false);
    const [rooms, setRooms] = useState<any[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [editOpen, setEditOpen] = useState(false);
    const [editData, setEditData] = useState<IncidentalCost | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const tabParam = searchParams.get('tab');
    // "all" là tab tổng hợp
    const [currentTab, setCurrentTab] = useState<string | undefined>(tabParam || 'all');

    useEffect(() => {
        fetchData();
    }, []);

    // Khi departments load xong, nếu chưa có tab thì set tab đầu tiên
    useEffect(() => {
        if (departments.length > 0) {
            // Nếu currentTab không hợp lệ thì về "all"
            if (!currentTab || (currentTab !== 'all' && !departments.some(d => d._id === currentTab))) {
                setCurrentTab('all');
                setSearchParams({ tab: 'all' });
            }
        }
    }, [departments]);

    // Khi tabParam trên url thay đổi thì cập nhật tab
    useEffect(() => {
        if (tabParam && tabParam !== currentTab) {
            setCurrentTab(tabParam);
        }
    }, [tabParam]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getAllIncidentalCosts();
            setCosts(res.data || []);
            const roomRes = await getAllRooms();
            setRooms(roomRes.data || []);
            const departmentRes = await getDepartmentsByOwner();
            setDepartments(departmentRes.data || []);

        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (cost: IncidentalCost) => {
        Swal.fire({
            title: 'Xác nhận xóa',
            text: `Bạn có chắc muốn xóa phí phát sinh "${cost.description}" không?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await deleteIncidentalCostAPIs(cost._id).
                    then(() => {
                        toast.success('Xóa phí phát sinh thành công');
                        fetchData();
                    })
            }
        })
    }


    const onSubmit = async (data: any) => {
        await createIncidentalCostAPIs(data);
        setOpen(false);
        reset();
        fetchData();
    };

    // Update dialog form state
    const [editForm, setEditForm] = useState({
        roomId: '',
        whoPaid: '',
        amount: '',
        description: '',
        isPaid: false,
    });

    const openEditDialog = (cost: IncidentalCost) => {
        setEditData(cost);
        setEditForm({
            roomId: cost.roomId?._id || '',
            whoPaid: cost.whoPaid,
            amount: cost.amount.toString(),
            description: cost.description,
            isPaid: cost.isPaid,
        });
        setEditOpen(true);
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editData) return;
        await updateIncidentalCostAPIs(editData._id, {
            ...editForm,
            amount: Number(editForm.amount),
        });
        toast.success('Cập nhật thành công!');
        setEditOpen(false);
        setEditData(null);
        fetchData();
    };

    return (
        <div className="container mx-auto p-4">
            <TooltipProvider>
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold">Danh sách phí phát sinh</h2>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button variant="default">Thêm phí phát sinh</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg w-full">
                            <DialogHeader>
                                <DialogTitle>Thêm phí phát sinh</DialogTitle>
                                <DialogDescription>Nhập thông tin phí phát sinh mới</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div>
                                    <Label>Phòng</Label>
                                    <Select onValueChange={val => setValue('roomId', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn phòng" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {rooms.map(room => (
                                                <SelectItem key={room._id} value={room._id}>{room.roomId}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Người chi trả</Label>
                                    <Select onValueChange={val => setValue('whoPaid', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn người chi trả" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Landlord">Chủ phòng</SelectItem>
                                            <SelectItem value="Tenant">Người thuê</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Số tiền</Label>
                                    <NumericFormat
                                        customInput={Input}
                                        thousandSeparator="."
                                        decimalSeparator=","
                                        allowNegative={false}
                                        placeholder="Nhập số tiền"
                                        {...register('amount', { required: true, setValueAs: v => v ? Number((v + '').replaceAll('.', '')) : undefined })}
                                        onValueChange={(values) => {
                                            setValue('amount', values.value ? Number(values.value) : undefined);
                                        }}
                                    />
                                </div>
                                <div>
                                    <Label>Mô tả</Label>
                                    <Textarea {...register('description', { required: true })} placeholder="Nhập mô tả" />
                                </div>
                                <DialogFooter>
                                    <Button type="submit">Thêm</Button>
                                    <DialogClose asChild>
                                        <Button type="button" variant="secondary">Hủy</Button>
                                    </DialogClose>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
                <Tabs value={currentTab} onValueChange={val => {
                    setCurrentTab(val);
                    setSearchParams({ tab: val });
                }} className="w-full">
                    <TabsList className="mb-4">
                        <TabsTrigger value="all" key="all">Tất cả</TabsTrigger>
                        {departments.map((department) => (
                            <TabsTrigger value={department._id} key={department._id}>
                                {department.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {/* Tab tất cả */}
                    <TabsContent value="all" key="all">
                        <div className="overflow-x-auto rounded-lg shadow bg-white dark:bg-background">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableCell>Phòng</TableCell>
                                        <TableCell>Người thuê</TableCell>
                                        <TableCell>Mô tả</TableCell>
                                        <TableCell>Người chi trả</TableCell>
                                        <TableCell>Số tiền</TableCell>
                                        <TableCell>Trạng thái</TableCell>
                                        <TableCell>Ngày tạo</TableCell>
                                        <TableCell>Chức năng </TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow><TableCell colSpan={8}>Đang tải...</TableCell></TableRow>
                                    ) : costs.length === 0 ? (
                                        <TableRow><TableCell colSpan={8}>Không có dữ liệu</TableCell></TableRow>
                                    ) : (
                                        costs.map(cost => (
                                            <TableRow key={cost._id}>
                                                <TableCell><div className='font-semibold'>{cost.roomId?.roomId || '-'}</div></TableCell>
                                                <TableCell>{cost.tenantId?.displayName || '-'}</TableCell>
                                                <TableCell>{cost.description}</TableCell>
                                                <TableCell>{cost.whoPaid === 'Landlord' ? 'Chủ phòng' : 'Người thuê'}</TableCell>
                                                <TableCell>{cost.amount.toLocaleString()}đ</TableCell>
                                                <TableCell>
                                                    {cost.isPaid ? (
                                                        <span className="text-green-600 font-semibold">Đã thanh toán</span>
                                                    ) : (
                                                        <span className="text-red-600 font-semibold">Chưa thanh toán</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>{new Date(cost.createdAt).toLocaleDateString()}</TableCell>
                                                <TableCell className="flex gap-2 justify-center">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button size="icon" variant="ghost" onClick={() => openEditDialog(cost)}>
                                                                <Pencil className="w-4 h-4 text-blue-600" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Chỉnh sửa</TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button size="icon" variant="ghost" onClick={() => handleDelete(cost)}>
                                                                <Trash2 className="w-4 h-4 text-red-600" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Xóa</TooltipContent>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>
                    {/* Tab từng tòa */}

                </Tabs>
            </TooltipProvider>
            {/* Dialog cập nhật phí phát sinh */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="max-w-lg w-full">
                    <DialogHeader>
                        <DialogTitle>Cập nhật phí phát sinh</DialogTitle>
                        <DialogDescription>Chỉnh sửa thông tin phí phát sinh</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div>
                            <Label>Phòng</Label>
                            <select
                                name="roomId"
                                value={editForm.roomId}
                                onChange={handleEditChange}
                                className="w-full border rounded px-2 py-1 mt-1"
                                required
                            >
                                <option value="">Chọn phòng</option>
                                {rooms.map(room => (
                                    <option key={room._id} value={room._id}>{room.roomId}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label>Người chi trả</Label>
                            <select
                                name="whoPaid"
                                value={editForm.whoPaid}
                                onChange={handleEditChange}
                                className="w-full border rounded px-2 py-1 mt-1"
                                required
                            >
                                <option value="">Chọn người chi trả</option>
                                <option value="Landlord">Chủ phòng</option>
                                <option value="Tenant">Người thuê</option>
                            </select>
                        </div>
                        <div>
                            <Label>Số tiền</Label>
                            <Input
                                name="amount"
                                value={editForm.amount}
                                onChange={handleEditChange}
                                placeholder="Nhập số tiền"
                                type="number"
                                min={0}
                                required
                            />
                        </div>
                        <div>
                            <Label>Mô tả</Label>
                            <Textarea
                                name="description"
                                value={editForm.description}
                                onChange={handleEditChange}
                                placeholder="Nhập mô tả"
                                required
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                id="isPaid"
                                name="isPaid"
                                type="checkbox"
                                checked={editForm.isPaid}
                                onChange={handleEditChange}
                            />
                            <Label htmlFor="isPaid">Đã thanh toán</Label>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Cập nhật</Button>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary" onClick={() => setEditOpen(false)}>Hủy</Button>
                            </DialogClose>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>

    );
}
