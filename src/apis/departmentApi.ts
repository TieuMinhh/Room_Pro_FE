import axiosCustomize from "@/service/axios.customize"

export const getDepartmentsByOwner = () => {
  return axiosCustomize.get(`/api/v1/departments`)
}

export const getDepartmentById = (id: string) => {
  return axiosCustomize.get(`/api/v1/departments/${id}`);
};

export const updateDepartment = (id: string, updatedData: any) => {
  return axiosCustomize.put(`/api/v1/departments/${id}`, updatedData)
}

export const deleteDepartment = (id: string) => {
  return axiosCustomize.delete(`/api/v1/departments/${id}`)
}

export const createDepartment = ( data: any) => {
  return axiosCustomize.post(`/api/v1/departments`, data)
}

export const getRoomsByDepartment = (departmentId : string) => {
  return axiosCustomize.get(`/api/v1/departments/${departmentId}/rooms`)
}