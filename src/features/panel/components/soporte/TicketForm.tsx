"use client"

import { useState } from "react"
import { CheckCircle2 } from "lucide-react"

export function TicketForm() {
  const [asunto, setAsunto] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!asunto.trim() || !mensaje.trim()) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex items-center gap-3 bg-vs-good-bg border border-vs-good rounded-2xl px-5 py-4 text-[14px] text-vs-good">
        <CheckCircle2 size={18} strokeWidth={1.6} aria-hidden="true" />
        <span>Tu mensaje fue enviado. Te contactaremos pronto.</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="asunto" className="text-[13px] font-medium">
          Asunto
        </label>
        <input
          id="asunto"
          type="text"
          required
          value={asunto}
          onChange={e => setAsunto(e.target.value)}
          className="border border-vs-line rounded-xl px-3.5 py-2.5 text-[14px] bg-vs-card focus:outline-none focus:ring-2 focus:ring-vs-violet/30"
          placeholder="¿En qué podemos ayudarte?"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="mensaje" className="text-[13px] font-medium">
          Mensaje
        </label>
        <textarea
          id="mensaje"
          rows={4}
          required
          value={mensaje}
          onChange={e => setMensaje(e.target.value)}
          className="border border-vs-line rounded-xl px-3.5 py-2.5 text-[14px] bg-vs-card focus:outline-none focus:ring-2 focus:ring-vs-violet/30 resize-none"
          placeholder="Describe el problema o consulta con detalle..."
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-2 bg-vs-ink text-white text-[13px] font-medium rounded-full px-5 py-2.5 hover:bg-[#2a2e33] transition-colors"
        >
          Enviar ticket →
        </button>
      </div>
    </form>
  )
}
