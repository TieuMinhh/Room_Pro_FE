import axiosCustomize from "@/service/axios.customize"


export const fetchProfileAPIs = async () => {
    return await axiosCustomize.get('api/v1/profile')
}

export const fetchUpdateProfileAPIs = async (data: any) => {
    return await axiosCustomize.put('api/v1/profile', data)
}

export const deleteUserAPIs = async(userId : string) => {
    return await axiosCustomize.delete(`api/v1/admin/${userId}`)
}

export const getTimeExpried = async() => {
    return await axiosCustomize.get(`api/v1/time`)
}

export const restoreUserAPIs = async(userId : string) => {
    return await axiosCustomize.patch(`api/v1/admin/restore/${userId}`)
}
