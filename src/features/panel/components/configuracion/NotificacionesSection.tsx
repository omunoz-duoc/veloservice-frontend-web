"use client"

import { useState, useEffect } from "react"
import { configuracionService } from "../../services/configuracion.provider"
import type { NotifConfig } from "../../types/configuracion.types"

type Toast = { type: "success" | "error"; message: string }

const NOTIF_LABELS: { key: keyof NotifConfig; label: string; description: string }[] = [
  { key: "otCreada", label: "OT creada", description: "Cuando se registra una nueva orden de trabajo" },
  { key: "otCompletada", label: "OT completada", description: "Cuando una orden pasa a estado Completada" },
  { key: "otVencida", label: "OT vencida", description: "Cuando una orden supera su fecha límite" },
  { key: "stockBajo", label: "Stock bajo", description: "Cuando un producto cae bajo el mínimo de inventario" },
  { key: "nuevoCliente", label: "Nuevo cliente", description: "Cuando se registra un cliente nuevo" },
]

const EMPTY: NotifConfig = {
  otCreada: false,
  otCompletada: false,
  otVencida: false,
  stockBajo: false,
  nuevoCliente: false,
}

export function NotificacionesSection() {
  const [config, setConfig] = useState<NotifConfig>(EMPTY)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)

  useEffect(() => {
    configuracionService.getNotifConfig().then(setConfig)
  }, [])

  function toggle(key: keyof NotifConfig) {
    setConfig((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  function showToast(type: Toast["type"], message: string) {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await configuracionService.guardarNotifConfig(config)
      showToast("success", "Preferencias guardadas")
    } catch {
      showToast("error", "Error al guardar preferencias")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-[#0f1114]">Notificaciones</h2>
      <p className="text-sm text-[#8a7f70] mt-1 mb-6">Elige qué eventos generan una notificación</p>

      <form onSubmit={handleSubmit} className="max-w-lg space-y-1">
        {NOTIF_LABELS.map(({ key, label, description }) => (
          <label
            key={key}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#f7f3eb] cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={config[key]}
              onChange={() => toggle(key)}
              className="mt-0.5 accent-[#2d2926] w-4 h-4 shrink-0"
            />
            <div>
              <div className="text-sm font-medium text-[#0f1114]">{label}</div>
              <div className="text-xs text-[#8a7f70]">{description}</div>
            </div>
          </label>
        ))}

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#2d2926] text-white px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Guardando…" : "Guardar preferencias"}
          </button>
        </div>
      </form>

      {toast && (
        <div
          role="status"
          className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg shadow-lg text-white text-sm z-50 ${
            toast.type === "success" ? "bg-green-600" : "bg-[#c85a2a]"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  )
}
