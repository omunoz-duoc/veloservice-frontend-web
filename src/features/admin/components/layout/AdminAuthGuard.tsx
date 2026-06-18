"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/features/auth/store/auth.store"
import { useAuthHydrated } from "@/features/auth/hooks/useAuthHydrated"
import { useSessionExpiryGuard } from "@/features/auth/hooks/useSessionExpiryGuard"

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user)
  const router = useRouter()
  const hydrated = useAuthHydrated()

  useSessionExpiryGuard("/login_admin")

  const isAdmin = user?.rol === "sysadmin" || user?.rol === "admin" || user?.rol === "plataforma"

  useEffect(() => {
    if (hydrated) {
      if (!user) {
        router.replace("/login_admin")
      } else if (!isAdmin) {
        router.replace("/dashboard")
      }
    }
  }, [hydrated, user, router, isAdmin])

  if (!hydrated || !user || !isAdmin) return null

  return <>{children}</>
}
