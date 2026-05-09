"use client"

import { useRef, useState, useEffect } from "react"
import { Bell, Settings, Search, Plus, ChevronDown, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useOrdenes } from "@/features/panel/context/OrdenesContext"
import { useAuthStore } from "@/features/auth/store/auth.store"

export function Topbar() {
  const { openNuevaOT } = useOrdenes()
  const { user, logout } = useAuthStore()
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleLogout() {
    logout()
    router.push("/login")
  }

  console.log("Current user in Topbar:", user)
  const initials = user
    ? `${user.nombre[0]}${user.apellido[0]}`.toUpperCase()
    : "MA"
  const fullName = user ? `${user.nombre} ${user.apellido}` : "Martín Álvarez"
  const cargo = user?.rol ?? "Jefe de taller"

  return (
    <div className="flex items-center gap-4 mb-6">
      {/* Search */}
      <div className="flex-1 max-w-[420px] bg-vs-card border border-vs-line rounded-[24px] flex items-center gap-3 px-4 py-2.5">
        <Search size={16} className="text-[#a59682] shrink-0" />
        <input
          placeholder="Buscar OT, marca, ciclista…"
          className="bg-transparent outline-none flex-1 text-sm placeholder:text-[#a59682]"
        />
        <span className="text-[11px] text-[#a59682] font-mono bg-vs-chip px-2 py-0.5 rounded-full">
          ⌘K
        </span>
      </div>

      <div className="flex-1" />

      {/* Nueva OT */}
      <button
        onClick={openNuevaOT}
        className="flex items-center gap-2 bg-vs-ink text-white pl-4 pr-2 py-2 rounded-full text-sm font-medium hover:bg-[#1e2228] transition-colors"
      >
        <Plus size={16} />
        Nueva OT
        <span className="ml-1 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
          <ChevronDown size={14} />
        </span>
      </button>

      {/* Bell */}
      <button className="relative w-10 h-10 rounded-full bg-vs-card border border-vs-line flex items-center justify-center text-[#2b2f36]">
        <Bell size={18} strokeWidth={1.6} />
        <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-vs-warn" />
      </button>

      {/* Settings */}
      <button className="w-10 h-10 rounded-full bg-vs-card border border-vs-line flex items-center justify-center text-[#2b2f36]">
        <Settings size={18} strokeWidth={1.6} />
      </button>

      {/* User */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((v) => !v)}
          className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-full bg-vs-card border border-vs-line hover:border-[#c4b89a] transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#d9c7a8] to-[#b39573] flex items-center justify-center text-white text-sm font-semibold">
            {initials}
          </div>
          <div className="leading-tight pr-2">
            <div className="text-[13px] font-semibold">{fullName}</div>
            <div className="text-[11px] text-[#8a7f70]">{cargo}</div>
          </div>
          <ChevronDown
            size={16}
            className={`text-[#8a7f70] transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
          />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-vs-card border border-vs-line rounded-2xl shadow-lg py-1 z-50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors rounded-xl mx-auto"
            >
              <LogOut size={15} />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
