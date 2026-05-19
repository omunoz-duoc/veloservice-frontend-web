"use client"

import { useState } from "react"
import { PageHeader } from "@/components/common/PageHeader"
import { useAdminTalleres, useAdminModulos, useUpdateTallerModulos } from "@/features/admin/hooks/useAdmin"
import { Building2, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function ModulosPage() {
  const { data: talleres, isLoading: tLoading } = useAdminTalleres()
  const { data: modulos, isLoading: mLoading } = useAdminModulos()
  const updateModulos = useUpdateTallerModulos()

  const [selectedTallerId, setSelectedTallerId] = useState<string>("")

  const selectedTaller = talleres?.find((t) => t.id === selectedTallerId)

  const isLoading = tLoading || mLoading

  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Módulos" }]}
        title="Gestión de Módulos"
        subtitle="Activa o desactiva funcionalidades por taller"
      />

      {/* Taller selector */}
      <div className="bg-vs-card border border-vs-line rounded-[24px] p-4 mb-4">
        <label className="text-[12px] font-medium text-[#8a7f70] mb-2 block">Seleccionar taller</label>
        <div className="flex items-center gap-3">
          <div className="flex-1 max-w-md bg-vs-bg border border-vs-line rounded-[20px] flex items-center gap-3 px-4 py-2">
            <Building2 size={16} className="text-[#a59682] shrink-0" />
            <select
              value={selectedTallerId}
              onChange={(e) => setSelectedTallerId(e.target.value)}
              className="bg-transparent outline-none flex-1 text-sm text-vs-ink appearance-none cursor-pointer"
            >
              <option value="">— Selecciona un taller —</option>
              {talleres?.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre} ({t.rut})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-[13px] text-[#8a7f70] py-12 text-center">Cargando…</div>
      ) : selectedTaller ? (
        <div className="bg-vs-card border border-vs-line rounded-[24px] p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-[15px] font-semibold text-vs-ink">{selectedTaller.nombre}</h3>
              <p className="text-[12px] text-[#8a7f70]">Plan <span className="capitalize font-medium text-vs-ink">{selectedTaller.plan}</span></p>
            </div>
            <div className="text-[11px] text-[#8a7f70]">
              {selectedTaller.moduloIds.length} de {modulos?.length ?? 0} módulos activos
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {modulos?.map((mod) => {
              const isActive = selectedTaller.moduloIds.includes(mod.id)
              return (
                <div
                  key={mod.id}
                  className={cn(
                    "border rounded-2xl p-4 flex items-start gap-3 transition-colors cursor-pointer",
                    isActive
                      ? "border-vs-violet bg-vs-violet-bg/40"
                      : "border-vs-line bg-vs-card hover:bg-vs-chip/50"
                  )}
                  onClick={() => {
                    const next = isActive
                      ? selectedTaller.moduloIds.filter((id) => id !== mod.id)
                      : [...selectedTaller.moduloIds, mod.id]
                    updateModulos.mutate({ id: selectedTaller.id, moduloIds: next })
                  }}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                      isActive ? "bg-vs-violet text-white" : "bg-vs-chip text-[#8a7f70]"
                    )}
                  >
                    {isActive ? <Check size={18} /> : <X size={18} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-vs-ink">{mod.nombre}</span>
                      <span
                        className={cn(
                          "text-[10px] font-semibold px-1.5 py-0.5 rounded-full uppercase",
                          mod.categoria === "core"
                            ? "bg-vs-good-bg text-vs-good"
                            : "bg-vs-info-bg text-vs-info"
                        )}
                      >
                        {mod.categoria}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#8a7f70] mt-0.5">{mod.descripcion}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="bg-vs-card border border-vs-line rounded-[24px] p-12 text-center">
          <Building2 size={32} className="text-[#c7bba6] mx-auto mb-3" />
          <p className="text-[13px] text-[#8a7f70]">Selecciona un taller para gestionar sus módulos.</p>
        </div>
      )}
    </div>
  )
}
