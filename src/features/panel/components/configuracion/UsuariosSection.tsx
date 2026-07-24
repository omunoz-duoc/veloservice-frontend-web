"use client"

import { useQuery } from "@tanstack/react-query"
import {
  Building2,
  LoaderCircle,
  ShieldCheck,
  UserRoundX,
  Users,
} from "lucide-react"
import { useAuthStore } from "@/features/auth/store/auth.store"
import { cn } from "@/lib/utils"
import { configuracionService } from "../../services/configuracion.provider"
import type { RolUsuario } from "../../types/configuracion.types"
import {
  agruparUsuariosPorSucursal,
  type GrupoUsuarios,
  type UsuarioAgrupado,
} from "./usuarios.utils"

const USUARIOS_QUERY_KEY = ["configuracion", "usuarios"] as const

const ROL_LABEL: Record<RolUsuario, string> = {
  admin_taller: "Admin taller",
  jefe_taller: "Jefe de taller",
  mecanico: "Mecánico",
  recepcionista: "Recepcionista",
}

const ROL_COLOR: Record<RolUsuario, string> = {
  admin_taller: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  jefe_taller: "bg-amber-50 text-amber-800 ring-amber-600/15",
  mecanico: "bg-blue-50 text-blue-700 ring-blue-600/15",
  recepcionista: "bg-violet-50 text-violet-700 ring-violet-600/15",
}

function Initials({ nombre, apellido }: { nombre: string; apellido: string }) {
  const initials = `${nombre.trim().charAt(0)}${apellido.trim().charAt(0)}` || "?"
  return (
    <div
      aria-hidden="true"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-vs-ink text-xs font-bold uppercase tracking-wide text-white"
    >
      {initials}
    </div>
  )
}

function GroupIcon({ group }: { group: GrupoUsuarios }) {
  const className = "text-[#6c604f]"
  if (group.tipo === "administracion") {
    return <ShieldCheck size={19} className={className} aria-hidden="true" />
  }
  if (group.tipo === "sin_sucursal") {
    return <UserRoundX size={19} className={className} aria-hidden="true" />
  }
  return <Building2 size={19} className={className} aria-hidden="true" />
}

function UsuarioRow({ usuario }: { usuario: UsuarioAgrupado }) {
  return (
    <li className="grid min-w-0 gap-3 border-t border-[#eee7de] px-4 py-4 first:border-t-0 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto] sm:items-center sm:px-5">
      <Initials nombre={usuario.nombre} apellido={usuario.apellido} />

      <div className="min-w-0">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
          <p className="truncate text-sm font-semibold text-vs-ink">
            {usuario.nombre} {usuario.apellido}
          </p>
          {usuario.asignacion?.esPrincipal ? (
            <span className="rounded-full bg-[#efe8dd] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#6c604f]">
              Principal
            </span>
          ) : null}
        </div>
        <p className="mt-0.5 truncate text-xs text-[#817568]">{usuario.email}</p>
      </div>

      <div className="col-start-2 flex flex-wrap items-center gap-2 sm:col-start-auto sm:justify-end">
        <span
          className={cn(
            "rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset",
            ROL_COLOR[usuario.rol]
          )}
        >
          {ROL_LABEL[usuario.rol]}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
            usuario.activo
              ? "bg-[#eef6ef] text-[#3f7550]"
              : "bg-[#f2efeb] text-[#887d70]"
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              "h-1.5 w-1.5 rounded-full",
              usuario.activo ? "bg-emerald-500" : "bg-[#9d9388]"
            )}
          />
          {usuario.activo ? "Activo" : "Inactivo"}
        </span>
      </div>
    </li>
  )
}

function UsuariosGroup({ group }: { group: GrupoUsuarios }) {
  return (
    <section
      aria-labelledby={`grupo-${group.id}`}
      className="overflow-hidden rounded-2xl border border-[#e4dbcf] bg-white shadow-[0_10px_30px_rgba(45,41,38,0.04)]"
    >
      <div className="flex items-center justify-between gap-3 border-b border-[#e8e0d5] bg-[#f8f4ed] px-4 py-3.5 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[#ece4d8]">
            <GroupIcon group={group} />
          </div>
          <div className="min-w-0">
            <h3 id={`grupo-${group.id}`} className="truncate text-sm font-bold text-vs-ink">
              {group.nombre}
            </h3>
            <p className="text-xs text-[#8b7f71]">
              {group.tipo === "administracion"
                ? "Acceso global al taller"
                : group.tipo === "sin_sucursal"
                  ? "Requiere asignación"
                  : "Equipo asignado a esta ubicación"}
            </p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-[#6c604f] ring-1 ring-[#ded5c9]">
          {group.usuarios.length}
        </span>
      </div>

      <ul>
        {group.usuarios.map((usuario) => (
          <UsuarioRow key={usuario.id} usuario={usuario} />
        ))}
      </ul>
    </section>
  )
}

export function UsuariosSection() {
  const isAdminTaller = useAuthStore((state) => state.user?.rol === "admin_taller")
  const usuariosQuery = useQuery({
    queryKey: USUARIOS_QUERY_KEY,
    queryFn: () => configuracionService.getUsuarios(),
    enabled: isAdminTaller,
  })

  if (!isAdminTaller) return null

  const groups = agruparUsuariosPorSucursal(usuariosQuery.data ?? [])

  return (
    <div className="min-w-0 max-w-5xl">
      <div className="mb-7">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#a09280]">
          Equipo y accesos
        </p>
        <h2 className="text-2xl font-bold tracking-tight text-vs-ink">Usuarios por sucursal</h2>
        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[#7d7265]">
          Consulta quién trabaja en cada ubicación. Un usuario puede aparecer en más de una
          sucursal cuando tiene asignaciones adicionales.
        </p>
      </div>

      {usuariosQuery.isLoading ? (
        <div
          role="status"
          className="flex min-h-48 items-center justify-center rounded-2xl border border-[#e4dbcf] bg-white text-sm text-[#7d7265]"
        >
          <LoaderCircle
            size={18}
            className="mr-2 animate-spin motion-reduce:animate-none"
            aria-hidden="true"
          />
          Cargando usuarios…
        </div>
      ) : null}

      {usuariosQuery.isError ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#f1cbb9] bg-[#fff7f2] px-5 py-4 text-sm text-[#a94f2a]">
          <span>No se pudo cargar el equipo del taller.</span>
          <button
            type="button"
            onClick={() => void usuariosQuery.refetch()}
            className="font-semibold underline underline-offset-4"
          >
            Reintentar
          </button>
        </div>
      ) : null}

      {usuariosQuery.isSuccess && groups.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#d8cec0] bg-[#faf7f2] px-6 py-12 text-center">
          <Users size={30} className="mx-auto mb-3 text-[#a59682]" aria-hidden="true" />
          <p className="font-semibold text-vs-ink">No hay usuarios registrados</p>
          <p className="mt-1 text-sm text-[#7d7265]">
            Los miembros del taller aparecerán aquí cuando tengan acceso.
          </p>
        </div>
      ) : null}

      {groups.length > 0 ? (
        <div className="space-y-4">
          {groups.map((group) => (
            <UsuariosGroup key={group.id} group={group} />
          ))}
        </div>
      ) : null}
    </div>
  )
}
