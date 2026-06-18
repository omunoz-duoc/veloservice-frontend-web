"use client"

import { PageHeader } from "@/components/common/PageHeader"
import { useSaasKpis, useAdminMetrics } from "@/features/admin/hooks/useAdmin"
import { KpiCard } from "@/components/common/KpiCard"
import { Sparkline } from "@/components/common/Sparkline"
import {
  Building2,
  TrendingUp,
  TrendingDown,
  BarChart3,
} from "lucide-react"
import { DistribucionPlanes } from "../dashboard/DistribucionPlanes"
import type { MetricasSaaSDetalle } from "../../services/admin.types"

export function MetricsPage() {
  const { data: kpis, isLoading: kpiLoading } = useSaasKpis()
  const { data: metrics, isLoading: metricsLoading } = useAdminMetrics()

  const isLoading = kpiLoading || metricsLoading
  const hasHistoricalMetrics = Boolean(
    metrics &&
      (metrics.mrrHistorico.length > 0 ||
        metrics.nuevosTalleresHistorico.length > 0 ||
        metrics.churnHistorico.length > 0),
  )

  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Metricas SaaS" }]}
        title="Metricas SaaS"
        subtitle="Analisis detallado del crecimiento de la plataforma"
      />

      {isLoading ? (
        <div className="text-[13px] text-[#8a7f70] py-12 text-center">Cargando metricas...</div>
      ) : (
        <>
          {kpis && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
              <KpiCard
                title="Total Talleres"
                value={kpis.totalTalleres.toString()}
                delta={`${kpis.talleresActivos} activos`}
                trend="up"
                sub="Registrados en la plataforma"
                accent="ink"
                icon={Building2}
              />
              <KpiCard
                title="MRR Total"
                value={`$${(kpis.mrrTotal / 1000).toFixed(0)}k`}
                delta={kpis.mrrDelta}
                trend="up"
                sub="Ingreso recurrente mensual"
                accent="good"
                icon={TrendingUp}
              />
              <KpiCard
                title="Churn Rate"
                value={kpis.churnRate}
                delta={`${kpis.trialToPaidRate} trial a paid`}
                trend="warn"
                sub="Tasa de cancelacion mensual"
                accent="warn"
                icon={TrendingDown}
              />
              <KpiCard
                title="Talleres Nuevos (Mes)"
                value={kpis.talleresNuevosMes.toString()}
                delta="Este mes"
                trend="up"
                sub="Registros en el mes actual"
                accent="violet"
                icon={BarChart3}
              />
            </div>
          )}

          {metrics && !hasHistoricalMetrics && (
            <div className="bg-vs-card border border-vs-line rounded-[24px] p-5 mb-4">
              <p className="text-[13px] text-[#8a7f70]">
                Metricas historicas pendientes de implementacion
              </p>
            </div>
          )}

          {metrics && hasHistoricalMetrics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              {metrics.mrrHistorico.length > 0 && (
                <div className="bg-vs-card border border-vs-line rounded-[24px] p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[15px] font-semibold text-vs-ink">MRR historico</h3>
                    <span className="text-[11px] text-[#8a7f70]">CLP miles</span>
                  </div>
                  <div className="h-32">
                    <Sparkline
                      data={metrics.mrrHistorico.map((d) => d.mrr / 1000)}
                      color="var(--vs-good)"
                      height={128}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-[11px] text-[#8a7f70]">
                    {metrics.mrrHistorico.map((d) => (
                      <span key={d.mes}>{d.mes}</span>
                    ))}
                  </div>
                </div>
              )}

              {metrics.nuevosTalleresHistorico.length > 0 && (
                <div className="bg-vs-card border border-vs-line rounded-[24px] p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[15px] font-semibold text-vs-ink">Nuevos talleres</h3>
                    <span className="text-[11px] text-[#8a7f70]">Por mes</span>
                  </div>
                  <div className="h-32">
                    <Sparkline
                      data={metrics.nuevosTalleresHistorico.map((d) => d.count)}
                      color="var(--vs-violet)"
                      height={128}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-[11px] text-[#8a7f70]">
                    {metrics.nuevosTalleresHistorico.map((d) => (
                      <span key={d.mes}>{d.mes}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {metrics && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
              <div className="lg:col-span-1">
                <DistribucionPlanes data={metrics.distribucionPlanes} />
              </div>

              {metrics.churnHistorico.length > 0 ? (
                <div className="lg:col-span-2 bg-vs-card border border-vs-line rounded-[24px] p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-[15px] font-semibold text-vs-ink">Churn historico</h3>
                    <span className="text-[11px] text-[#8a7f70]">Porcentaje mensual</span>
                  </div>
                  <div className="h-32">
                    <Sparkline
                      data={metrics.churnHistorico.map((d) => d.rate)}
                      color="var(--vs-warn)"
                      height={128}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-[11px] text-[#8a7f70]">
                    {metrics.churnHistorico.map((d) => (
                      <span key={d.mes}>{d.mes}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ConteosPorTallerCard title="Usuarios por taller" data={metrics.usuariosPorTaller} />
                  <ConteosPorTallerCard title="Clientes por taller" data={metrics.clientesPorTaller} />
                </div>
              )}
            </div>
          )}

          {metrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <ConteosPorTallerCard title="Sucursales por taller" data={metrics.sucursalesPorTaller} />
              <ConteosPorTallerCard title="Ordenes por taller" data={metrics.ordenesPorTaller} />
            </div>
          )}

          <div className="text-[11px] text-[#a59682] text-center py-4">
            VeloService Admin · v0.1.0 · Datos reales disponibles
          </div>
        </>
      )}
    </div>
  )
}

function ConteosPorTallerCard({
  title,
  data,
}: {
  title: string
  data: MetricasSaaSDetalle["usuariosPorTaller"]
}) {
  return (
    <div className="bg-vs-card border border-vs-line rounded-[24px] p-5">
      <h3 className="text-[15px] font-semibold text-vs-ink mb-3">{title}</h3>
      <div className="space-y-2">
        {data.length === 0 ? (
          <p className="text-[13px] text-[#8a7f70]">Sin datos disponibles</p>
        ) : (
          data.map((item) => (
            <div
              key={`${title}-${item.tallerNombre}`}
              className="flex items-center justify-between gap-3 text-[13px]"
            >
              <span className="min-w-0 truncate text-[#5c554d]">{item.tallerNombre}</span>
              <span className="font-mono font-semibold text-vs-ink">{item.count}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
