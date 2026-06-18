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
      <div className="mb-5 inline-flex max-w-full flex-wrap items-center gap-2 rounded-[24px] border border-vs-line bg-vs-card px-5 py-2.5 text-[13px]">
        <Home size={14} className="text-[#a59682]" />
        {breadcrumb.map((item, i) => (
          <span key={i} className="flex min-w-0 items-center gap-2">
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

      <div className="mb-5 flex min-w-0 flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-[26px] font-semibold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-[13px] text-[#8a7f70]">{subtitle}</p>
          )}
        </div>
        {actions && <div className="flex min-w-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </>
  )
}
