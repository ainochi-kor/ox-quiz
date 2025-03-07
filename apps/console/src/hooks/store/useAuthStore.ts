import { UserCredential } from "firebase/auth";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStore {
  userCredential: UserCredential | null;
  setUserCredential: (userCredential: UserCredential) => void;
  clearUserCredential: () => void;
}

export const useAuthStore = create(
  persist<AuthStore>(
    (set) => ({
      userCredential: null,
      setUserCredential: (userCredential: UserCredential) =>
        set(() => ({ userCredential })),
      clearUserCredential: () => set({ userCredential: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
