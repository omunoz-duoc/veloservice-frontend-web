"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home, ClipboardList, Users, Wrench, Package,
  Settings, Headset, ChevronLeft, ChevronRight,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/features/auth/store/auth.store"

type NavItem = {
  key: string
  label: string
  href: string
  icon: LucideIcon
  badge?: number
}

const NAV_ADMIN: NavItem[] = [
  { key: "dashboard",   label: "Dashboard",            href: "/dashboard",      icon: Home },
  { key: "ordenes",     label: "Órdenes",              href: "/ordenes",        icon: ClipboardList, badge: 12 },
  { key: "clientes",    label: "Clientes",             href: "/clientes",       icon: Users },
  { key: "servicios",   label: "Servicios",            href: "/servicios",      icon: Wrench },
  { key: "inventario",  label: "Inventario",           href: "/inventario",     icon: Package, badge: 5 },
  // { key: "proveedores", label: "Proveedores & compras",href: "/proveedores",    icon: Building2 },
  // { key: "finanzas",    label: "Finanzas",             href: "/finanzas",       icon: Landmark },
]

const NAV_SISTEMA: NavItem[] = [
  { key: "configuracion", label: "Configuraciones", href: "/configuracion", icon: Settings },
  // { key: "roles",         label: "Roles",           href: "/roles",         icon: Shield },
  // { key: "archivos",      label: "Archivos",        href: "/archivos",      icon: Folder },
]

const NAV_AYUDA: NavItem[] = [
  { key: "soporte",    label: "Soporte técnico", href: "/soporte",    icon: Headset },
  // { key: "docs",       label: "Documentación",   href: "/docs",       icon: FileText },
  // { key: "consultas",  label: "Consultas",       href: "/consultas",  icon: MessageCircle },
]

function NavGroup({
  label,
  items,
  pathname,
  collapsed,
}: {
  label: string
  items: NavItem[]
  pathname: string
  collapsed: boolean
}) {
  return (
    <div className="mb-6">
      <div className={cn(
        "text-[10.5px] uppercase tracking-[0.14em] text-[#b8a88d] font-medium px-3 mb-2 transition-all duration-200",
        collapsed ? "opacity-0 h-0 mb-0 overflow-hidden" : "opacity-100"
      )}>
        {label}
      </div>
      <nav className="flex flex-col gap-1">
        {items.map(item => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.key}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center py-2.5 rounded-full text-[14px] font-medium transition-all duration-200",
                collapsed ? "px-2 justify-center" : "gap-3 px-3.5 justify-start",
                active
                  ? "bg-vs-ink text-white"
                  : "text-[#4a4438] hover:bg-black/[0.04]"
              )}
            >
              <item.icon size={18} strokeWidth={1.6} className="shrink-0" />
              <span className={cn(
                "whitespace-nowrap overflow-hidden transition-all duration-200",
                collapsed ? "w-0 opacity-0" : "flex-1 opacity-100"
              )}>
                {item.label}
              </span>
              {item.badge && !collapsed && (
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

export function Sidebar() {
  const pathname = usePathname()
  const user = useAuthStore((s) => s.user)
  const isAdminTaller = user?.rol === "admin_taller"
  const sistemaItems = isAdminTaller ? NAV_SISTEMA : []

  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const check = () => {
      if (window.innerWidth < 1280) setCollapsed(true)
    }
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  return (
    <aside className={cn(
      "relative hidden shrink-0 flex-col py-7 md:flex transition-all duration-200",
      collapsed ? "w-14 px-2" : "w-[240px] px-5"
    )}>
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="absolute -right-3 top-7 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-[#e5ddd4] bg-white shadow-sm text-[#6b5d46] hover:bg-[#f5efe8] transition-colors"
        aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
      >
        {collapsed
          ? <ChevronRight size={12} strokeWidth={2} />
          : <ChevronLeft size={12} strokeWidth={2} />
        }
      </button>

      {/* Logo */}
      <div className={cn("mb-7 transition-all duration-200", collapsed ? "px-1" : "px-3")}>
        <div className={cn("flex items-center gap-2", collapsed ? "justify-center" : "justify-start")}>
          <div className="w-9 h-9 rounded-full bg-vs-ink flex items-center justify-center shrink-0">
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
          <div className={cn("transition-all duration-200 overflow-hidden", collapsed ? "w-0 opacity-0" : "opacity-100")}>
            <div className="text-[15px] font-bold tracking-tight leading-none whitespace-nowrap">
              VELOSERVICE
            </div>
            <div className="text-[11px] text-[#8a7f70] mt-1 whitespace-nowrap">
              Taller de bicicletas
            </div>
          </div>
        </div>
      </div>

      <NavGroup label="Administración" items={NAV_ADMIN} pathname={pathname} collapsed={collapsed} />
      {sistemaItems.length > 0 && (
        <NavGroup label="Sistema" items={sistemaItems} pathname={pathname} collapsed={collapsed} />
      )}
      <NavGroup label="Ayuda" items={NAV_AYUDA} pathname={pathname} collapsed={collapsed} />
    </aside>
  )
}
