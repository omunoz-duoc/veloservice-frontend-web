import type { LucideIcon } from "lucide-react"

type ContactCardProps = {
  icon: LucideIcon
  label: string
  value: string
  ctaLabel: string
  href: string
}

export function ContactCard({ icon: Icon, label, value, ctaLabel, href }: ContactCardProps) {
  return (
    <div className="bg-vs-card border border-vs-line rounded-2xl p-5 flex flex-col gap-3">
      <div className="w-10 h-10 rounded-full bg-vs-chip flex items-center justify-center">
        <Icon size={18} strokeWidth={1.6} aria-hidden="true" className="text-vs-ink" />
      </div>
      <div>
        <p className="text-[13px] text-[#8a7f70]">{label}</p>
        <p className="text-[14px] font-medium mt-0.5">{value}</p>
      </div>
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className="inline-flex items-center justify-center text-[13px] font-medium border border-vs-line rounded-full px-4 py-1.5 hover:bg-vs-chip transition-colors"
      >
        {ctaLabel}
      </a>
    </div>
  )
}
