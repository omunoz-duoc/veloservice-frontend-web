"use client"

import { useState } from "react"
import { MessageCircle, Mail, Phone } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { ContactCard } from "./ContactCard"
import { TicketForm } from "./TicketForm"
import { FaqAccordion } from "./FaqAccordion"

const APP_VERSION = "1.0.0"

type Tab = "contactar" | "faq"

const CONTACT_CARDS = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+56 9 0000 0000",
    ctaLabel: "Chatear",
    href: "https://wa.me/56900000000",
  },
  {
    icon: Mail,
    label: "Email",
    value: "soporte@veloservice.cl",
    ctaLabel: "Escribir",
    href: "mailto:soporte@veloservice.cl",
  },
  {
    icon: Phone,
    label: "Teléfono",
    value: "+56 2 0000 0000",
    ctaLabel: "Llamar",
    href: "tel:+56200000000",
  },
]

export function SoportePage() {
  const [activeTab, setActiveTab] = useState<Tab>("contactar")

  return (
    <div className="p-8">
      <PageHeader
        breadcrumb={[{ label: "Ayuda" }, { label: "Soporte técnico" }]}
        title="Soporte técnico"
        subtitle="¿Necesitas ayuda? Estamos aquí para ti."
        actions={
          <span className="bg-vs-chip text-[#8a7f70] text-[12px] font-medium px-3 py-1 rounded-full">
            v{APP_VERSION}
          </span>
        }
      />

      <div role="tablist" className="flex gap-1 bg-vs-chip rounded-full p-1 w-fit mb-6">
        {(["contactar", "faq"] as const).map(tab => (
          <button
            key={tab}
            role="tab"
            id={`tab-${tab}`}
            type="button"
            aria-selected={activeTab === tab}
            aria-controls={`panel-${tab}`}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-[13px] font-medium transition-colors ${
              activeTab === tab
                ? "bg-vs-card text-vs-ink shadow-sm"
                : "text-[#8a7f70] hover:text-vs-ink"
            }`}
          >
            {tab === "contactar" ? "Contactar soporte" : "Preguntas frecuentes"}
          </button>
        ))}
      </div>

      {activeTab === "contactar" && (
        <div role="tabpanel" id="panel-contactar" aria-labelledby="tab-contactar" className="flex flex-col gap-8 max-w-2xl">
          <div className="grid grid-cols-3 gap-4">
            {CONTACT_CARDS.map(card => (
              <ContactCard key={card.label} {...card} />
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 border-t border-vs-line" />
            <span className="text-[12px] text-[#a59682]">o envía un ticket</span>
            <div className="flex-1 border-t border-vs-line" />
          </div>
          <TicketForm />
        </div>
      )}

      {activeTab === "faq" && (
        <div role="tabpanel" id="panel-faq" aria-labelledby="tab-faq" className="max-w-2xl">
          <FaqAccordion />
        </div>
      )}
    </div>
  )
}
