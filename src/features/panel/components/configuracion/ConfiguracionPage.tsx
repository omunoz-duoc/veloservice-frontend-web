"use client"

import { useState } from "react"
import { Building2, User, Users, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"
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
  roles: RolUsuario[]
}[] = [
  { key: "negocio", label: "Negocio", icon: Building2, roles: ["admin"] },
  { key: "perfil", label: "Mi perfil", icon: User, roles: ["admin", "mecanico", "recepcionista"] },
  { key: "usuarios", label: "Usuarios", icon: Users, roles: ["admin"] },
  { key: "plan", label: "Plan", icon: CreditCard, roles: ["admin"] },
]

export function ConfiguracionPage() {
  const rol: RolUsuario = "admin" // hardcoded in v1 — no real auth yet
  const visible = SECTIONS.filter((s) => s.roles.includes(rol))
  const [active, setActive] = useState<SectionKey>(visible[0].key)

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col md:flex-row">
      <nav
        role="tablist"
        aria-label="Secciones de configuración"
        className="flex min-w-0 gap-1 overflow-x-auto border-b border-[#eae2d6] bg-[#f7f3eb] p-3 md:w-48 md:shrink-0 md:flex-col md:overflow-x-visible md:border-b-0 md:border-r"
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
              "flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors md:w-full md:shrink",
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
        className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8"
      >
        {active === "negocio" && <PerfilNegocioSection />}
        {active === "perfil" && <MiPerfilSection />}
        {active === "usuarios" && <UsuariosSection />}
        {active === "plan" && <PlanSection />}
      </div>
    </div>
  )
}
