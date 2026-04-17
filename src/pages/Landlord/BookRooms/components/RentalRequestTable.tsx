import ToggleFocusInput from "@/components/Input/ToggleFocusInput"
import { useState } from "react"

interface RentalRequest {
    _id: string
    tenantId: {
        displayName: string,
        phone: string
        _id: string
    }
    roomId: {
        roomId: string
        _id: string
    }
    startDate: string
    endDate: string
    status: "pending" | "approve" | "reject"
    note: string
    reply: string
    createdAt: string
}

interface RentalRequestTableProps {
    requests: RentalRequest[]
    onReply: (id: string, reply: string) => void
    onApprove: (id: string) => void
    onReject: (id: string) => void
    onViewContract: (orderId: string) => void
}

export function RentalRequestTable({
    requests,
    onReply,
    onApprove,
    onReject,
    onViewContract,
}: RentalRequestTableProps) {
    const [editingId, setEditingId] = useState<string | null>(null)
    const [replyText, setReplyText] = useState("")

    const handleReplyClick = (request: RentalRequest) => {
        setEditingId(request._id)
        setReplyText(request.reply)
    }

    const handleReplySubmit = (id: string) => {
        onReply(id, replyText)
        setEditingId(null)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString()
    }


    return (
        <div className="p-6">
            <div className="text-2xl font-bold mb-4">Đơn đặt phòng</div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Người thuê
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                SDT
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Mã phòng
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ngày bắt đầu
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ngày kết thúc
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Trạng thái
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ghi chú
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Trả lời
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Chức năng
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {requests.map((request) => (
                            <tr key={request._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {request.tenantId.displayName}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {request.tenantId.phone}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {request.roomId.roomId}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(request.startDate)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(request.endDate)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        request.status === 'approve' ? 'bg-green-100 text-green-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                        {request.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                    {request.note}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <ToggleFocusInput value={request.reply} onChangedValue={(text) => { onReply(request._id, text) }} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => onReject(request._id)}
                                        disabled={request.status !== 'pending'}
                                        className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white ${request.status !== 'pending' ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                                            }`}
                                    >
                                        Từ chối
                                    </button>
                                    <button
                                        onClick={() => onApprove(request._id)}
                                        disabled={request.status !== 'pending'}
                                        className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white ${request.status !== 'pending' ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                                            }`}
                                    >
                                        Chấp nhận
                                    </button>
                                    <button
                                        onClick={() => onViewContract(request._id)}
                                        disabled={request.status !== 'approve'}
                                        className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white ${request.status !== 'approve' ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                            }`}
                                    >
                                        Hợp đồng
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}