import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  token: string | null;
  setToken: (token: string) => void;
  clearToken: () => void;
}

export const useAuthStore = create(
  persist<AuthStore>(
    (set) => ({
      token: null,
      setToken: (token: string) => set(() => ({ token })),
      clearToken: () => set({ token: null }),
    }),
    {
      name: "auth-storage",
    }
  )
);
