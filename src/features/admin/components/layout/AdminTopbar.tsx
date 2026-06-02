"use client"

import { useRef, useState } from "react"
import { Search, ChevronDown, LogOut, KeyRound, ShieldCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/features/auth/store/auth.store"
import { useClickOutside } from "@/lib/hooks/use-click-outside"

export function AdminTopbar() {
  const { user, logout } = useAuthStore()
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useClickOutside(dropdownRef, () => setDropdownOpen(false), dropdownOpen)

  function handleLogout() {
    logout()
    router.push("/login")
  }

  const initials = user
    ? `${user.nombre[0]}${user.apellido[0]}`.toUpperCase()
    : "SA"
  const fullName = user ? `${user.nombre} ${user.apellido}` : "System Admin"

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 max-w-[420px] bg-vs-card border border-vs-line rounded-[24px] flex items-center gap-3 px-4 py-2.5">
          <Search size={16} className="text-[#a59682] shrink-0" />
          <input
            placeholder="Buscar taller por nombre o RUT…"
            className="bg-transparent outline-none flex-1 text-sm placeholder:text-[#a59682]"
          />
          <span className="text-[11px] text-[#a59682] font-mono bg-vs-chip px-2 py-0.5 rounded-full">
            ⌘K
          </span>
        </div>

        <div className="flex-1" />

        {/* Admin badge */}
        <div className="hidden md:flex items-center gap-2 bg-vs-violet-bg text-vs-violet px-3 py-1.5 rounded-full text-[12px] font-medium">
          <ShieldCheck size={14} />
          System Admin
        </div>

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
              <div className="text-[11px] text-[#8a7f70]">System Admin</div>
            </div>
            <ChevronDown
              size={16}
              className={`text-[#8a7f70] transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-vs-card border border-vs-line rounded-2xl shadow-lg py-1 z-50">
              <button
                onClick={() => setDropdownOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#2b2f36] hover:bg-vs-chip transition-colors rounded-xl mx-auto"
              >
                <KeyRound size={15} />
                Cambiar contraseña
              </button>
              <div className="mx-3 my-1 border-t border-vs-line" />
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
    </>
  )
}
