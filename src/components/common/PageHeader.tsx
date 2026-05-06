import Link from "next/link"
import type { ReactNode } from "react"
import { Home } from "lucide-react"

type BreadcrumbItem = {
  label: string
  href?: string
}

type PageHeaderProps = {
  breadcrumb: BreadcrumbItem[]
  title: string
  subtitle?: string
  actions?: ReactNode
}

export function PageHeader({ breadcrumb, title, subtitle, actions }: PageHeaderProps) {
  return (
    <>
      <div className="bg-vs-card border border-vs-line rounded-[24px] inline-flex items-center gap-2 px-5 py-2.5 mb-5 text-[13px]">
        <Home size={14} className="text-[#a59682]" />
        {breadcrumb.map((item, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <span className="text-[#c7bba6]">/</span>}
            {item.href ? (
              <Link
                href={item.href}
                className="text-[#8a7f70] hover:text-vs-ink transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold">{item.label}</span>
            )}
          </span>
        ))}
      </div>

      <div className="flex items-end justify-between mb-5">
        <div>
          <h1 className="text-[26px] font-semibold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-[13px] text-[#8a7f70] mt-1">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </>
  )
}
