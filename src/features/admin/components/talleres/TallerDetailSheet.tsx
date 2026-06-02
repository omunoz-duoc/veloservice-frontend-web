"use client"

import { X, MapPin, Phone, Mail, Calendar, Users, Wrench, CheckCircle2 } from "lucide-react"
import type { TallerAdmin } from "@/features/admin/services/admin.types"
import { StatusBadge } from "@/components/common/StatusBadge"
import { useAdminModulos } from "@/features/admin/hooks/useAdmin"

function estadoTone(estado: TallerAdmin["estado"]) {
  switch (estado) {
    case "activo": return "good" as const
    case "trial": return "info" as const
    case "pendiente": return "amber" as const
    case "suspendido": return "warn" as const
    case "inactivo": return "muted" as const
    default: return "muted" as const
  }
}

function estadoLabel(estado: TallerAdmin["estado"]) {
  const map: Record<string, string> = { activo: "Activo", inactivo: "Inactivo", pendiente: "Pendiente", suspendido: "Suspendido", trial: "Trial" }
  return map[estado] ?? estado
}

export function TallerDetailSheet({ taller, onClose }: { taller: TallerAdmin; onClose: () => void }) {
  const { data: modulos } = useAdminModulos()
  const modulosActivos = modulos?.filter((m) => taller.moduloIds.includes(m.id)) ?? []

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />

      {/* Sheet */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-vs-card border-l border-vs-line shadow-2xl z-50 flex flex-col vs-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-vs-line">
          <div>
            <h2 className="text-[16px] font-semibold text-vs-ink">{taller.nombre}</h2>
            <p className="text-[12px] text-[#8a7f70]">{taller.rut}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-vs-chip flex items-center justify-center hover:bg-[#ece7e0] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">
          {/* Estado */}
          <div className="flex items-center gap-3">
            <StatusBadge label={estadoLabel(taller.estado)} tone={estadoTone(taller.estado)} dot={taller.estado === "activo"} />
            <span className="text-[12px] text-[#8a7f70]">Plan <span className="font-semibold text-vs-ink capitalize">{taller.plan}</span></span>
          </div>

          {/* Info */}
          <div className="bg-[#f7f3eb] border border-vs-line rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-start gap-3 text-[13px]">
              <MapPin size={15} className="text-[#8a7f70] shrink-0 mt-0.5" />
              <span className="text-vs-ink">{taller.direccion}</span>
            </div>
            <div className="flex items-center gap-3 text-[13px]">
              <Phone size={15} className="text-[#8a7f70] shrink-0" />
              <span className="text-vs-ink">{taller.telefono}</span>
            </div>
            <div className="flex items-center gap-3 text-[13px]">
              <Mail size={15} className="text-[#8a7f70] shrink-0" />
              <span className="text-vs-ink">{taller.email}</span>
            </div>
            <div className="flex items-center gap-3 text-[13px]">
              <Calendar size={15} className="text-[#8a7f70] shrink-0" />
              <span className="text-vs-ink">Registrado el {new Date(taller.fechaRegistro).toLocaleDateString("es-CL")}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-vs-card border border-vs-line rounded-2xl p-4">
              <div className="flex items-center gap-2 text-[11px] text-[#8a7f70] mb-1">
                <Users size={13} />
                Usuarios
              </div>
              <div className="text-[22px] font-semibold text-vs-ink font-mono">{taller.cantidadUsuarios}</div>
            </div>
            <div className="bg-vs-card border border-vs-line rounded-2xl p-4">
              <div className="flex items-center gap-2 text-[11px] text-[#8a7f70] mb-1">
                <Wrench size={13} />
                OTs este mes
              </div>
              <div className="text-[22px] font-semibold text-vs-ink font-mono">{taller.cantidadOTsMes}</div>
            </div>
          </div>

          {/* Suscripcion */}
          <div>
            <h3 className="text-[13px] font-semibold text-vs-ink mb-2">Suscripción</h3>
            <div className="bg-vs-card border border-vs-line rounded-2xl p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[#8a7f70]">Plan</span>
                <span className="font-medium text-vs-ink capitalize">{taller.plan}</span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[#8a7f70]">Próxima renovación</span>
                <span className="font-medium text-vs-ink">{new Date(taller.fechaRenovacion).toLocaleDateString("es-CL")}</span>
              </div>
            </div>
          </div>

          {/* Modulos */}
          <div>
            <h3 className="text-[13px] font-semibold text-vs-ink mb-2">Módulos activos</h3>
            <div className="flex flex-wrap gap-2">
              {modulosActivos.length > 0 ? (
                modulosActivos.map((m) => (
                  <span
                    key={m.id}
                    className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full bg-vs-violet-bg text-vs-violet"
                  >
                    <CheckCircle2 size={12} />
                    {m.nombre}
                  </span>
                ))
              ) : (
                <span className="text-[12px] text-[#8a7f70]">Sin módulos activados</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
