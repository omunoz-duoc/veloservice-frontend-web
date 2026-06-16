"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useAuthHydrated } from "@/features/auth/hooks/useAuthHydrated";
import { isTokenExpired } from "@/features/auth/utils/jwt";

/**
 * Inverse of AuthGuard: keeps already-authenticated users out of the auth
 * routes (login, etc.). If a user with a non-expired token navigates here,
 * redirect them into the app. Expired sessions are left alone so they can
 * log in again.
 */
export function GuestGuard({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthHydrated();
  const pathname = usePathname();
  const router = useRouter();

  const authenticated = !!user && !isTokenExpired(user.token);

  useEffect(() => {
    if (!hydrated || !authenticated) return;
    router.replace(user?.rol === "sysadmin" ? "/admin" : "/dashboard");
  }, [pathname, hydrated, authenticated, user?.rol, router]);

  if (hydrated && authenticated) return null;

  return <>{children}</>;
}
