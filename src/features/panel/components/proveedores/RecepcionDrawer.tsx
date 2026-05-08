"use client"

import { useState } from "react"
import { X, Check, Inbox, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { fmt, DETALLE_OC, type OrdenCompra, type Proveedor } from "./proveedores.mock"

export type RecepcionResult = {
  oc: OrdenCompra
  units: number
  items: number
  total: number
}

export function RecepcionDrawer({
  oc,
  prov,
  onConfirm,
  onClose,
}: {
  oc: OrdenCompra
  prov: Proveedor
  onConfirm: (result: RecepcionResult) => void
  onClose: () => void
}) {
  const baseItems = DETALLE_OC[oc.id] ?? []
  const [recibido, setRecibido] = useState(baseItems.map(i => ({ ...i, recibido: i.solicitado })))
  const [docNum, setDocNum] = useState(oc.doc !== "—" ? oc.doc : "")
  const [obs, setObs] = useState("")

  const totalRec = recibido.reduce((a, r) => a + r.recibido * r.costo, 0)
  const allOk = recibido.every(r => r.recibido === r.solicitado)

  const setQty = (i: number, q: string) =>
    setRecibido(prev =>
      prev.map((r, k) =>
        k === i ? { ...r, recibido: Math.max(0, Math.min(r.solicitado, parseInt(q) || 0)) } : r
      )
    )

  const handleConfirm = () => {
    const units = recibido.reduce((a, r) => a + r.recibido, 0)
    onConfirm({ oc, units, items: recibido.length, total: totalRec })
  }

  return (
    <div className="fixed inset-0 z-[60] flex vs-fade-in">
      <div onClick={onClose} className="flex-1 bg-black/30 backdrop-blur-sm" />

      <div className="w-[620px] bg-vs-bg h-full overflow-y-auto flex flex-col vs-slide-in-right">
        <div className="bg-vs-card border border-vs-line rounded-[24px] m-3 mb-0">
          {/* Header */}
          <div className="flex items-center gap-3 p-5 border-b border-vs-line-2">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-vs-good-bg text-vs-good shrink-0">
              <Inbox size={20} strokeWidth={1.6} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-[#8a7f70] uppercase tracking-widest">Recepción de mercadería</div>
              <div className="text-[15px] font-semibold truncate">{oc.id} · {prov.nombre}</div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-vs-chip hover:bg-[#ebe3d6] flex items-center justify-center active:scale-90 transition-all duration-150 shrink-0"
            >
              <X size={16} strokeWidth={1.6} />
            </button>
          </div>

          <div className="p-5 space-y-5">
            {/* Info banner */}
            <div className="bg-vs-good-bg/40 border border-vs-good-bg rounded-2xl p-4 flex gap-3">
              <div className="w-8 h-8 rounded-full bg-vs-good text-white flex items-center justify-center shrink-0 mt-0.5">
                <Check size={14} strokeWidth={2.5} />
              </div>
              <div className="text-[12.5px] leading-relaxed text-[#4a4438]">
                <b>Confirmación de recepción.</b> Al confirmar, los productos aceptados se sumarán automáticamente al inventario y la OC pasará a estado <b>Recibida</b>. Esta acción no puede revertirse desde esta pantalla.
              </div>
            </div>

            {/* Doc + Fecha */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-[11px] text-[#8a7f70] mb-1.5">N° guía despacho / factura</div>
                <input
                  value={docNum}
                  onChange={e => setDocNum(e.target.value)}
                  placeholder="GD-99812455"
                  className="w-full bg-vs-chip rounded-xl px-3 py-2 text-[12.5px] font-mono outline-none border border-vs-line-2 focus:border-[#a59682] transition-colors placeholder:text-[#b8a88d]"
                />
              </div>
              <div>
                <div className="text-[11px] text-[#8a7f70] mb-1.5">Fecha de recepción</div>
                <input
                  value="24 Abr 2026 · 14:32"
                  readOnly
                  className="w-full bg-vs-chip rounded-xl px-3 py-2 text-[12.5px] font-mono outline-none border border-vs-line-2 text-[#a59682] cursor-not-allowed"
                />
              </div>
            </div>

            {/* Items table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-[11px] text-[#8a7f70] uppercase tracking-widest">Productos recibidos</div>
                <button
                  onClick={() => setRecibido(baseItems.map(i => ({ ...i, recibido: i.solicitado })))}
                  className="text-[11px] text-vs-violet font-semibold hover:underline"
                >
                  Marcar todo como recibido
                </button>
              </div>

              <div className="border border-vs-line rounded-[16px] overflow-hidden">
                <table className="w-full">
                  <thead className="bg-[#faf6f0]">
                    <tr>
                      <th className="text-left px-3 py-2 text-[10.5px] uppercase tracking-widest text-[#a59682] font-medium">Producto</th>
                      <th className="text-right px-3 py-2 text-[10.5px] uppercase tracking-widest text-[#a59682] font-medium">Pedido</th>
                      <th className="text-right px-3 py-2 text-[10.5px] uppercase tracking-widest text-[#a59682] font-medium">Recibido</th>
                      <th className="text-right px-3 py-2 text-[10.5px] uppercase tracking-widest text-[#a59682] font-medium">Costo unit.</th>
                      <th className="text-right px-3 py-2 text-[10.5px] uppercase tracking-widest text-[#a59682] font-medium">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recibido.map((r, i) => (
                      <tr key={r.sku} className="border-t border-vs-line-2">
                        <td className="px-3 py-2.5">
                          <div className="text-[12.5px] font-medium leading-tight">{r.nombre}</div>
                          <div className="font-mono text-[10.5px] text-[#a59682]">{r.sku}</div>
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-[12px]">{r.solicitado}</td>
                        <td className="px-3 py-2.5 text-right">
                          <input
                            type="number"
                            value={r.recibido}
                            onChange={e => setQty(i, e.target.value)}
                            max={r.solicitado}
                            min={0}
                            className={cn(
                              "w-16 text-right bg-vs-chip rounded-lg px-2 py-1 font-mono font-semibold text-[12px] outline-none border",
                              r.recibido === r.solicitado
                                ? "border-vs-good-bg"
                                : r.recibido === 0
                                  ? "border-vs-warn-bg"
                                  : "border-[#faecd6]"
                            )}
                          />
                        </td>
                        <td className="px-3 py-2.5 text-right font-mono text-[12px]">{fmt(r.costo)}</td>
                        <td className="px-3 py-2.5 text-right font-mono font-semibold text-[12px]">{fmt(r.recibido * r.costo)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-[#faf6f0] border-t border-vs-line">
                      <td colSpan={4} className="px-3 py-2.5 text-right text-[12px] text-[#8a7f70]">Total recibido</td>
                      <td className="px-3 py-2.5 text-right font-mono font-bold text-[14px]">{fmt(totalRec)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {!allOk && (
                <div className="text-[11.5px] text-[#a07910] mt-2 flex items-center gap-1.5">
                  <AlertTriangle size={13} strokeWidth={1.6} />
                  Recepción parcial: se generará una OC pendiente con los ítems faltantes.
                </div>
              )}
            </div>

            {/* Observations */}
            <div>
              <div className="text-[11px] text-[#8a7f70] mb-1.5">Observaciones (opcional)</div>
              <textarea
                rows={2}
                value={obs}
                onChange={e => setObs(e.target.value)}
                placeholder="Caja venía con golpe leve, contenido intacto…"
                className="w-full bg-vs-chip rounded-xl px-3 py-2 text-[12.5px] outline-none border border-vs-line-2 focus:border-[#a59682] transition-colors leading-relaxed resize-none placeholder:text-[#b8a88d]"
              />
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-vs-line-2 flex items-center gap-2">
              <button
                onClick={onClose}
                className="flex items-center gap-2 bg-vs-chip text-vs-ink px-4 py-2 rounded-full text-[13px] font-medium hover:bg-[#ebe3d6] active:scale-95 transition-all duration-150"
              >
                Cancelar
              </button>
              <div className="flex-1" />
              <button
                onClick={handleConfirm}
                className="flex items-center gap-2 bg-vs-good text-white px-5 py-2.5 rounded-full text-[13px] font-semibold hover:opacity-90 active:scale-[0.98] transition-all duration-150"
              >
                <Check size={15} strokeWidth={2.5} />
                Confirmar recepción y agregar al inventario
              </button>
            </div>
          </div>
        </div>
        <div className="h-5" />
      </div>
    </div>
  )
}
