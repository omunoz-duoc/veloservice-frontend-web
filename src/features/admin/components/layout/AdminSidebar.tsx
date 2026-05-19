"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Building2,
  Puzzle,
  CreditCard,
  BarChart3,
  Settings,
  Shield,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type NavItem = {
  key: string
  label: string
  href: string
  icon: LucideIcon
  badge?: number
}

const NAV_PLATAFORMA: NavItem[] = [
  { key: "dashboard", label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { key: "talleres", label: "Talleres", href: "/admin/talleres", icon: Building2, badge: 10 },
  { key: "suscripciones", label: "Suscripciones", href: "/admin/suscripciones", icon: CreditCard },
  { key: "modulos", label: "Módulos", href: "/admin/modulos", icon: Puzzle },
]

const NAV_METRICAS: NavItem[] = [
  { key: "metricas", label: "Métricas SaaS", href: "/admin/metricas", icon: BarChart3 },
]

const NAV_SISTEMA: NavItem[] = [
  { key: "configuracion", label: "Configuraciones", href: "/admin/configuracion", icon: Settings },
]

function NavGroup({
  label,
  items,
  pathname,
}: {
  label: string
  items: NavItem[]
  pathname: string
}) {
  return (
    <div className="mb-6">
      <div className="text-[10.5px] uppercase tracking-[0.14em] text-[#b8a88d] font-medium px-3 mb-2">
        {label}
      </div>
      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-full text-[14px] font-medium transition-colors",
                active
                  ? "bg-vs-ink text-white"
                  : "text-[#4a4438] hover:bg-black/[0.04]"
              )}
            >
              <item.icon size={18} strokeWidth={1.6} className="shrink-0" />
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && (
                <span
                  className={cn(
                    "text-[11px] font-semibold px-2 py-0.5 rounded-full",
                    active
                      ? "bg-white/20 text-white"
                      : "bg-[#e9dfd0] text-[#6b5d46]"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-[240px] shrink-0 px-5 py-7 flex flex-col">
      {/* Logo */}
      <div className="px-3 mb-7">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-vs-ink flex items-center justify-center">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#f3ede6"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <circle cx="6" cy="16" r="4" />
              <circle cx="18" cy="16" r="4" />
              <path d="M6 16 10 7h5l3 9" />
            </svg>
          </div>
          <div>
            <div className="text-[15px] font-bold tracking-tight leading-none">
              VELOSERVICE
            </div>
            <div className="text-[11px] text-[#8a7f70] mt-1">
              Administración
            </div>
          </div>
        </div>
      </div>

      <NavGroup label="Plataforma" items={NAV_PLATAFORMA} pathname={pathname} />
      <NavGroup label="Métricas" items={NAV_METRICAS} pathname={pathname} />
      <NavGroup label="Sistema" items={NAV_SISTEMA} pathname={pathname} />

      {/* Rol badge */}
      <div className="mt-auto px-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-vs-violet-bg text-vs-violet text-[12px] font-medium">
          <Shield size={14} />
          System Admin
        </div>
      </div>
    </aside>
  )
}
