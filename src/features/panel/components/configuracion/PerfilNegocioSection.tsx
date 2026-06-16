"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Field } from "@/components/common/Field"
import { configuracionService } from "../../services/configuracion.provider"
import type { PerfilNegocio } from "../../types/configuracion.types"

const EMPTY: PerfilNegocio = { nombre: "", rut: "", direccion: "", telefono: "", email: "" }
const TALLER_QUERY_KEY = ["configuracion", "taller"] as const

type Toast = { type: "success" | "error"; message: string }

export function PerfilNegocioSection() {
  const queryClient = useQueryClient()
  const [draft, setDraft] = useState<Partial<PerfilNegocio>>({})
  const [toast, setToast] = useState<Toast | null>(null)

  const tallerQuery = useQuery({
    queryKey: TALLER_QUERY_KEY,
    queryFn: () => configuracionService.getPerfilNegocio(),
  })

  const guardarTaller = useMutation({
    mutationFn: (data: PerfilNegocio) => configuracionService.guardarPerfilNegocio(data),
    onSuccess: () => {
      setDraft({})
      void queryClient.invalidateQueries({ queryKey: TALLER_QUERY_KEY })
      showToast("success", "Cambios guardados correctamente")
    },
    onError: () => {
      showToast("error", "Error al guardar los cambios")
    },
  })

  const form: PerfilNegocio = { ...EMPTY, ...(tallerQuery.data ?? {}), ...draft }

  function set<K extends keyof PerfilNegocio>(key: K, value: string) {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  function showToast(type: Toast["type"], message: string) {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    guardarTaller.mutate(form)
  }

  return (
    <div className="min-w-0">
      <h2 className="text-xl font-bold text-[#0f1114]">Perfil del negocio</h2>
      <p className="text-sm text-[#8a7f70] mt-1 mb-6">Informacion de tu taller</p>

      {tallerQuery.isError && (
        <div className="mb-4 max-w-lg rounded-lg bg-[#fff4ee] px-4 py-3 text-sm font-medium text-[#c85a2a]">
          No se pudieron cargar los datos del taller.
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-lg min-w-0 space-y-4">
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
            Direccion
          </label>
          <div className="bg-[#f7f3eb] border border-vs-line-2 rounded-[14px] px-[14px] py-3 flex items-center gap-2.5 opacity-70">
            <input
              id="direccion"
              type="text"
              placeholder="No disponible en datos de taller"
              value={form.direccion}
              disabled
              className="bg-transparent outline-none flex-1 text-[14px] text-vs-ink placeholder:text-[#a59682] min-w-0"
            />
          </div>
          <p className="mt-1 text-xs text-[#8a7f70]">
            La direccion pertenece a sucursales y no se guarda en el perfil del taller.
          </p>
        </div>

        <div>
          <label htmlFor="telefono" className="block text-sm font-medium text-[#0f1114] mb-1">
            Telefono
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
            Proximamente
          </div>
        </div>

        <button
          type="submit"
          disabled={guardarTaller.isPending || tallerQuery.isLoading}
          className="bg-[#2d2926] text-white px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {guardarTaller.isPending ? "Guardando..." : "Guardar cambios"}
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
