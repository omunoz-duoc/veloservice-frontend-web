"use client"

import { useState, useEffect } from "react"
import { Field } from "@/components/common/Field"
import { getApiErrorMessage } from "@/lib/api/api-error"
import { configuracionService } from "../../services/configuracion.provider"
import type { MiPerfil } from "../../types/configuracion.types"

type Toast = { type: "success" | "error"; message: string }

export function MiPerfilSection() {
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [savingPerfil, setSavingPerfil] = useState(false)

  const [pwActual, setPwActual] = useState("")
  const [pwNueva, setPwNueva] = useState("")
  const [pwConfirm, setPwConfirm] = useState("")
  const [savingPw, setSavingPw] = useState(false)

  const [toast, setToast] = useState<Toast | null>(null)

  useEffect(() => {
    configuracionService.getMiPerfil().then((p: MiPerfil) => {
      setNombre(p.nombre)
      setEmail(p.email)
    })
  }, [])

  function showToast(type: Toast["type"], message: string) {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  async function handleGuardarPerfil(e: React.FormEvent) {
    e.preventDefault()
    setSavingPerfil(true)
    try {
      await configuracionService.guardarMiPerfil({ nombre })
      showToast("success", "Perfil actualizado")
    } catch {
      showToast("error", "Error al guardar")
    } finally {
      setSavingPerfil(false)
    }
  }

  async function handleCambiarPassword(e: React.FormEvent) {
    e.preventDefault()
    if (pwNueva !== pwConfirm) {
      showToast("error", "Las contraseñas no coinciden")
      return
    }
    setSavingPw(true)
    try {
      await configuracionService.cambiarPassword(pwActual, pwNueva)
      showToast("success", "Contraseña actualizada")
      setPwActual("")
      setPwNueva("")
      setPwConfirm("")
    } catch (err) {
      showToast("error", getApiErrorMessage(err) ?? "Error al cambiar contraseña")
    } finally {
      setSavingPw(false)
    }
  }

  return (
    <div className="max-w-lg min-w-0 space-y-10">
      <div>
        <h2 className="text-xl font-bold text-[#0f1114]">Mi perfil</h2>
        <p className="text-sm text-[#8a7f70] mt-1 mb-6">Tus datos personales</p>

        <form onSubmit={handleGuardarPerfil} className="space-y-4">
          <div>
            <label htmlFor="mi-nombre" className="block text-sm font-medium text-[#0f1114] mb-1">
              Nombre
            </label>
            <Field id="mi-nombre" placeholder="Tu nombre" value={nombre} onChange={setNombre} />
          </div>

          <div>
            <label htmlFor="mi-email" className="block text-sm font-medium text-[#0f1114] mb-1">
              Email
            </label>
            <Field
              id="mi-email"
              type="email"
              value={email}
              onChange={() => {}}
              hint="El email no se puede cambiar desde aquí"
            />
          </div>

          <button
            type="submit"
            disabled={savingPerfil}
            className="bg-[#2d2926] text-white px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {savingPerfil ? "Guardando…" : "Guardar cambios"}
          </button>
        </form>
      </div>

      <div>
        <h3 className="text-base font-semibold text-[#0f1114] mb-1">Cambiar contraseña</h3>
        <p className="text-sm text-[#8a7f70] mb-4">Actualiza tu contraseña con tu clave actual.</p>

        <form onSubmit={handleCambiarPassword} className="space-y-4">
          <div>
            <label htmlFor="pw-actual" className="block text-sm font-medium text-[#0f1114] mb-1">
              Contraseña actual
            </label>
            <Field id="pw-actual" type="password" placeholder="••••••••" value={pwActual} onChange={setPwActual} />
          </div>

          <div>
            <label htmlFor="pw-nueva" className="block text-sm font-medium text-[#0f1114] mb-1">
              Nueva contraseña
            </label>
            <Field id="pw-nueva" type="password" placeholder="••••••••" value={pwNueva} onChange={setPwNueva} />
          </div>

          <div>
            <label htmlFor="pw-confirm" className="block text-sm font-medium text-[#0f1114] mb-1">
              Confirmar contraseña
            </label>
            <Field id="pw-confirm" type="password" placeholder="••••••••" value={pwConfirm} onChange={setPwConfirm} />
          </div>

          <button
            type="submit"
            disabled={savingPw}
            className="bg-[#2d2926] text-white px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {savingPw ? "Guardando…" : "Cambiar contraseña"}
          </button>
        </form>
      </div>

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
