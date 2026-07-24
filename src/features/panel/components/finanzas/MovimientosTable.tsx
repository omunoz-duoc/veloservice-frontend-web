"use client"

import { useState } from "react"
import { TrendingDown, TrendingUp } from "lucide-react"
import { useMovimientos } from "@/features/panel/hooks/useMovimientos"
import { formatCLP } from "@/lib/format/currency"

type Filtro = "all" | "ingreso" | "egreso"

const FILTROS: { k: Filtro; l: string }[] = [
  { k: "all", l: "Todos" },
  { k: "ingreso", l: "Ingresos" },
  { k: "egreso", l: "Egresos" },
]

const COLUMNS = ["Comprobante", "Fecha", "Tipo", "Descripción", "Cliente / Proveedor", "Método"]

export function MovimientosTable() {
  const { data, isLoading, isError } = useMovimientos()
  const [filtro, setFiltro] = useState<Filtro>("all")

  const movimientos = data ?? []
  const filtrados = movimientos.filter(m => (filtro === "all" ? true : m.tipo === filtro))

  return (
    <div className="min-w-0 rounded-[24px] border border-vs-line bg-vs-card p-3">
      <div className="mb-3 flex flex-wrap items-center gap-2 px-2 pt-2">
        <h3 className="mr-3 text-[15px] font-semibold tracking-tight">Movimientos recientes</h3>
        <div className="flex gap-1 rounded-full bg-vs-chip p-1">
          {FILTROS.map(f => (
            <button
              key={f.k}
              onClick={() => setFiltro(f.k)}
              className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition-all ${
                filtro === f.k ? "bg-white text-vs-ink shadow-sm" : "text-[#8a7f70] hover:text-vs-ink"
              }`}
            >
              {f.l}
            </button>
          ))}
        </div>
      </div>

      {isLoading && <div className="m-2 h-[220px] rounded-[18px] bg-vs-chip animate-pulse" />}
      {isError && (
        <div className="flex h-[120px] items-center justify-center text-[12px] text-vs-warn">
          No se pudieron cargar los movimientos.
        </div>
      )}

      {!isLoading && !isError && (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-t border-vs-line border-t-vs-line-2 bg-[#faf6f0]">
                {COLUMNS.map(h => (
                  <th key={h} className="whitespace-nowrap px-4 py-3 text-[11px] font-medium uppercase tracking-widest text-[#a59682]">
                    {h}
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-[11px] font-medium uppercase tracking-widest text-[#a59682]">
                  Monto
                </th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={COLUMNS.length + 1} className="px-4 py-8 text-center text-[12px] text-[#8a7f70]">
                    Sin movimientos para este filtro.
                  </td>
                </tr>
              )}
              {filtrados.map(m => (
                <tr key={m.id} className="border-b border-vs-line-2 transition-colors hover:bg-[#faf7f1]">
                  <td className="px-4 py-3 font-mono text-[12px] font-semibold">{m.id}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-[12px] text-[#4a4438]">{m.fecha}</td>
                  <td className="px-4 py-3">
                    {m.tipo === "ingreso" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-vs-good-bg px-2 py-0.5 text-[11px] font-semibold text-vs-good">
                        <TrendingUp size={11} strokeWidth={2} />Ingreso
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-vs-warn-bg px-2 py-0.5 text-[11px] font-semibold text-vs-warn">
                        <TrendingDown size={11} strokeWidth={2} />Egreso
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[12.5px] font-medium">{m.descripcion}</td>
                  <td className="px-4 py-3 text-[12.5px]">{m.contraparte}</td>
                  <td className="px-4 py-3 text-[11.5px] text-[#4a4438]">{m.medio}</td>
                  <td className={`px-4 py-3 text-right font-mono text-[13px] font-semibold ${m.tipo === "ingreso" ? "text-vs-good" : "text-vs-warn"}`}>
                    {m.tipo === "ingreso" ? "+" : "−"} {formatCLP(m.monto)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="mt-1 flex items-center gap-3 border-t border-vs-line-2 px-4 py-3 text-[12px] text-[#8a7f70]">
          Mostrando <b className="font-mono text-vs-ink">{filtrados.length}</b> de{" "}
          <b className="font-mono text-vs-ink">{movimientos.length}</b> movimientos
        </div>
      )}
    </div>
  )
}
