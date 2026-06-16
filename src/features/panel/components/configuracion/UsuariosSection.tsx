"use client"

import { useState, useEffect } from "react"
import { configuracionService } from "../../services/configuracion.provider"
import type { UsuarioPanel, RolUsuario } from "../../types/configuracion.types"

const ROL_LABEL: Record<RolUsuario, string> = {
  admin: "Admin",
  mecanico: "Mecánico",
  recepcionista: "Recepcionista",
}

const ROL_COLOR: Record<RolUsuario, string> = {
  admin: "bg-emerald-50 text-emerald-700",
  mecanico: "bg-blue-50 text-blue-700",
  recepcionista: "bg-purple-50 text-purple-700",
}

function Initials({ nombre }: { nombre: string }) {
  const parts = nombre.trim().split(" ")
  const initials =
    parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : parts[0].slice(0, 2)
  return (
    <div
      aria-hidden="true"
      className="w-8 h-8 rounded-full bg-[#2d2926] text-white flex items-center justify-center text-xs font-semibold uppercase shrink-0"
    >
      {initials}
    </div>
  )
}

export function UsuariosSection() {
  const [usuarios, setUsuarios] = useState<UsuarioPanel[]>([])

  useEffect(() => {
    configuracionService.getUsuarios().then(setUsuarios)
  }, [])

  return (
    <div className="min-w-0">
      <h2 className="text-xl font-bold text-[#0f1114]">Usuarios</h2>
      <p className="text-sm text-[#8a7f70] mt-1 mb-6">
        Miembros con acceso al panel. Para invitar o desactivar usuarios, contacta al administrador del sistema.
      </p>

      <div className="max-w-2xl min-w-0 overflow-hidden rounded-xl border border-[#eae2d6]">
        <div className="max-w-full overflow-x-auto">
        <div className="min-w-[560px]">
        <div className="grid grid-cols-[2rem_1fr_1fr_auto] gap-0 bg-[#f7f3eb] px-4 py-2 text-xs font-semibold text-[#8a7f70] uppercase tracking-wide border-b border-[#eae2d6]">
          <span />
          <span className="pl-3">Nombre</span>
          <span>Email</span>
          <span>Rol</span>
        </div>

        {usuarios.map((u) => (
          <div
            key={u.id}
            className="grid grid-cols-[2rem_1fr_1fr_auto] gap-0 items-center px-4 py-3 border-b border-[#eae2d6] last:border-b-0 hover:bg-[#faf7f4] transition-colors"
          >
            <Initials nombre={u.nombre} />
            <span className="text-sm font-medium text-[#0f1114] truncate pl-3 pr-4">{u.nombre}</span>
            <span className="text-sm text-[#8a7f70] truncate pr-4">{u.email}</span>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ROL_COLOR[u.rol]}`}>
              {ROL_LABEL[u.rol]}
            </span>
          </div>
        ))}
        </div>
        </div>
      </div>
    </div>
  )
}
