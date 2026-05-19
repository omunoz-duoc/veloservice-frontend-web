"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/features/auth/store/auth.store"

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user)
  const router = useRouter()
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  const isAdmin = user?.rol === "sysadmin" || user?.rol === "admin"

  useEffect(() => {
    if (hydrated) {
      if (!user) {
        router.replace("/login")
      } else if (!isAdmin) {
        router.replace("/dashboard")
      }
    }
  }, [hydrated, user, router, isAdmin])

  if (!hydrated || !user || !isAdmin) return null

  return <>{children}</>
}
