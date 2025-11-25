import axiosClient from './axiosClient';
export const authApi = {
    async login(payload) {
        const { data } = await axiosClient.post('/Users/login', payload);
        return data;
    },
    async getCurrentUser() {
        const { data } = await axiosClient.get("/Users/me");
        return data;
    }
};
