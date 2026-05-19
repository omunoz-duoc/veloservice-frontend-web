"use client"

import { useState } from "react"
import { Building2, User, Users, Bell, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"
import { PerfilNegocioSection } from "./PerfilNegocioSection"
import { MiPerfilSection } from "./MiPerfilSection"
import { UsuariosSection } from "./UsuariosSection"
import { NotificacionesSection } from "./NotificacionesSection"
import { PlanSection } from "./PlanSection"
import type { RolUsuario } from "../../types/configuracion.types"

type SectionKey = "negocio" | "perfil" | "usuarios" | "notificaciones" | "plan"

const SECTIONS: {
  key: SectionKey
  label: string
  icon: React.ComponentType<{ size?: number; "aria-hidden"?: boolean | "true" }>
  roles: RolUsuario[]
}[] = [
  { key: "negocio", label: "Negocio", icon: Building2, roles: ["admin"] },
  { key: "perfil", label: "Mi perfil", icon: User, roles: ["admin", "mecanico", "recepcionista"] },
  { key: "usuarios", label: "Usuarios", icon: Users, roles: ["admin"] },
  { key: "notificaciones", label: "Notificaciones", icon: Bell, roles: ["admin"] },
  { key: "plan", label: "Plan", icon: CreditCard, roles: ["admin"] },
]

export function ConfiguracionPage() {
  const rol: RolUsuario = "admin" // hardcoded in v1 — no real auth yet
  const visible = SECTIONS.filter((s) => s.roles.includes(rol))
  const [active, setActive] = useState<SectionKey>(visible[0].key)

  return (
    <div className="flex h-full min-h-0">
      <nav
        role="tablist"
        aria-label="Secciones de configuración"
        className="w-48 shrink-0 border-r border-[#eae2d6] bg-[#f7f3eb] p-3 flex flex-col gap-1"
      >
        {visible.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            id={`tab-${key}`}
            role="tab"
            aria-selected={active === key}
            aria-controls={`panel-${key}`}
            onClick={() => setActive(key)}
            className={cn(
              "flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-left transition-colors",
              active === key
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
        id={`panel-${active}`}
        role="tabpanel"
        aria-labelledby={`tab-${active}`}
        className="flex-1 overflow-y-auto p-8"
      >
        {active === "negocio" && <PerfilNegocioSection />}
        {active === "perfil" && <MiPerfilSection />}
        {active === "usuarios" && <UsuariosSection />}
        {active === "notificaciones" && <NotificacionesSection />}
        {active === "plan" && <PlanSection />}
      </div>
    </div>
  )
}
