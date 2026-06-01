import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { User } from "@/features/auth/services/auth.service";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  setSession: (user: User, token: string) => void;
  setUser: (user: User) => void;
  setLoading: (v: boolean) => void;
  setError: (msg: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      setSession: (user, token) => set({ user, token, isLoading: false, error: null }),
      setUser: (user) => set({ user, isLoading: false, error: null }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error, isLoading: false }),
      logout: () => set({ user: null, token: null, error: null }),
    }),
    {
      name: "veloservice-auth",
      storage: createJSONStorage(() => sessionStorage),
      partialize: ({ user, token }) => ({ user, token }),
    }
  )
);
