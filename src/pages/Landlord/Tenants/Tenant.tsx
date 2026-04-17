import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/UserAvatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { CirclePlusIcon, Eye, EyeIcon } from "lucide-react";
import { fetchTenants } from "@/apis";
import Swal from "sweetalert2";
import { DialogView } from "./components/DialogView";

type User = {
    _id: string;
    userName: string;
    displayName?: string;
    avatar?: string;
    phone?: string;
    email?: string;
    rentalInfo?: {
        roomId: string;
        roomName?: string;
        startAt: string;
        endAt: string;
        depositPaid: boolean;
        billStatus: 'paid' | 'unpaid' | 'no_bill';
    };
};



const PAGE_SIZE = 5;

export default function Tenant() {
    const [tenants, setTenants] = useState([]);
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);
    const totalPages = Math.ceil(tenants.length / PAGE_SIZE);
    const [activeUser, setActiveUser] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [search, setSearch] = useState("");

    const filteredTenants = tenants.filter(
        (user: any) => (user.displayName || user.userName)?.toLowerCase().includes(search.toLowerCase())
    );
    const paginatedData = filteredTenants.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        await fetchTenants().then((res) => {
            setTenants(res.data);
        })
    }

    useEffect(() => {
        setPage(1);
    }, [search]);

    return (
        <Card className="p-4 space-y-4">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-blue-700 tracking-tight">Người thuê trọ</h1>
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-full sm:w-64 bg-white shadow"
                />
            </div>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto rounded-lg border bg-gradient-to-br from-blue-50 to-white shadow-lg">
                <Table className="min-w-[700px] bg-white rounded-lg">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10">#</TableHead>
                            <TableHead>Ảnh</TableHead>
                            <TableHead>Tên</TableHead>
                            <TableHead>SĐT</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Chức năng</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-gray-400">Không có người thuê phù hợp.</TableCell>
                            </TableRow>
                        ) : (
                            paginatedData.map((user: User, idx) => (
                                <TableRow key={user._id} className="hover:bg-gray-50 transition">
                                    <TableCell>{(page - 1) * PAGE_SIZE + idx + 1}</TableCell>
                                    <TableCell>
                                        <UserAvatar src={user.avatar} alt={user.userName} size={32} />
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-semibold text-gray-800">{user.displayName || user.userName}</span>
                                    </TableCell>
                                    <TableCell>{user.phone || <span className="text-gray-400">Chưa cập nhật</span>}</TableCell>
                                    <TableCell>{user.email || <span className="text-gray-400">Chưa cập nhật</span>}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="outline" className="rounded-full px-4 py-1 text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => {
                                                setActiveUser(user);
                                                setOpenDialog(true);
                                            }}>
                                                Xem
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                    <p className="text-sm text-gray-600">
                        Trang <strong className="text-blue-600">{page}</strong> / <span className="font-semibold">{totalPages}</span>
                    </p>
                    <div className="flex gap-2">
                        <Button variant="outline" className="rounded-full px-4 py-1" onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
                            Trước
                        </Button>
                        <Button variant="outline" className="rounded-full px-4 py-1" onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
                            Sau
                        </Button>
                    </div>
                </div>
            )}
            <DialogView open={openDialog} setOpen={setOpenDialog} user={activeUser} />
        </Card>
    );
}
