"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useAuthHydrated } from "@/features/auth/hooks/useAuthHydrated";
import { isTokenExpired } from "@/features/auth/utils/jwt";
import { clearSucursalesStorage } from "@/lib/sucursales";

/**
 * Checks JWT expiration on every route navigation (and on initial load).
 * On an expired session it warns the user via SweetAlert2, clears auth
 * localStorage, and redirects to `redirectTo`.
 *
 * Meant to be called from a persistent layout guard so it re-runs on each
 * pathname change.
 */
export function useSessionExpiryGuard(redirectTo = "/login") {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const hydrated = useAuthHydrated();
  const pathname = usePathname();
  const router = useRouter();

  const handledRef = useRef(false);

  useEffect(() => {
    if (!hydrated || !user) return;
    if (!isTokenExpired(user.token)) return;
    if (handledRef.current) return;
    handledRef.current = true;

    (async () => {
      await Swal.fire({
        icon: "warning",
        title: "Sesión expirada",
        text: "Tu sesión ha expirado. Inicia sesión nuevamente.",
        confirmButtonColor: "#2a2e35",
        allowOutsideClick: false,
        allowEscapeKey: false,
      });

      logout();
      clearSucursalesStorage();
      if (typeof window !== "undefined") {
        localStorage.removeItem("vs-auth");
      }

      router.replace(redirectTo);
    })();
  }, [pathname, hydrated, user, logout, router, redirectTo]);
}
