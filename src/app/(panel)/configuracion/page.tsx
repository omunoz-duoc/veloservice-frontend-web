"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ConfiguracionPage } from "@/features/panel/components/configuracion/ConfiguracionPage"
import { useAuthStore } from "@/features/auth/store/auth.store"

export default function ConfiguracionRoute() {
  const user = useAuthStore((s) => s.user)
  const router = useRouter()
  const isAdminTaller = user?.rol === "admin_taller"

  useEffect(() => {
    if (!isAdminTaller) {
      router.replace("/dashboard")
    }
  }, [isAdminTaller, router])

  if (!isAdminTaller) return null

  return <ConfiguracionPage />
}
