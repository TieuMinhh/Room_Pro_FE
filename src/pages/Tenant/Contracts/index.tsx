import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { BadgeDollarSignIcon, Download, Edit, EyeIcon, Trash2 } from "lucide-react";
import { getContractsByTenantId, updateContractAPIs } from '@/apis/contract.apis';
import Loader from '@/components/ui-customize/Loader';
import React, { useEffect, useState } from 'react'
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { fetchOrderByContractIdAPIs } from "@/apis/order.apis";
import { createPaymentContract } from "@/apis/payment.apis";

export const Contracts = () => {
    const [loading, setLoading] = useState(false);
    const [contracts, setContracts] = useState([]);
    useEffect(() => { fetchData() }, [])
    const navigate = useNavigate();

    const fetchData = async () => {
        setLoading(true)
        await getContractsByTenantId().then((res) => {
            setContracts(res.data);
            setLoading(false);
        })
    }

    const handlePayment = async (contract: any) => {
        const res = await fetchOrderByContractIdAPIs(contract._id);
        const order = res.data;

        const data = {
            amount: order?.contract?.deposit,
            _id: order?._id
        }
        await createPaymentContract(data).then((res) => {
            window.location.href = res.data;
        });
    }

    const handleReject = async (contract: any) => {
        await updateContractAPIs(contract._id, { status: 'rejected' })
            .then(() => {
                fetchData();
            })
    }
    if (loading) return <Loader />
    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                    Danh sách hợp đồng
                </h2>
                <div className="overflow-auto rounded-xl">
                    <Table className="min-w-full text-sm">
                        <TableHeader>
                            <TableRow className="bg-muted">
                                <TableHead className="font-semibold text-gray-700">Mã Phòng</TableHead>
                                <TableHead className="font-semibold text-gray-700">Chủ Phòng</TableHead>
                                <TableHead className="font-semibold text-gray-700">Tiền cọc </TableHead>
                                <TableHead className="font-semibold text-gray-700">Hợp Đồng</TableHead>
                                <TableHead className="font-semibold text-gray-700">Trạng thái </TableHead>
                                <TableHead className="font-semibold text-gray-700">Chức Năng</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {contracts?.map((contract, index) => (
                                <TableRow
                                    key={index}
                                    className="hover:bg-muted/70 transition-colors border-b last:border-none"
                                >
                                    <TableCell className="py-4 font-semibold text-primary">{contract.room?.roomId}</TableCell>
                                    <TableCell className="flex items-center gap-2 py-4">

                                        <span>{contract.owner.displayName}</span>
                                    </TableCell>

                                    <TableCell className="py-4 font-semibold text-green-600">{contract?.deposit?.toLocaleString()} VND</TableCell>
                                    <TableCell className="py-4">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <a
                                                    href={contract.contractURI}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="hover:text-blue-600"
                                                    >
                                                        {contract.status === "pending_signature" ? <EyeIcon className="h-5 w-5" /> : <Download className="h-5 w-5" />}
                                                    </Button>
                                                </a>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Tải hợp đồng</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell className="py-4">
                                        <span
                                            className={cn(
                                                "font-semibold px-3 py-1 rounded-full text-xs shadow",
                                                contract.status === "pending_signature" && !contract.paid && "text-yellow-700 bg-yellow-100 border border-yellow-300",
                                                contract.status === "pending_signature" && contract.paid && "text-blue-700 bg-blue-100 border border-blue-300",
                                                contract.status === "pending_review" && "text-green-700 bg-green-100 border border-green-300",
                                                contract.status === "rejected" && "text-red-700 bg-red-100 border border-red-300"
                                            )}
                                        >
                                            {contract.status === "pending_signature"
                                                ? <>
                                                    {contract.paid ? "Đã thanh toán - chưa ký" : "Chưa giải quyết"}
                                                </>
                                                : contract.status === "pending_review"
                                                    ? "Đã thanh toán"
                                                    : "Đã từ chối"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="flex gap-2 py-4 justify-end">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    className="rounded-full border-blue-400 hover:bg-blue-100 transition"
                                                    onClick={() => { navigate(`/contract-detail/${contract._id}`) }}
                                                >
                                                    <EyeIcon className="h-4 w-4 text-blue-600" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Xem chi tiết</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        {contract.paid && <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span>
                                                    {contract.status === "pending_signature" && (
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            className="rounded-full border-primary/40 hover:bg-primary/20 transition"
                                                            onClick={() => { navigate(`/contract-detail/${contract._id}`) }}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Ký hợp đồng</p>
                                            </TooltipContent>
                                        </Tooltip>}
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span>
                                                    {!contract.paid && contract.status === 'pending_signature' && (
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                            className="rounded-full border-green-400 hover:bg-green-100 transition"
                                                            onClick={() => handlePayment(contract)}
                                                        >
                                                            <BadgeDollarSignIcon className="h-4 w-4 text-green-600" />
                                                        </Button>
                                                    )}
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Thanh toán</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        {/* Nút từ chối */}
                                        {contract.status === 'pending_signature' && !contract.paid && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        size="icon"
                                                        variant="outline"
                                                        className="rounded-full border-red-400 hover:bg-red-100 transition"
                                                        onClick={() => handleReject(contract)}
                                                    >
                                                        {/* Bạn có thể dùng icon X hoặc chữ */}
                                                        <span className="text-red-600 font-bold">✕</span>
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Từ chối</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        )}
                                        {contract.status == 'rejected' && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        size="icon"
                                                        variant="destructive"
                                                        className="rounded-full hover:bg-red-600 hover:text-white transition"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Xóa hợp đồng</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    )
}
