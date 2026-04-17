import axiosCustomize from "@/service/axios.customize"

export const createRoom = (data: any) => {
    return axiosCustomize.post(`/api/v1/rooms`, data)
}

export const getAllRooms = () => {
    return axiosCustomize.get(`/api/v1/rooms`)
}

export const getRoomById = (id: string) => {
    return axiosCustomize.get(`/api/v1/rooms/${id}`)
}

export const updateRoom = (id: string, data: any) => {
    return axiosCustomize.put(`/api/v1/rooms/${id}`, data)
}

export const deleteRoom = (id: string) => {
    return axiosCustomize.delete(`/api/v1/rooms/${id}`)
}