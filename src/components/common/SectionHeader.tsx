import type { ReactNode } from "react"

type SectionHeaderProps = {
  overline: string
  title: string
  right?: ReactNode
}

export function SectionHeader({ overline, title, right }: SectionHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <div className="text-[11px] uppercase tracking-widest text-[#a59682] mb-1">
          {overline}
        </div>
        <h2 className="text-[17px] font-semibold">{title}</h2>
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  )
}
