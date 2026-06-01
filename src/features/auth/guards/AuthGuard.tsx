"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth/store/auth.store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    if (hasHydrated && (!user || !token)) {
      router.replace("/login");
    }
  }, [hasHydrated, router, token, user]);

  if (!hasHydrated || !user || !token) {
    return null;
  }

  return <>{children}</>;
}
