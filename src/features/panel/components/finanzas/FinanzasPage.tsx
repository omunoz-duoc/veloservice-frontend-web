"use client"

import { useState } from "react"
import {
  TrendingUp, TrendingDown, Landmark, CreditCard, Banknote,
  ArrowLeftRight, RefreshCw, Download, FileSpreadsheet, Filter, Calendar,
} from "lucide-react"
import {
  MESES, SERIE_ING, SERIE_EGR, PREV_ING, PREV_EGR,
  ING_CATS, EGR_CATS, MOVS,
  ULT_MES_ING, ULT_MES_EGR, ULT_PREV_ING, ULT_PREV_EGR,
  TOTAL_ING, TOTAL_EGR,
  fmt, fmtMK, delta,
  type CatPie, type ToneKey,
} from "./finanzas.mock"

// ─── Sub-components ────────────────────────────────────────────────────────────

const TONE_BG: Record<ToneKey, string> = {
  good:   "bg-vs-good-bg text-vs-good",
  warn:   "bg-vs-warn-bg text-vs-warn",
  violet: "bg-[#ebe7fa] text-vs-violet",
  info:   "bg-vs-info-bg text-vs-info",
}
const TONE_COLOR: Record<ToneKey, string> = {
  good:   "#2f7d4f",
  warn:   "#c85a2a",
  violet: "#6b5bd1",
  info:   "#3a6ea5",
}

function KpiCard({
  label, value, prev, tone, icon, hint,
}: {
  label: string
  value: number
  prev: number
  tone: ToneKey
  icon: React.ReactNode
  hint: string
}) {
  const d = delta(value, prev)
  const positiveIsGood = tone === "good" || tone === "violet" || tone === "info"
  const isGood = positiveIsGood ? d.positive : !d.positive
  return (
    <div className="bg-vs-card border border-vs-line rounded-[24px] p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${TONE_BG[tone]}`}>
            {icon}
          </div>
          <div className="text-[12.5px] font-medium text-[#4a4438]">{label}</div>
        </div>
        <span className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${isGood ? "bg-vs-good-bg text-vs-good" : "bg-vs-warn-bg text-vs-warn"}`}>
          {d.positive
            ? <TrendingUp size={10} strokeWidth={2} />
            : <TrendingDown size={10} strokeWidth={2} />}
          {d.sign}{d.val}%
        </span>
      </div>
      <div className="text-[26px] font-semibold font-mono leading-none">{fmt(value)}</div>
      <div className="text-[11px] text-[#8a7f70] mt-2">{hint} · vs {fmt(prev)}</div>
    </div>
  )
}

function FlowChart({ showPrev }: { showPrev: boolean }) {
  const W = 820, H = 260, padL = 44, padR = 10, padT = 12, padB = 28
  const innerW = W - padL - padR
  const innerH = H - padT - padB
  const allVals = [...SERIE_ING, ...SERIE_EGR, ...(showPrev ? [...PREV_ING, ...PREV_EGR] : [])]
  const max = Math.ceil(Math.max(...allVals) / 2000) * 2000
  const x = (i: number) => padL + (i / (MESES.length - 1)) * innerW
  const y = (v: number) => padT + (1 - v / max) * innerH

  const linePath = (arr: number[]) =>
    arr.map((v, i) => (i ? "L" : "M") + x(i) + " " + y(v)).join(" ")
  const areaPath = (arr: number[]) =>
    linePath(arr) +
    " L" + x(arr.length - 1) + " " + (padT + innerH) +
    " L" + x(0) + " " + (padT + innerH) + " Z"

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => Math.round(max * t))

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
      <defs>
        <linearGradient id="gIng" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6b5bd1" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#6b5bd1" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="gEgr" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c85a2a" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#c85a2a" stopOpacity="0" />
        </linearGradient>
      </defs>

      {yTicks.map((t, i) => (
        <g key={i}>
          <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke="#efe9df" />
          <text x={padL - 6} y={y(t) + 3} textAnchor="end" fontSize="9" fill="#a59682" fontFamily="JetBrains Mono, monospace">
            {(t / 1000).toFixed(0)}M
          </text>
        </g>
      ))}

      {MESES.map((m, i) => (
        <text key={m} x={x(i)} y={H - 10} textAnchor="middle" fontSize="9.5" fill="#8a7f70">{m}</text>
      ))}

      {showPrev && (
        <>
          <path d={linePath(PREV_ING)} fill="none" stroke="#6b5bd1" strokeWidth="1.4" strokeDasharray="4 3" opacity="0.6" />
          <path d={linePath(PREV_EGR)} fill="none" stroke="#c85a2a" strokeWidth="1.4" strokeDasharray="4 3" opacity="0.6" />
        </>
      )}

      <path d={areaPath(SERIE_ING)} fill="url(#gIng)" />
      <path d={areaPath(SERIE_EGR)} fill="url(#gEgr)" />
      <path d={linePath(SERIE_ING)} fill="none" stroke="#6b5bd1" strokeWidth="2.2" />
      <path d={linePath(SERIE_EGR)} fill="none" stroke="#c85a2a" strokeWidth="2.2" />

      {SERIE_ING.map((v, i) => (
        <circle key={"i" + i} cx={x(i)} cy={y(v)} r="3" fill="#fff" stroke="#6b5bd1" strokeWidth="1.6" />
      ))}
      {SERIE_EGR.map((v, i) => (
        <circle key={"e" + i} cx={x(i)} cy={y(v)} r="3" fill="#fff" stroke="#c85a2a" strokeWidth="1.6" />
      ))}
    </svg>
  )
}

function Donut({ data, total }: { data: CatPie[]; total: number }) {
  const R = 68, r = 44, cx = 80, cy = 80
  const segs = data.reduce<{ path: string; color: string; acc: number }[]>((segments, d) => {
    const start = segments.at(-1)?.acc ?? 0
    const end = start + d.val
    const a1 = start * 2 * Math.PI - Math.PI / 2
    const a2 = end * 2 * Math.PI - Math.PI / 2
    const x1 = cx + R * Math.cos(a1), y1 = cy + R * Math.sin(a1)
    const x2 = cx + R * Math.cos(a2), y2 = cy + R * Math.sin(a2)
    const x3 = cx + r * Math.cos(a2), y3 = cy + r * Math.sin(a2)
    const x4 = cx + r * Math.cos(a1), y4 = cy + r * Math.sin(a1)
    const large = (end - start) > 0.5 ? 1 : 0
    const path = `M${x1} ${y1} A${R} ${R} 0 ${large} 1 ${x2} ${y2} L${x3} ${y3} A${r} ${r} 0 ${large} 0 ${x4} ${y4} Z`
    return [...segments, { path, color: d.color, acc: end }]
  }, [])
  return (
    <svg viewBox="0 0 160 160" width="160" height="160" className="shrink-0">
      {segs.map((s, i) => <path key={i} d={s.path} fill={s.color} />)}
      <text x="80" y="78" textAnchor="middle" fontSize="10" fill="#8a7f70">Total</text>
      <text x="80" y="93" textAnchor="middle" fontSize="13" fontWeight="700" fontFamily="JetBrains Mono, monospace">
        {fmtMK(total)}
      </text>
    </svg>
  )
}

function MicroStat({ label, value, sub, tone }: { label: string; value: string; sub: string; tone: ToneKey }) {
  return (
    <div className="bg-vs-chip rounded-xl p-3 border border-vs-line-2">
      <div className="text-[10.5px] text-[#8a7f70]">{label}</div>
      <div className="text-[15px] font-semibold leading-tight" style={{ color: TONE_COLOR[tone] }}>{value}</div>
      <div className="text-[10.5px] text-[#a59682] font-mono">{sub}</div>
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export function FinanzasPage() {
  const [period, setPeriod] = useState<"30d" | "3m" | "12m" | "ytd">("12m")
  const [showPrev, setShowPrev] = useState(true)
  const [movFilter, setMovFilter] = useState<"all" | "in" | "out">("all")

  const utilidad   = ULT_MES_ING - ULT_MES_EGR
  const utilPrev   = ULT_PREV_ING - ULT_PREV_EGR
  const margenN    = (utilidad / ULT_MES_ING) * 100

  const movsFiltered = MOVS.filter(m =>
    movFilter === "all" ? true : movFilter === "in" ? m.tipo === "in" : m.tipo === "out"
  )

  const PERIODS = [
    { k: "30d", l: "30 días" },
    { k: "3m",  l: "3 meses" },
    { k: "12m", l: "12 meses" },
    { k: "ytd", l: "YTD" },
  ] as const

  return (
    <div className="p-6 min-w-0">
      {/* Header */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <h1 className="text-[26px] font-semibold tracking-tight">Flujo financiero</h1>
          <p className="text-[13px] text-[#8a7f70] mt-1">
            Periodo Mayo 2025 — Abril 2026 · 12 meses · Comparado con periodo previo
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-vs-chip rounded-full p-1">
            {PERIODS.map(p => (
              <button
                key={p.k}
                onClick={() => setPeriod(p.k)}
                className={`text-[12px] px-3 py-1.5 rounded-full font-medium transition-all ${period === p.k ? "bg-white shadow-sm text-vs-ink" : "text-[#8a7f70] hover:text-vs-ink"}`}
              >
                {p.l}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 bg-vs-chip text-vs-ink px-4 py-2 rounded-full text-[12.5px] font-medium hover:bg-[#ebe3d6] transition-colors">
            <Calendar size={14} strokeWidth={1.6} className="text-[#a59682]" />
            Mayo 25 — Abr 26
          </button>
          <button className="flex items-center gap-2 bg-vs-good text-white px-4 py-2 rounded-full text-[13px] font-medium hover:opacity-90 active:scale-[0.98] transition-all duration-150">
            <FileSpreadsheet size={15} strokeWidth={1.8} />
            Exportar Excel
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        <KpiCard
          label="Ingresos del mes" value={ULT_MES_ING} prev={ULT_PREV_ING}
          tone="good" icon={<TrendingUp size={18} strokeWidth={1.6} />} hint="Abr 2026"
        />
        <KpiCard
          label="Egresos del mes" value={ULT_MES_EGR} prev={ULT_PREV_EGR}
          tone="warn" icon={<TrendingDown size={18} strokeWidth={1.6} />} hint="Abr 2026"
        />
        <KpiCard
          label="Utilidad neta" value={utilidad} prev={utilPrev}
          tone="violet" icon={<TrendingUp size={18} strokeWidth={1.6} />} hint={`Margen ${margenN.toFixed(1)}%`}
        />
        <KpiCard
          label="Saldo en caja" value={4_280_600} prev={3_980_200}
          tone="info" icon={<Landmark size={18} strokeWidth={1.6} />} hint="3 cuentas activas"
        />
      </div>

      {/* Flow chart */}
      <div className="bg-vs-card border border-vs-line rounded-[24px] p-5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-[#a59682] mb-1">Flujo mensual</div>
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6b5bd1]" />
                <span className="text-[12px] font-medium">Ingresos</span>
                <span className="text-[11.5px] font-mono text-[#8a7f70]">{fmt(TOTAL_ING)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#c85a2a]" />
                <span className="text-[12px] font-medium">Egresos</span>
                <span className="text-[11.5px] font-mono text-[#8a7f70]">{fmt(TOTAL_EGR)}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="14" height="4"><line x1="0" y1="2" x2="14" y2="2" stroke="#a59682" strokeWidth="1.5" strokeDasharray="4 2" /></svg>
                <span className="text-[12px] text-[#8a7f70]">Periodo anterior</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-[12px] text-[#4a4438] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showPrev}
                onChange={e => setShowPrev(e.target.checked)}
                className="accent-vs-ink"
              />
              Comparar con periodo anterior
            </label>
            <button className="flex items-center gap-1.5 bg-vs-chip text-vs-ink px-3 py-1.5 rounded-full text-[12px] font-medium hover:bg-[#ebe3d6] transition-colors">
              <RefreshCw size={13} strokeWidth={1.6} /> Actualizar
            </button>
            <button className="flex items-center gap-1.5 bg-vs-chip text-vs-ink px-3 py-1.5 rounded-full text-[12px] font-medium hover:bg-[#ebe3d6] transition-colors">
              <Download size={13} strokeWidth={1.6} /> PNG
            </button>
          </div>
        </div>

        <div className="h-[260px]">
          <FlowChart showPrev={showPrev} />
        </div>

        <div className="grid grid-cols-4 gap-3 mt-5 pt-4 border-t border-vs-line-2">
          <MicroStat label="Mejor mes"        value="Dic 2025"           sub={fmt(15_890_000)} tone="good"   />
          <MicroStat label="Peor mes"         value="Jun 2025"           sub={fmt(9_870_000)}  tone="warn"   />
          <MicroStat label="Margen promedio"  value={(margenN - 3).toFixed(1) + "%"} sub="12 meses" tone="violet" />
          <MicroStat label="Crecimiento YoY"  value="+19.4%"             sub="vs periodo previo" tone="good" />
        </div>
      </div>

      {/* Distribution + Payment methods */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {/* Ingresos donut */}
        <div className="bg-vs-card border border-vs-line rounded-[24px] p-5">
          <div className="text-[11px] uppercase tracking-widest text-[#a59682] mb-3">Composición de ingresos</div>
          <div className="flex items-center gap-4">
            <Donut data={ING_CATS} total={ULT_MES_ING} />
            <div className="flex-1 space-y-2 min-w-0">
              {ING_CATS.map(c => (
                <div key={c.k} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded shrink-0" style={{ background: c.color }} />
                  <span className="text-[12px] text-[#4a4438] flex-1 truncate">{c.label}</span>
                  <span className="text-[11.5px] font-mono font-semibold shrink-0">{Math.round(c.val * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Egresos donut */}
        <div className="bg-vs-card border border-vs-line rounded-[24px] p-5">
          <div className="text-[11px] uppercase tracking-widest text-[#a59682] mb-3">Composición de egresos</div>
          <div className="flex items-center gap-4">
            <Donut data={EGR_CATS} total={ULT_MES_EGR} />
            <div className="flex-1 space-y-2 min-w-0">
              {EGR_CATS.map(c => (
                <div key={c.k} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded shrink-0" style={{ background: c.color }} />
                  <span className="text-[12px] text-[#4a4438] flex-1 truncate">{c.label}</span>
                  <span className="text-[11.5px] font-mono font-semibold shrink-0">{Math.round(c.val * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment methods */}
        <div className="bg-vs-card border border-vs-line rounded-[24px] p-5">
          <div className="text-[11px] uppercase tracking-widest text-[#a59682] mb-3">Métodos de cobro · Abril</div>
          <div className="space-y-3">
            {[
              { l: "Tarjeta",       v: 0.48, n: fmt(7_113_600),  icon: <CreditCard    size={16} strokeWidth={1.6} />, color: "#6b5bd1" },
              { l: "Transferencia", v: 0.34, n: fmt(5_038_800),  icon: <ArrowLeftRight size={16} strokeWidth={1.6} />, color: "#3a6ea5" },
              { l: "Efectivo",      v: 0.18, n: fmt(2_667_600),  icon: <Banknote      size={16} strokeWidth={1.6} />, color: "#2f7d4f" },
            ].map(m => (
              <div key={m.l}>
                <div className="flex items-center gap-2 mb-1">
                  <span style={{ color: m.color }}>{m.icon}</span>
                  <span className="text-[12px] font-medium flex-1">{m.l}</span>
                  <span className="text-[11.5px] font-mono font-semibold">{m.n}</span>
                </div>
                <div className="h-1.5 rounded-full bg-vs-chip overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: (m.v * 100) + "%", background: m.color }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-vs-line-2 text-[11px] text-[#8a7f70]">
            Promedio diario: <b className="font-mono text-vs-ink">{fmt(494_000)}</b>
          </div>
        </div>
      </div>

      {/* Movements table */}
      <div className="bg-vs-card border border-vs-line rounded-[24px] p-3">
        <div className="flex items-center gap-2 mb-3 px-2 pt-2">
          <h3 className="text-[15px] font-semibold tracking-tight mr-3">Movimientos recientes</h3>
          <div className="flex gap-1 bg-vs-chip rounded-full p-1">
            {([ ["all","Todos"], ["in","Ingresos"], ["out","Egresos"] ] as const).map(([k, l]) => (
              <button
                key={k}
                onClick={() => setMovFilter(k)}
                className={`text-[12px] px-3 py-1.5 rounded-full font-medium transition-all ${movFilter === k ? "bg-white shadow-sm text-vs-ink" : "text-[#8a7f70] hover:text-vs-ink"}`}
              >
                {l}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <button className="flex items-center gap-1.5 bg-vs-chip text-vs-ink px-3 py-1.5 rounded-full text-[12px] font-medium hover:bg-[#ebe3d6] transition-colors">
            <Filter size={13} strokeWidth={1.6} /> Categoría
          </button>
          <button className="flex items-center gap-1.5 bg-vs-chip text-vs-ink px-3 py-1.5 rounded-full text-[12px] font-medium hover:bg-[#ebe3d6] transition-colors">
            <CreditCard size={13} strokeWidth={1.6} /> Método
          </button>
          <button className="flex items-center gap-1.5 bg-vs-chip text-vs-good px-3 py-1.5 rounded-full text-[12px] font-medium hover:bg-vs-good-bg transition-colors">
            <FileSpreadsheet size={13} strokeWidth={1.6} /> Exportar Excel
          </button>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="bg-[#faf6f0] border-b border-vs-line border-t border-t-vs-line-2">
              {["Comprobante","Fecha","Tipo","Descripción","Cliente / Proveedor","Método"].map(h => (
                <th key={h} className="px-4 py-3 text-[11px] uppercase tracking-widest text-[#a59682] font-medium">{h}</th>
              ))}
              <th className="px-4 py-3 text-[11px] uppercase tracking-widest text-[#a59682] font-medium text-right">Monto</th>
            </tr>
          </thead>
          <tbody>
            {movsFiltered.map(m => (
              <tr key={m.id} className="border-b border-vs-line-2 hover:bg-[#faf7f1] transition-colors">
                <td className="px-4 py-3 font-mono font-semibold text-[12px]">{m.id}</td>
                <td className="px-4 py-3 text-[12px] text-[#4a4438] font-mono whitespace-nowrap">{m.fecha}</td>
                <td className="px-4 py-3">
                  {m.tipo === "in"
                    ? <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-vs-good-bg text-vs-good">
                        <TrendingUp size={11} strokeWidth={2} />Ingreso
                      </span>
                    : <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-vs-warn-bg text-vs-warn">
                        <TrendingDown size={11} strokeWidth={2} />Egreso
                      </span>
                  }
                </td>
                <td className="px-4 py-3">
                  <div className="text-[12.5px] font-medium">{m.desc}</div>
                  <div className="text-[10.5px] text-[#a59682]">{m.cat}</div>
                </td>
                <td className="px-4 py-3 text-[12.5px]">{m.cliente}</td>
                <td className="px-4 py-3 text-[11.5px] text-[#4a4438]">{m.metodo}</td>
                <td className={`px-4 py-3 text-right font-mono font-semibold text-[13px] ${m.tipo === "in" ? "text-vs-good" : "text-vs-warn"}`}>
                  {m.tipo === "in" ? "+" : "−"} {fmt(m.monto)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center gap-3 px-4 py-3 mt-1 border-t border-vs-line-2 bg-[#faf6f0] -mx-3 -mb-3 rounded-b-[24px]">
          <div className="text-[12px] text-[#8a7f70]">
            Mostrando <b className="font-mono text-vs-ink">{movsFiltered.length}</b> de{" "}
            <b className="font-mono text-vs-ink">{MOVS.length}</b> movimientos · Total mes{" "}
            <b className="font-mono text-vs-ink">{MOVS.length}</b> registros
          </div>
          <div className="flex-1" />
          <button className="flex items-center gap-1.5 bg-vs-chip text-vs-ink px-3 py-1.5 rounded-full text-[12px] font-medium hover:bg-[#ebe3d6] transition-colors">
            Ver todos
          </button>
        </div>
      </div>

      <div className="text-[11px] text-[#a59682] text-center py-4">
        VeloService · v2.4.1 · Última sincronización hace 2 seg
      </div>
    </div>
  )
}
