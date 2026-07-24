"use client"

import { useState } from "react"
import { FileSpreadsheet } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { FinanzasKpiGrid } from "./FinanzasKpiGrid"
import { IngresosVsCostosChart } from "./charts/IngresosVsCostosChart"
import { ComposicionDonut } from "./charts/ComposicionDonut"
import { TopProductosChart } from "./charts/TopProductosChart"
import { MediosPagoChart } from "./charts/MediosPagoChart"
import { MetaMensualCard } from "./MetaMensualCard"
import { MovimientosTable } from "./MovimientosTable"

const PERIODS = [
  { k: "30d", l: "30 días" },
  { k: "3m", l: "3 meses" },
  { k: "12m", l: "12 meses" },
  { k: "ytd", l: "YTD" },
] as const

type Period = (typeof PERIODS)[number]["k"]

export function FinanzasPage() {
  const [period, setPeriod] = useState<Period>("12m")

  const actions = (
    <>
      <div className="flex items-center gap-1 rounded-full bg-vs-chip p-1">
        {PERIODS.map(p => (
          <button
            key={p.k}
            onClick={() => setPeriod(p.k)}
            className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition-all ${
              period === p.k ? "bg-white text-vs-ink shadow-sm" : "text-[#8a7f70] hover:text-vs-ink"
            }`}
          >
            {p.l}
          </button>
        ))}
      </div>
      <button className="flex items-center gap-2 rounded-full bg-vs-good px-4 py-2 text-[13px] font-medium text-white transition-all duration-150 hover:opacity-90 active:scale-[0.98]">
        <FileSpreadsheet size={15} strokeWidth={1.8} />
        Exportar
      </button>
    </>
  )

  return (
    <div className="min-w-0">
      <PageHeader
        breadcrumb={[{ label: "Panel", href: "/dashboard" }, { label: "Finanzas" }]}
        title="Finanzas"
        subtitle="Dónde está el taller hoy y hacia dónde va · ingresos por órdenes y productos"
        actions={actions}
      />

      {/* Row 1: KPIs */}
      <FinanzasKpiGrid />

      {/* Row 2: flujo mensual + composición */}
      <div className="mb-4 grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="min-w-0 xl:col-span-8">
          <IngresosVsCostosChart />
        </div>
        <div className="min-w-0 xl:col-span-4">
          <ComposicionDonut />
        </div>
      </div>

      {/* Row 3: top productos + medios de pago + meta mensual */}
      <div className="mb-4 grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="min-w-0 xl:col-span-6">
          <TopProductosChart />
        </div>
        <div className="min-w-0 xl:col-span-3">
          <MediosPagoChart />
        </div>
        <div className="min-w-0 xl:col-span-3">
          <MetaMensualCard />
        </div>
      </div>

      {/* Row 4: movimientos */}
      <div className="mb-4 min-w-0">
        <MovimientosTable />
      </div>

      <div className="py-4 text-center text-[11px] text-[#a59682]">
        VeloService · v0.0.1 · Última sincronización hace 2 seg
      </div>
    </div>
  )
}
