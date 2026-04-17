import axiosCustomize from '../service/axios.customize';

export const getAllIncidentalCosts = async () => {
    return axiosCustomize.get('/api/v1/incidental-costs');
}

export const createIncidentalCostAPIs = async (data: any) => {
    return axiosCustomize.post('/api/v1/incidental-costs', data);
}

export const deleteIncidentalCostAPIs = async (id: string) => {
    return axiosCustomize.delete(`/api/v1/incidental-costs/${id}`);
}

export const updateIncidentalCostAPIs = async (id: string, data: any) => {
    return axiosCustomize.put(`/api/v1/incidental-costs/${id}`, data);
}

export const fetchIncidentalCostByTenant = async () => {
    return axiosCustomize.get('/api/v1/incidental-costs/tenant');
}