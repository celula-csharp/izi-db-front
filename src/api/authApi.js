import axiosClient from './axiosClient';
export const authApi = {
    async login(payload) {
        const { data } = await axiosClient.post('/auth/login', payload);
        return data;
    },
    async getCurrentUser() {
        const { data } = await axiosClient.get('/auth/me');
        return data;
    }
};
