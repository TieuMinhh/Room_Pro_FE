import axiosCustomize from "@/service/axios.customize";

export const fetchTransactionsByUserId = async (userId: string) => {
    return await axiosCustomize.get(`/api/v1/transaction/user/${userId}`);
};

export const fetchTransactionByAdmin = async () => {
    return await axiosCustomize.get(`/api/v1/transaction/admin`);
};
