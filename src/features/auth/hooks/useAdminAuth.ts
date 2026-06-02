import { useMutation } from "@tanstack/react-query";
import { adminAuthService } from "@/features/auth/services/admin-auth.provider";
import { useAuthStore } from "@/features/auth/store/auth.store";

export function useAdminLogin() {
  const { setUser, setError } = useAuthStore();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      adminAuthService.login(email, password),
    onSuccess: (user) => setUser(user),
    onError: (err: Error) => setError(err.message),
  });
}

export function useAdminLogout() {
  const { logout } = useAuthStore();
  return useMutation({
    mutationFn: () => adminAuthService.logout(),
    onSuccess: logout,
  });
}
