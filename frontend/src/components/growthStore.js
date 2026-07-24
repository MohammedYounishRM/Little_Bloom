import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/growth" : "/api/growth";
axios.defaults.withCredentials = true;

export const useGrowthStore = create((set) => ({
    isLoading: false,
    error: null,

    saveGrowth: async (growthData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/save`, growthData);
            set({ isLoading: false });
        } catch (error) {
            set({ isLoading: false, error: error.response.data.message || "Failed to submit growth tracking numbers." });
        }
    }
}));