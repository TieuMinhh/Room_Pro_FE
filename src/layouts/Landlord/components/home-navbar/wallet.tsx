import React, { useEffect, useState } from 'react'
import { Wallet2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { fetchWallet } from '@/apis/wallet.apis';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/slice/userSlice';
import { USER_ROLE } from '@/utils/contanst';

export const Wallet = () => {
    const [balance, setBalance] = useState(0);
    const navigate = useNavigate();
    const currentUser = useSelector(selectCurrentUser);
    const handleClick = () => {
        if (currentUser?.role === USER_ROLE.OWNER) {
            navigate('/landlord/transactions');
        } else if (currentUser?.role === USER_ROLE.TENANT) {
            navigate('/transactions');
        }
    };
    useEffect(() => {
        fetchWallet().then(res => {
            setBalance(res.data.balance || 0)
        })
    }, [])
    return (
        <Card className="w-fit px-4 py-2  rounded-2xl bg-white hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={handleClick}>
            <CardContent className="flex items-center gap-3 p-0">
                <Wallet2 className="w-5 h-5 text-primary" />
                <div className="text-sm text-gray-700 font-medium">Số dư:</div>
                <div className="text-sm font-semibold text-green-600">{balance.toLocaleString()} VND</div>
            </CardContent>
        </Card>
    )
}
