import axiosCustomize from "@/service/axios.customize"
export const fetchFeedback = async () => {
    return await axiosCustomize.get(`api/v1/feedbacks`)
}

export const updateFeedbackReply = (feedbackId: string, data: { reply: string }) => {
  return axiosCustomize.put(`/api/v1/feedbacks/${feedbackId}/reply`, data);
}

export const createFeedback = async (data: any) => {
  return await axiosCustomize.post(`api/v1/feedbacks`, data);
};

export const getOwnersOfTenant = async () => {
    return await axiosCustomize.get(`/api/v1/feedbacks/me/owners`);
};

export const getTenantsOfTenant = async () => {
    return await axiosCustomize.get(`/api/v1/feedbacks/myfeedbacks`);
};