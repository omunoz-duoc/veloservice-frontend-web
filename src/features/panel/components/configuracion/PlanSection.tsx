import { CheckCircle2 } from "lucide-react"
import { PLAN_INFO } from "../../services/configuracion.mock"

export function PlanSection() {
  const renovacion = new Date(PLAN_INFO.renovacion).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div>
      <h2 className="text-xl font-bold text-[#0f1114]">Plan y facturación</h2>
      <p className="text-sm text-[#8a7f70] mt-1 mb-6">Tu suscripción actual</p>

      <div className="max-w-sm border border-[#eae2d6] rounded-2xl p-6 bg-[#f7f3eb]">
        <div className="text-2xl font-bold text-[#0f1114] mb-1">Plan {PLAN_INFO.nombre}</div>

        <div className="text-2xl font-semibold text-[#0f1114] mb-1">
          ${PLAN_INFO.precio.toLocaleString("es-CL")}
          <span className="text-sm font-normal text-[#8a7f70]"> / mes</span>
        </div>

        <div className="text-xs text-[#a59682] mb-6">Renovación: {renovacion}</div>

        <ul className="space-y-2">
          {PLAN_INFO.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-[#0f1114]">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" aria-hidden="true" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
