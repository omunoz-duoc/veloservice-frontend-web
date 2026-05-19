"use client"

import { useState, useEffect } from "react"
import { Field } from "@/components/common/Field"
import { configuracionService } from "../../services/configuracion.provider"
import type { PerfilNegocio } from "../../types/configuracion.types"

const EMPTY: PerfilNegocio = { nombre: "", rut: "", direccion: "", telefono: "", email: "" }

type Toast = { type: "success" | "error"; message: string }

export function PerfilNegocioSection() {
  const [form, setForm] = useState<PerfilNegocio>(EMPTY)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)

  useEffect(() => {
    configuracionService.getPerfilNegocio().then(setForm)
  }, [])

  function set<K extends keyof PerfilNegocio>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function showToast(type: Toast["type"], message: string) {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await configuracionService.guardarPerfilNegocio(form)
      showToast("success", "Cambios guardados correctamente")
    } catch {
      showToast("error", "Error al guardar los cambios")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-[#0f1114]">Perfil del negocio</h2>
      <p className="text-sm text-[#8a7f70] mt-1 mb-6">Información de tu taller</p>

      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-[#0f1114] mb-1">
            Nombre del taller
          </label>
          <Field id="nombre" placeholder="AutoVelo" value={form.nombre} onChange={(v) => set("nombre", v)} />
        </div>

        <div>
          <label htmlFor="rut" className="block text-sm font-medium text-[#0f1114] mb-1">
            RUT
          </label>
          <Field id="rut" placeholder="76.123.456-7" value={form.rut} onChange={(v) => set("rut", v)} />
        </div>

        <div>
          <label htmlFor="direccion" className="block text-sm font-medium text-[#0f1114] mb-1">
            Dirección
          </label>
          <Field id="direccion" placeholder="Av. Providencia 1234, Santiago" value={form.direccion} onChange={(v) => set("direccion", v)} />
        </div>

        <div>
          <label htmlFor="telefono" className="block text-sm font-medium text-[#0f1114] mb-1">
            Teléfono
          </label>
          <Field id="telefono" placeholder="+56 9 1234 5678" value={form.telefono} onChange={(v) => set("telefono", v)} />
        </div>

        <div>
          <label htmlFor="email-negocio" className="block text-sm font-medium text-[#0f1114] mb-1">
            Email de contacto
          </label>
          <Field id="email-negocio" type="email" placeholder="contacto@taller.cl" value={form.email} onChange={(v) => set("email", v)} />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#0f1114] mb-1">Logo</label>
          <div className="w-24 h-24 rounded-xl border-2 border-dashed border-[#eae2d6] flex items-center justify-center text-[#a59682] text-xs text-center p-2">
            Próximamente
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#2d2926] text-white px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Guardando…" : "Guardar cambios"}
        </button>
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
