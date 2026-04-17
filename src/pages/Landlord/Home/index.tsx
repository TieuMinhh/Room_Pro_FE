import { ChartAreaInteractive } from './components/chart-area-interactive'
import { SectionCards } from './components/section-cards'

import { fetchTenants } from "@/apis"
import { fetchBillsAPIs } from "@/apis/bill.apis"
import { fetchOrders } from "@/apis/order.apis"
import Loader from '@/components/ui-customize/Loader'
import { useEffect, useState } from "react"

export const HomePage = () => {
    const [bills, setBills] = useState([]);
    const [tenants, setTenants] = useState([]);
    const [order, setOrder] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchData = async () => {
            setLoading(true);
            await fetchBillsAPIs().then((response) => {
                setBills(response.data.filter((bill) => bill.status));
            });

            await fetchTenants().then((response) => {
                setTenants(response.data);
            })

            await fetchOrders().then((response) => {
                setOrder(response.data.filter((order) => order.tenants && order.tenants.length > 0 && order.contract?.paid));
            })
            setLoading(false);
        }
        fetchData();
    }, [])
    if (loading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loader />
            </div>
        )
    }
    return (
        <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <SectionCards bills={bills} tenants={tenants} order={order} />
                <div className="px-4 lg:px-6">
                    <ChartAreaInteractive bills={bills} />
                </div>

            </div>
        </div>

    )
}
