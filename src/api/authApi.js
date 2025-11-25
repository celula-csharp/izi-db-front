import axiosClient from "./axiosClient";
export const authApi = {
    async login(payload) {
        const { data } = await axiosClient.post("/Users/login", payload);
        return data;
    },
    async register(payload) {
        const { data } = await axiosClient.post("/Users", payload);
        return data;
    },
    async getCurrentUser(id) {
        const { data } = await axiosClient.get(`/Users/${id}`);
        return data;
    },
};
