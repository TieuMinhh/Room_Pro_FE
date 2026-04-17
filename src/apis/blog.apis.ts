import axiosCustomize from "@/service/axios.customize";

export const addRoomToBlog = (roomId: string,  data: any) => {
  return axiosCustomize.post(`/api/v1/blogs/${roomId}`, data);
};

export const removeRoomFromBlog = (roomId : string) => {
  return axiosCustomize.delete(`/api/v1/blogs/${roomId}`)
}

export const checkRoomStatus = (roomId: string) => {
  return axiosCustomize.get(`/api/v1/blogs/check-status/${roomId}`);
}

export const fetchAPIsBlogById = (id: string) => {
  return axiosCustomize.get(`/api/v1/blogs/${id}`);
};

export const fetchAPIsBlog = () => {
  return axiosCustomize.get(`/api/v1/blogs`);
};