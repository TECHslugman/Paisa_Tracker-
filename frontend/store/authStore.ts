// frontend/store/authStore.ts
import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  saveAuth: (token: string) => Promise<void>;
  loadAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isAuthenticated: false,
  isLoading: true,

  saveAuth: async (token) => {
    await AsyncStorage.setItem("token", token);
    set({ token, isAuthenticated: true });
  },

  loadAuth: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        set({ token, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem("token");
    set({ token: null, isAuthenticated: false });
  },
}));