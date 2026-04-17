import { fetchBookRoomInOwnerAPIs, updateBookRoomAPIs } from '@/apis/book.room.apis';
import React, { useEffect, useState } from 'react'
import { RentalRequestTable } from './components/RentalRequestTable';
import { useNavigate } from 'react-router-dom';

export const BookRoomManager = () => {
    const [requests, setRequests] = useState<any[]>([])

    const navigate = useNavigate()


    useEffect(() => {
        fetchBookRoomInOwnerAPIs().then(res => {
            setRequests(res.data)
            console.log(res.data)
        })
    }, [])

    const handleReply = async (id: string, reply: string) => {
        console.log("🚀 ~ handleReply ~ id:", id)
        const res = await updateBookRoomAPIs(id, { reply: reply })
        setRequests(requests.map(req =>
            req._id === id ? { ...req, reply } : req
        ))
    }

    const handleApprove = async (id: string) => {
        const res = await updateBookRoomAPIs(id, { status: "approve" })
        setRequests(requests.map(req =>
            req._id === id ? { ...req, status: "approve" } : req
        ))

        navigate(`/landlord/contract?orderId=${res.data._id}`)
    }

    const handleReject = async (id: string) => {
        await updateBookRoomAPIs(id, { status: "reject" })
        setRequests(requests.map(req =>
            req._id === id ? { ...req, status: "reject" } : req
        ))
    }

    const handleViewContract = (orderId: string) => {
        navigate(`/landlord/contract?orderId=${orderId}`)
    }
    return (
        <div className="container mx-auto py-4">
            <RentalRequestTable
                requests={requests}
                onReply={handleReply}
                onApprove={handleApprove}
                onReject={handleReject}
                onViewContract={(id) => {
                    const req = requests.find(r => r._id === id)
                    if (req?.orderId) {
                        handleViewContract(req.orderId)
                    }
                }}
            />
        </div>
    )
}
