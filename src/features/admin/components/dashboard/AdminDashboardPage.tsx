"use client"

import { PageHeader } from "@/components/common/PageHeader"
import { useSaasKpis, useAdminTalleres, useAdminMetrics } from "@/features/admin/hooks/useAdmin"
import { SaasKpiGrid } from "./SaasKpiGrid"
import { TalleresOverview } from "./TalleresOverview"
import { DistribucionPlanes } from "./DistribucionPlanes"
import { Sparkline } from "@/components/common/Sparkline"

export function AdminDashboardPage() {
  const { data: kpis, isLoading: kpiLoading } = useSaasKpis()
  const { data: talleres, isLoading: talleresLoading } = useAdminTalleres()
  const { data: metrics, isLoading: metricsLoading } = useAdminMetrics()

  const isLoading = kpiLoading || talleresLoading || metricsLoading

  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Dashboard" }]}
        title="Panel de Administración"
        subtitle="Visión global de la plataforma VeloService"
      />

      {isLoading ? (
        <div className="text-[13px] text-[#8a7f70] py-12 text-center">Cargando métricas…</div>
      ) : (
        <>
          {/* Row 1: KPIs SaaS */}
          {kpis && <SaasKpiGrid kpis={kpis} />}

          {/* Row 2: Talleres recientes + Distribucion */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
            <div className="lg:col-span-2">
              {talleres && <TalleresOverview talleres={talleres} />}
            </div>
            <div className="lg:col-span-1">
              {metrics && <DistribucionPlanes data={metrics.distribucionPlanes} />}
            </div>
          </div>

          {/* Row 3: MRR sparkline historico */}
          {metrics && (
            <div className="bg-vs-card border border-vs-line rounded-[24px] p-5 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[15px] font-semibold text-vs-ink">MRR histórico</h3>
                <span className="text-[11px] text-[#8a7f70]">Últimos 12 meses</span>
              </div>
              <div className="h-10">
                <Sparkline
                  data={metrics.mrrHistorico.map((d) => d.mrr / 1000)}
                  color="var(--vs-good)"
                  height={40}
                />
              </div>
              <div className="flex justify-between mt-2 text-[11px] text-[#8a7f70]">
                {metrics.mrrHistorico.map((d) => (
                  <span key={d.mes}>{d.mes}</span>
                ))}
              </div>
            </div>
          )}

          <div className="text-[11px] text-[#a59682] text-center py-4">
            VeloService Admin · v0.1.0 · Datos en tiempo real simulados
          </div>
        </>
      )}
    </div>
  )
}
