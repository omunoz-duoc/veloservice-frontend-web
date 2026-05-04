import { useMutation } from "@tanstack/react-query";
import { authService } from "@/lib/api/services";
import { useAuthStore } from "@/features/auth/store/auth.store";
import type { RegisterPayload } from "@/features/auth/services/auth.service";

export function useLogin() {
  const { setUser, setError } = useAuthStore();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.login(email, password),
    onSuccess: (user) => setUser(user),
    onError: (err: Error) => setError(err.message),
  });
}

export function useLogout() {
  const { logout } = useAuthStore();
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: logout,
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
