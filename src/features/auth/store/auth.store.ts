import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/features/auth/services/auth.service";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
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
      setUser: (user) => set({ user, token: user.token ?? null, isLoading: false, error: null }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error, isLoading: false }),
      logout: () => set({ user: null, token: null, error: null }),
    }),
    {
      name: "vs-auth",
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
