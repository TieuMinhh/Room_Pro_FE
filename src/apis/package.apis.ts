import axiosCustomize from "@/service/axios.customize";

export const getPackagesAPIs = () => {
  return axiosCustomize.get('/api/v1/packages');
};

export const createPackageAPIs = (data: any) => {
  return axiosCustomize.post('/api/v1/packages', data);
};

export const deletePackageAPIs = (id: string) => {
  return axiosCustomize.delete(`/api/v1/packages/${id}`);
};

export const updatePackageAPIs = (id: string, data: any) => {
  return axiosCustomize.put(`/api/v1/packages/${id}`, data);
};

export const buyPackageAPIs = (id: string) => {
  return axiosCustomize.post(`/api/v1/packages/${id}`);
};