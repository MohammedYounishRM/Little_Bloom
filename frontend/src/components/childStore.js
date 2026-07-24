import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/children" : "/api/children";
axios.defaults.withCredentials = true;

export const useChildStore = create((set) => ({
    children: [],
    isLoading: false,
    error: null,

    fetchChildren: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.get(API_URL);
            set({ children: response.data.children, isLoading: false });
        } catch (error) {
            set({ error: error.response.data.message || "Failed to fetch children.", isLoading: false });
        }
    },

    addChild: async (childData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(API_URL, childData);
            set((state) => ({ children: [response.data.child, ...state.children], isLoading: false }));
        } catch (error) {
            set({ error: error.response.data.message || "Error in creating student profile.", isLoading: false });
        }
    },

    updateChild: async (id, updatedData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.put(`${API_URL}/${id}`, updatedData);
            set((state) => ({ children: state.children.map((child) => child.id === id ? response.data.child : child), isLoading: false }));
        } catch (error) {
            set({ error: error.response.data.message || "Error in saving alterations.", isLoading: false });
        }
    },

    deleteChild: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.delete(`${API_URL}/${id}`);
            set((state) => ({ children: state.children.filter((child) => child.id !== id), isLoading: false }));
        } catch (error) {
            set({ error: error.response.data.message || "Failed to complete deletion process.", isLoading: false });
        }
    }
}));