import axiosCustomize from "@/service/axios.customize";

export const createBookRoomAPIs = async (data: any) => {
    return await axiosCustomize.post('api/v1/book-rooms', data);
}

export const fetchBookRoomInTenantAPIs = async () => {
    return await axiosCustomize.get("api/v1/book-rooms?isRole=tenant")
}

export const fetchBookRoomInOwnerAPIs = async () => {
    return await axiosCustomize.get("api/v1/book-rooms?isRole=owner")
}

export const updateBookRoomAPIs = async (id: string, data: any) => {
    return await axiosCustomize.put(`api/v1/book-rooms/${id}`, data);
}