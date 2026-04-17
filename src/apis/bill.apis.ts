import axiosCustomize from "@/service/axios.customize"

export const fetchBillsAPIs = async () => {
    return await axiosCustomize.get('/api/v1/bills')
}

export const createBillAPIs = async (data: any) => {
    return await axiosCustomize.post('/api/v1/bills', data)
}

export const fetchBillByIdAPIs = async (id: string) => {
    return await axiosCustomize.get(`/api/v1/bills/${id}`)
}

export const updateBillAPIs = async (id: string, data: any) => {
    return await axiosCustomize.put(`/api/v1/bills/${id}`, data)
}

export const deleteBillAPIs = async (id: string) => {
    return await axiosCustomize.delete(`/api/v1/bills/${id}`)
}

export const fetchBillsByTenantAPIs = async () => {
    return await axiosCustomize.get('/api/v1/bills/tenant')
}

export const sendMailByIdAPIs = async (id: any) => {
    return await axiosCustomize.post('/api/v1/bills/send-mail?billId=' + id)
}