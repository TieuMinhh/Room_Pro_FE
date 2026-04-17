import axiosCustomize from "@/service/axios.customize";

export const fetchTenantAPIs = async () => {
    return await axiosCustomize.get('api/v1/tenants');
};

export const fetchUpdateTenantProfileAPIs = async (data: any) => {
    return await axiosCustomize.put('api/v1/tenants/profile', data);
};
export const deleteTenantAPIs = async (userId: string) => {
    return await axiosCustomize.delete(`api/v1/tenants/${userId}`)
}

export const restoreTenantAPIs = async (userId: string) => {
    return await axiosCustomize.patch(`api/v1/tenants/${userId}`)
}
export const createTenantAndAssignAPI = async (data: any) => {
    return await axiosCustomize.post('api/v1/tenants/create-and-assign', data)
}
