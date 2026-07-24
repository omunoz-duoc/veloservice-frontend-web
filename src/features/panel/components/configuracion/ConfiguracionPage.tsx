"use client"

import { useState } from "react"
import { Building2, User, Users, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/features/auth/store/auth.store"
import { PerfilNegocioSection } from "./PerfilNegocioSection"
import { MiPerfilSection } from "./MiPerfilSection"
import { UsuariosSection } from "./UsuariosSection"
import { PlanSection } from "./PlanSection"
import type { RolUsuario } from "../../types/configuracion.types"

type SectionKey = "negocio" | "perfil" | "usuarios" | "plan"

const SECTIONS: {
  key: SectionKey
  label: string
  icon: React.ComponentType<{ size?: number; "aria-hidden"?: boolean | "true" }>
  roles: readonly RolUsuario[]
}[] = [
  { key: "negocio", label: "Negocio", icon: Building2, roles: ["admin_taller"] },
  {
    key: "perfil",
    label: "Mi perfil",
    icon: User,
    roles: ["admin_taller", "jefe_taller", "mecanico", "recepcionista"],
  },
  { key: "usuarios", label: "Usuarios", icon: Users, roles: ["admin_taller"] },
  { key: "plan", label: "Plan", icon: CreditCard, roles: ["admin_taller"] },
]

export function ConfiguracionPage() {
  const rol = useAuthStore((s) => s.user?.rol) as RolUsuario | undefined
  const visible = SECTIONS.filter((s) => rol && s.roles.includes(rol))
  const [active, setActive] = useState<SectionKey>(() =>
    rol === "admin_taller" ? "negocio" : "perfil"
  )

  if (!rol || visible.length === 0) return null
  const resolvedActive = visible.some((section) => section.key === active)
    ? active
    : visible[0].key

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col md:flex-row">
      <nav
        role="tablist"
        aria-label="Secciones de configuracion"
        className="flex min-w-0 gap-1 overflow-x-auto border-b border-[#eae2d6] bg-[#f7f3eb] p-3 md:w-48 md:shrink-0 md:flex-col md:overflow-x-visible md:border-b-0 md:border-r"
      >
        {visible.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            id={`tab-${key}`}
            role="tab"
            aria-selected={resolvedActive === key}
            aria-controls={`panel-${key}`}
            onClick={() => setActive(key)}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors md:w-full md:shrink",
              resolvedActive === key
                ? "bg-[#2d2926] text-white"
                : "text-[#8a7f70] hover:bg-[#ece7e0] hover:text-[#2d2926]"
            )}
          >
            <Icon size={16} aria-hidden={true} />
            {label}
          </button>
        ))}
      </nav>

      <div
        id={`panel-${resolvedActive}`}
        role="tabpanel"
        aria-labelledby={`tab-${resolvedActive}`}
        tabIndex={0}
        className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8"
      >
        {resolvedActive === "negocio" ? <PerfilNegocioSection /> : null}
        {resolvedActive === "perfil" ? <MiPerfilSection /> : null}
        {resolvedActive === "usuarios" ? <UsuariosSection /> : null}
        {resolvedActive === "plan" ? <PlanSection /> : null}
      </div>
    </div>
  )
}
