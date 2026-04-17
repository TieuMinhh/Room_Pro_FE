import axiosCustomize from "@/service/axios.customize"

export const fetchWallet = () => {
    return axiosCustomize.get('/api/v1/wallet')
}

export const fetchWalletAdmin = () => {
    return axiosCustomize.get('/api/v1/wallet/admin')
}