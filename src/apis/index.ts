import axiosCustomize from "@/service/axios.customize"

export const fetchAllUserAPIs = async () => {
    return await axiosCustomize.get('api/v1/admin/all')
}
export const fetchTenants = async () => {
    return await axiosCustomize.get('api/v1/orders/tenants')
}

export const createImageUrl = async (data: any) => {
    return await axiosCustomize.post('api/v1/images/upload', data)
}




