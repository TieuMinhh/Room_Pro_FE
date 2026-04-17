import axiosCustomize from "@/service/axios.customize";

export const createContactApis = async (data: any) => {
    return await axiosCustomize.post('api/v1/contracts', data);
};

export const getContractsByTenantId = async () => {
    return await axiosCustomize.get(`api/v1/contracts`);
};

export const uploadContractAPIs = async (id: string, data: any) => {
    return await axiosCustomize.put(`api/v1/contracts/${id}`, data);
};

export const updateContractAPIs = async (id: string, data: any) => {
    return await axiosCustomize.put(`api/v1/contracts/${id}`, data);
};
