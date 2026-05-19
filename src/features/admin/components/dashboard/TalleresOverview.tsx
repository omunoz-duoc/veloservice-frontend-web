"use client"

import type { TallerAdmin } from "@/features/admin/services/admin.types"
import { StatusBadge } from "@/components/common/StatusBadge"
import { useRouter } from "next/navigation"

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
  const map: Record<string, string> = {
    activo: "Activo",
    inactivo: "Inactivo",
    pendiente: "Pendiente",
    suspendido: "Suspendido",
    trial: "Trial",
  }
  return map[estado] ?? estado
}

export function TalleresOverview({ talleres }: { talleres: TallerAdmin[] }) {
  const router = useRouter()
  const recientes = [...talleres]
    .sort((a, b) => new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime())
    .slice(0, 5)

  return (
    <div className="bg-vs-card border border-vs-line rounded-[24px] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-semibold text-vs-ink">Talleres recientes</h3>
        <button
          onClick={() => router.push("/admin/talleres")}
          className="text-[12px] font-medium text-vs-violet hover:underline"
        >
          Ver todos
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-[11px] text-[#8a7f70] uppercase tracking-wide border-b border-vs-line">
              <th className="text-left font-medium py-2 px-3">Taller</th>
              <th className="text-left font-medium py-2 px-3">Plan</th>
              <th className="text-left font-medium py-2 px-3">Estado</th>
              <th className="text-right font-medium py-2 px-3">Usuarios</th>
            </tr>
          </thead>
          <tbody>
            {recientes.map((t) => (
              <tr
                key={t.id}
                className="border-b border-vs-line/60 last:border-b-0 hover:bg-vs-chip/50 transition-colors cursor-pointer"
                onClick={() => router.push(`/admin/talleres`)}
              >
                <td className="py-2.5 px-3">
                  <div className="font-medium text-vs-ink">{t.nombre}</div>
                  <div className="text-[11px] text-[#8a7f70]">{t.rut}</div>
                </td>
                <td className="py-2.5 px-3">
                  <span className="capitalize font-medium text-vs-ink">{t.plan}</span>
                </td>
                <td className="py-2.5 px-3">
                  <StatusBadge label={estadoLabel(t.estado)} tone={estadoTone(t.estado)} />
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-vs-ink">
                  {t.cantidadUsuarios}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
