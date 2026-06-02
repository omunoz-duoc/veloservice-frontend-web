"use client"

import { useRef, useState } from "react"
import { Bell, Settings, Search, Plus, ChevronDown, LogOut, KeyRound, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { useOrdenes } from "@/features/panel/context/OrdenesContext"
import { useAuthStore } from "@/features/auth/store/auth.store"
import { useClickOutside } from "@/lib/hooks/use-click-outside"

export function Topbar() {
  const { openNuevaOT } = useOrdenes()
  const { user, logout } = useAuthStore()
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [sentOpen, setSentOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useClickOutside(dropdownRef, () => setDropdownOpen(false), dropdownOpen)

  function handleLogout() {
    logout()
    router.push("/login")
  }

  function handleChangePassword() {
    setDropdownOpen(false)
    setConfirmOpen(true)
  }

  function handleConfirmChangePassword() {
    setConfirmOpen(false)
    setSentOpen(true)
  }

  const initials = user
    ? `${user.nombre[0]}${user.apellido[0]}`.toUpperCase()
    : "MA"
  const fullName = user ? `${user.nombre} ${user.apellido}` : "Martín Álvarez"
  const cargo = user?.rol ?? "Jefe de taller"

  return (
    <>
    <div className="flex items-center gap-4 mb-6">
      {/* Search */}
      <div className="flex-1 max-w-[420px] bg-vs-card border border-vs-line rounded-[24px] flex items-center gap-3 px-4 py-2.5 invisible">
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
      <button className="relative w-10 h-10 rounded-full bg-vs-card border border-vs-line flex items-center justify-center text-[#2b2f36] hidden">
        <Bell size={18} strokeWidth={1.6} />
        <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-vs-warn" />
      </button>

      {/* Settings */}
      <button className="w-10 h-10 rounded-full bg-vs-card border border-vs-line flex items-center justify-center text-[#2b2f36] hidden">
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
              onClick={handleChangePassword}
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

    {/* Confirm change password */}
    {confirmOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-vs-card border border-vs-line rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-[15px] font-semibold text-[#2b2f36]">¿Cambiar contraseña?</h2>
            <p className="text-[13px] text-[#8a7f70] leading-relaxed">
              Te enviaremos un enlace a tu correo para restablecer tu contraseña. ¿Deseas continuar?
            </p>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setConfirmOpen(false)}
              className="px-4 py-2 text-sm rounded-xl border border-vs-line text-[#2b2f36] hover:bg-vs-chip transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmChangePassword}
              className="px-4 py-2 text-sm rounded-xl bg-vs-ink text-white hover:bg-[#1e2228] transition-colors"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Link sent confirmation */}
    {sentOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-vs-card border border-vs-line rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 flex flex-col gap-4">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-11 h-11 rounded-full bg-vs-chip flex items-center justify-center">
              <Mail size={20} className="text-[#2b2f36]" />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-[15px] font-semibold text-[#2b2f36]">Enlace enviado</h2>
              <p className="text-[13px] text-[#8a7f70] leading-relaxed">
                Hemos enviado un enlace a{" "}
                <span className="font-medium text-[#2b2f36]">{user?.email ?? "tu correo registrado"}</span>{" "}
                para restablecer tu contraseña.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSentOpen(false)}
            className="w-full px-4 py-2 text-sm rounded-xl bg-vs-ink text-white hover:bg-[#1e2228] transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    )}
    </>
  )
}
