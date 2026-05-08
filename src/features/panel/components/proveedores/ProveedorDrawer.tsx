"use client"

import { X, Plus, Phone, Mail, MapPin, Users, Star, Building2 } from "lucide-react"
import {
  ESTADOS, fmt,
  type Proveedor, type OrdenCompra,
} from "./proveedores.mock"

function InfoBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-vs-chip rounded-xl p-2.5 flex items-center gap-2.5 border border-vs-line-2">
      <span className="text-[#8a7f70]">{icon}</span>
      <div className="min-w-0">
        <div className="text-[10px] text-[#a59682] uppercase tracking-widest">{label}</div>
        <div className="text-[12.5px] font-medium truncate">{value}</div>
      </div>
    </div>
  )
}

function StatBox({ label, value, sub }: { label: string; value: React.ReactNode; sub: React.ReactNode }) {
  return (
    <div className="bg-vs-chip rounded-xl p-3 border border-vs-line-2">
      <div className="text-[10.5px] text-[#8a7f70]">{label}</div>
      <div className="text-[16px] font-semibold leading-tight">{value}</div>
      <div className="text-[10.5px] text-[#a59682] truncate">{sub}</div>
    </div>
  )
}

export function ProveedorDrawer({
  prov,
  ocs,
  onClose,
}: {
  prov: Proveedor
  ocs: OrdenCompra[]
  onClose: () => void
}) {
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(prov.rating))
  const ocsProv = ocs.filter(o => o.prov === prov.id)

  return (
    <div className="fixed inset-0 z-50 flex vs-fade-in">
      <div onClick={onClose} className="flex-1 bg-black/30 backdrop-blur-sm" />

      <div className="w-[560px] bg-vs-bg h-full overflow-y-auto flex flex-col vs-slide-in-right">
        <div className="bg-vs-card border border-vs-line rounded-[24px] m-3 mb-0">
          {/* Header */}
          <div className="flex items-center gap-3 p-5 border-b border-vs-line-2">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-vs-info-bg text-vs-info shrink-0">
              <Building2 size={20} strokeWidth={1.6} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-[#8a7f70] uppercase tracking-widest">
                Proveedor · <span className="font-mono">{prov.id}</span>
              </div>
              <div className="text-[15px] font-semibold truncate">{prov.nombre}</div>
            </div>
            {prov.activo
              ? <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-vs-good-bg text-vs-good">ACTIVO</span>
              : <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-vs-warn-bg text-vs-warn">INACTIVO</span>
            }
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-vs-chip hover:bg-[#ebe3d6] flex items-center justify-center active:scale-90 transition-all duration-150 shrink-0"
            >
              <X size={16} strokeWidth={1.6} />
            </button>
          </div>

          <div className="p-5 space-y-4">
            {/* Contact grid */}
            <div className="grid grid-cols-2 gap-2">
              <InfoBox icon={<Phone size={14} strokeWidth={1.6} />} label="Teléfono" value={prov.tel} />
              <InfoBox icon={<Mail size={14} strokeWidth={1.6} />} label="Email" value={prov.mail} />
              <InfoBox icon={<Users size={14} strokeWidth={1.6} />} label="Contacto" value={prov.contacto} />
              <InfoBox icon={<MapPin size={14} strokeWidth={1.6} />} label="Ciudad" value={prov.ciudad} />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <StatBox label="Plazo entrega" value={`${prov.plazo} días`} sub="promedio" />
              <StatBox
                label="Rating"
                value={prov.rating.toFixed(1)}
                sub={
                  <div className="flex gap-0.5 mt-0.5">
                    {stars.map((on, i) => (
                      <Star
                        key={i}
                        size={10}
                        strokeWidth={1.5}
                        className={on ? "text-[#a07910] fill-[#a07910]" : "text-[#d9d3c6]"}
                      />
                    ))}
                  </div>
                }
              />
              <StatBox label="OCs últ. 90d" value={prov.ots90} sub={fmt(prov.total90)} />
            </div>

            {/* Rubro + marcas */}
            <div>
              <div className="text-[11px] text-[#8a7f70] mb-1.5">Rubro</div>
              <div className="text-[12.5px] font-medium mb-2">{prov.rubro}</div>
              <div className="flex flex-wrap gap-1.5">
                {prov.marcas.map(m => (
                  <span key={m} className="bg-vs-chip px-2.5 py-1 rounded-full text-[11px] font-medium">{m}</span>
                ))}
              </div>
            </div>

            {/* OC history */}
            <div>
              <div className="text-[11px] text-[#8a7f70] mb-2">Últimas órdenes de compra</div>
              <div className="space-y-1.5">
                {ocsProv.slice(0, 4).map(oc => {
                  const e = ESTADOS[oc.estado]
                  return (
                    <div key={oc.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-vs-chip vs-scale-in">
                      <span className="font-mono font-semibold text-[12px]">{oc.id}</span>
                      <span className="text-[11.5px] text-[#8a7f70]">{oc.fecha}</span>
                      <span
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: e.bg, color: e.fg }}
                      >
                        {e.label}
                      </span>
                      <div className="flex-1" />
                      <span className="font-mono font-semibold text-[12px]">{fmt(oc.total)}</span>
                    </div>
                  )
                })}
                {ocsProv.length === 0 && (
                  <div className="text-[12px] text-[#8a7f70] italic">Sin órdenes registradas.</div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-vs-line-2 flex gap-2">
              <button className="flex items-center gap-1.5 bg-vs-chip text-vs-ink px-4 py-2 rounded-full text-[12px] font-medium hover:bg-[#ebe3d6] active:scale-95 transition-all duration-150">
                Editar proveedor
              </button>
              <div className="flex-1" />
              <button className="flex items-center gap-2 bg-vs-ink text-white px-4 py-2 rounded-full text-[12.5px] font-semibold hover:bg-[#1e2228] active:scale-95 transition-all duration-150">
                <Plus size={14} strokeWidth={2} />
                Crear OC para este proveedor
              </button>
            </div>
          </div>
        </div>
        <div className="h-5" />
      </div>
    </div>
  )
}
