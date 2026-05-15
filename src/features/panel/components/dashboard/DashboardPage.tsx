import { PageHeader } from "@/components/common/PageHeader"
import { KpiGrid } from "./KpiGrid"
import { OrdenesKanban } from "./OrdenesKanban"
import { UrgentesCard } from "./UrgentesCard"
import { RentabilidadPlaceholder } from "./RentabilidadPlaceholder"
import { MecanicosCard } from "./MecanicosCard"

const ACTIONS = (
  <>
    <button className="bg-vs-chip text-vs-ink px-4 py-2 rounded-full text-[13px] font-medium hover:bg-[#ebe3d6] transition-colors flex items-center gap-1.5">
      Hoy
    </button>
    <button className="bg-vs-chip text-vs-ink px-4 py-2 rounded-full text-[13px] font-medium hover:bg-[#ebe3d6] transition-colors">
      Todas las sucursales
    </button>
    <button className="bg-vs-ink text-white px-4 py-2 rounded-full text-[13px] font-medium hover:bg-[#1e2228] transition-colors">
      Exportar
    </button>
  </>
)

export function DashboardPage() {
  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "Panel", href: "/dashboard" }, { label: "Resumen del día" }]}
        title="Buenas tardes, Martín"
        subtitle="Jueves 23 de abril · Sucursal Providencia · Temporada alta"
        actions={ACTIONS}
      />

      {/* Row 1: KPIs */}
      <KpiGrid />

      {/* Row 2: Kanban + Urgentes */}
      <div className="grid grid-cols-12 gap-4 mb-4">
        <div className="col-span-8">
          <OrdenesKanban />
        </div>
        <div className="col-span-4">
          <UrgentesCard />
        </div>
      </div>

      {/* Row 3: Rentabilidad + Mecánicos */}
      <div className="grid grid-cols-12 gap-4 mb-4">
        <div className="col-span-7">
          <RentabilidadPlaceholder />
        </div>
        <div className="col-span-5">
          <MecanicosCard />
        </div>
      </div>

      <div className="text-[11px] text-[#a59682] text-center py-4">
        VeloService · v2.4.1 · Última sincronización hace 12 seg
      </div>
    </div>
  )
}
