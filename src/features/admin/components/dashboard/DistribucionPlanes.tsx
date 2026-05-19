"use client"

import type { MetricasSaaSDetalle } from "@/features/admin/services/admin.types"

const PLAN_LABELS: Record<string, string> = {
  starter: "Starter",
  pro: "Pro",
  enterprise: "Enterprise",
}

const PLAN_COLORS: Record<string, string> = {
  starter: "var(--vs-info)",
  pro: "var(--vs-violet)",
  enterprise: "var(--vs-ink)",
}

export function DistribucionPlanes({ data }: { data: MetricasSaaSDetalle["distribucionPlanes"] }) {
  const total = data.reduce((s, d) => s + d.count, 0)

  return (
    <div className="bg-vs-card border border-vs-line rounded-[24px] p-5">
      <h3 className="text-[15px] font-semibold text-vs-ink mb-4">Distribución de planes</h3>

      <div className="flex flex-col gap-3">
        {data.map((d) => {
          const pct = total > 0 ? Math.round((d.count / total) * 100) : 0
          return (
            <div key={d.plan}>
              <div className="flex items-center justify-between text-[13px] mb-1">
                <span className="font-medium text-vs-ink">{PLAN_LABELS[d.plan]}</span>
                <span className="text-[#8a7f70]">
                  {d.count} <span className="text-[11px]">({pct}%)</span>
                </span>
              </div>
              <div className="h-2 rounded-full bg-vs-line-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, background: PLAN_COLORS[d.plan] }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-vs-line flex items-center justify-between text-[12px] text-[#8a7f70]">
        <span>Total</span>
        <span className="font-semibold text-vs-ink">{total} talleres</span>
      </div>
    </div>
  )
}
