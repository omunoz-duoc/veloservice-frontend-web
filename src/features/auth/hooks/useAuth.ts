import { useMutation } from "@tanstack/react-query";
import { authService } from "@/lib/api/services";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { httpClient } from "@/lib/api/http-client";
import {
  setSucursalesStorage,
  clearSucursalesStorage,
} from "@/lib/sucursales";
import type { RegisterPayload } from "@/features/auth/services/auth.service";
import type { Sucursal } from "@/lib/sucursales";

export function useLogin() {
  const { setUser, setError } = useAuthStore();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: async (user) => {
      setUser(user);
      if (user.ambito === "taller") {
        try {
          const sucursales = await httpClient.get<Sucursal[]>("sucursales");
          if (sucursales.length > 0) {
            setSucursalesStorage(sucursales, sucursales[0].id);
          }
        } catch (e) {
          console.error("Failed to fetch sucursales after login:", e);
        }
      } else {
        clearSucursalesStorage();
      }
    },
    onError: (err: Error) => setError(err.message),
  });
}

export function useLogout() {
  const { logout } = useAuthStore();
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearSucursalesStorage();
      logout();
    },
  });
}

export function useRecoverPassword() {
  return useMutation({
    mutationFn: (email: string) => authService.recoverPassword(email),
  });
}

export function useVerifyCode() {
  return useMutation({
    mutationFn: (code: string) => authService.verifyCode(code),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (password: string) => authService.resetPassword(password),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterPayload) => authService.register(data),
  });
}
