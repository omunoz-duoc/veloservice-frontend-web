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

export function MetricsPage() {
  const { data: kpis, isLoading: kpiLoading } = useSaasKpis()
  const { data: metrics, isLoading: metricsLoading } = useAdminMetrics()

  const isLoading = kpiLoading || metricsLoading

  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Métricas SaaS" }]}
        title="Métricas SaaS"
        subtitle="Análisis detallado del crecimiento de la plataforma"
      />

      {isLoading ? (
        <div className="text-[13px] text-[#8a7f70] py-12 text-center">Cargando métricas…</div>
      ) : (
        <>
          {/* KPIs top */}
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
                spark={[12, 14, 13, 15, 16, 18, 17, 19, 20, 22, 21, 23]}
              />
              <KpiCard
                title="MRR Total"
                value={`$${(kpis.mrrTotal / 1000).toFixed(0)}k`}
                delta={kpis.mrrDelta}
                trend="up"
                sub="Ingreso recurrente mensual"
                accent="good"
                icon={TrendingUp}
                spark={[180, 195, 210, 225, 240, 255, 270, 290, 310, 335, 360, 390]}
              />
              <KpiCard
                title="Churn Rate"
                value={kpis.churnRate}
                delta={kpis.trialToPaidRate + " trial → paid"}
                trend="warn"
                sub="Tasa de cancelación mensual"
                accent="warn"
                icon={TrendingDown}
                spark={[0, 0, 0, 4.5, 0, 2.1, 0, 3.0, 0, 1.5, 0, 2.3]}
              />
              <KpiCard
                title="Talleres Nuevos (Mes)"
                value={kpis.talleresNuevosMes.toString()}
                delta="Este mes"
                trend="up"
                sub="Registros en el mes actual"
                accent="violet"
                icon={BarChart3}
                spark={[1, 0, 1, 2, 1, 1, 2, 1, 2, 1, 2, 0]}
              />
            </div>
          )}

          {/* Charts row */}
          {metrics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              {/* MRR Historico */}
              <div className="bg-vs-card border border-vs-line rounded-[24px] p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[15px] font-semibold text-vs-ink">MRR histórico</h3>
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

              {/* Nuevos talleres */}
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
            </div>
          )}

          {/* Distribucion + Churn */}
          {metrics && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
              <div className="lg:col-span-1">
                <DistribucionPlanes data={metrics.distribucionPlanes} />
              </div>

              <div className="lg:col-span-2 bg-vs-card border border-vs-line rounded-[24px] p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[15px] font-semibold text-vs-ink">Churn histórico</h3>
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
            </div>
          )}

          <div className="text-[11px] text-[#a59682] text-center py-4">
            VeloService Admin · v0.1.0 · Datos simulados
          </div>
        </>
      )}
    </div>
  )
}
