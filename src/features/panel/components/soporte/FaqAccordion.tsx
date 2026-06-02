"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

type FaqItem = { id: string; q: string; a: string }
type FaqCategory = { label: string; items: FaqItem[] }

const FAQ_DATA: FaqCategory[] = [
  {
    label: "General",
    items: [
      {
        id: "cambiar-password",
        q: "¿Cómo cambio mi contraseña?",
        a: "Ve a tu perfil de usuario haciendo clic en tu nombre en la parte inferior del menú lateral. Desde ahí puedes actualizar tu contraseña.",
      },
      {
        id: "nuevo-usuario",
        q: "¿Cómo agrego un nuevo usuario al sistema?",
        a: "Solo los administradores pueden agregar usuarios. Ve a Sistema → Roles y usa el botón 'Nuevo usuario'.",
      },
    ],
  },
  {
    label: "Órdenes de trabajo",
    items: [
      {
        id: "crear-orden",
        q: "¿Cómo creo una nueva orden de trabajo?",
        a: "En la página Órdenes, haz clic en el botón 'Nueva orden' y completa los datos del cliente, tipo de servicio y mecánico asignado.",
      },
      {
        id: "cambiar-estado",
        q: "¿Cómo cambio el estado de una orden?",
        a: "Abre la orden y usa el selector de estado en la esquina superior derecha, o arrastra la tarjeta en la vista Kanban.",
      },
      {
        id: "reasignar-mecanico",
        q: "¿Puedo reasignar una orden a otro mecánico?",
        a: "Sí. Abre la orden y selecciona un nuevo mecánico en el campo 'Asignado a'. El cambio se guarda automáticamente.",
      },
      {
        id: "seleccion-masiva",
        q: "¿Cómo uso la selección masiva de órdenes?",
        a: "Activa las casillas de selección en la lista de órdenes, selecciona las que necesites, y aparecerá una barra de acciones en la parte inferior para cambiar estado o reasignar en lote.",
      },
    ],
  },
  {
    label: "Clientes",
    items: [
      {
        id: "nuevo-cliente",
        q: "¿Cómo registro un nuevo cliente?",
        a: "Ve a la página Clientes y haz clic en 'Nuevo cliente'. Ingresa el nombre, RUT y datos de contacto.",
      },
      {
        id: "historial-cliente",
        q: "¿Cómo busco el historial de un cliente?",
        a: "En Clientes, busca al cliente por nombre o RUT y haz clic en su nombre para ver todas sus órdenes anteriores.",
      },
    ],
  },
  {
    label: "Inventario",
    items: [
      {
        id: "recibir-stock",
        q: "¿Cómo recibo nuevo stock?",
        a: "En Inventario, selecciona el ítem y usa el botón 'Agregar stock'. Ingresa la cantidad recibida y el sistema actualiza el total.",
      },
      {
        id: "stock-bajo",
        q: "¿Qué significa el aviso de stock bajo?",
        a: "Aparece cuando un ítem tiene menos unidades que el mínimo configurado. Ve a Inventario → editar ítem para ajustar el umbral.",
      },
    ],
  },
]

export function FaqAccordion() {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())

  function toggle(id: string) {
    setOpenIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {FAQ_DATA.map(category => (
        <div key={category.label}>
          <h3 className="text-[13px] font-semibold text-[#8a7f70] uppercase tracking-wide mb-3">
            {category.label}
          </h3>
          <div className="bg-vs-card border border-vs-line rounded-2xl divide-y divide-vs-line overflow-hidden">
            {category.items.map(item => (
              <div key={item.id}>
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-expanded={openIds.has(item.id)}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-left text-[14px] font-medium hover:bg-vs-chip transition-colors"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    size={16}
                    strokeWidth={1.8}
                    aria-hidden="true"
                    className={`shrink-0 ml-4 transition-transform text-[#a59682] ${openIds.has(item.id) ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  hidden={!openIds.has(item.id)}
                  className="px-5 pb-4 text-[13px] text-[#8a7f70] leading-relaxed"
                >
                  {item.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
