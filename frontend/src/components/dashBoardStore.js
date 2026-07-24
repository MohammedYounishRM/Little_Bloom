import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api";
axios.defaults.withCredentials = true;

export const useDashBoardStore = create((set) => ({
    activeTab: "dashboard",
    metrics: { totalStrength: 0, presentCount: 0, absentCount: 0 },
    recentChildren: [],
    isLoading: false,

    setActiveTab: (tabName) => set({ activeTab: tabName }),

    fetchDashboardMetrics: async () => {
        set({ isLoading: true });
        try {
            const response = await axios.get(`${API_URL}/dashboard`);
            set({ 
                metrics: response.data.metrics, 
                recentChildren: response.data.recentChildren,
                isLoading: false 
            });
        } catch (error) {
            console.error("Error syncing state overview:", error);
            set({ isLoading: false });
        }
    }
}));