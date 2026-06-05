"use client"

import { useState, useMemo } from "react"
import { X, Check, Plus, Mail, Phone, MapPin, User, Pencil, Bike, Trash2, Star, Copy, CheckCheck, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  TIERS, CANALES, ID_TYPES, BICIS_MOCK, fmtGastoK, avatarInitials, avatarColor,
  type Cliente, type Bicicleta, type TierKey, type CanalKey, type IdType,
} from "./clientes.mock"
import { NuevaOTModal } from "../ordenes/NuevaOTModal"
import { useInvalidateOrdenes } from "../../hooks/useOrdenes"
import type { ClienteResult } from "../ordenes/ordenes.types"
import { TIPOS_BICI } from "../ordenes/ordenes.constants"

// ─── Shared ────────────────────────────────────────────────────────────────────

function StatBox({ label, value, sub }: { label: string; value: string | number; sub: string }) {
  return (
    <div className="bg-vs-chip rounded-xl p-3 border border-vs-line-2">
      <div className="text-[10.5px] text-[#8a7f70]">{label}</div>
      <div className="text-[20px] font-semibold font-mono leading-tight">{value}</div>
      <div className="text-[10px] text-[#a59682] truncate">{sub}</div>
    </div>
  )
}

function RowInfo({ icon, label, value, mono }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start gap-3 py-1.5">
      <span className="w-8 h-8 rounded-full bg-vs-chip flex items-center justify-center text-[#8a7f70] shrink-0">{icon}</span>
      <div className="min-w-0 flex-1">
        <div className="text-[10.5px] text-[#a59682]">{label}</div>
        <div className={cn("text-[13px] truncate", mono ? "font-mono font-semibold" : "font-medium")}>{value}</div>
      </div>
    </div>
  )
}

function FInput({
  value, onChange, placeholder, type = "text", mono, readOnly, error,
}: {
  value: string; onChange?: (v: string) => void
  placeholder?: string; type?: string; mono?: boolean; readOnly?: boolean; error?: boolean
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange?.(e.target.value)}
      placeholder={placeholder}
      readOnly={readOnly}
      className={cn(
        "w-full bg-vs-chip rounded-xl px-3 py-2 text-[12.5px] outline-none border transition-colors placeholder:text-[#b8a88d]",
        mono && "font-mono font-semibold",
        readOnly && "text-[#a59682] cursor-not-allowed",
        error ? "border-vs-warn" : "border-vs-line-2 focus:border-[#a59682]"
      )}
    />
  )
}

function FSelect({
  value, onChange, options,
}: {
  value: string; onChange: (v: string) => void; options: { value: string; label: string }[]
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full appearance-none bg-vs-chip rounded-xl px-3 py-2 text-[12.5px] outline-none border border-vs-line-2 pr-8 focus:border-[#a59682] transition-colors capitalize"
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8a7f70] pointer-events-none">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
    </div>
  )
}

function FLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <div className="text-[11px] text-[#8a7f70] mb-1.5">
      {children}
      {required && <span className="text-vs-warn ml-0.5">*</span>}
    </div>
  )
}

export function TierChip({ tier }: { tier: TierKey }) {
  const t = TIERS.find(x => x.key === tier)!
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full"
      style={{ background: t.bg, color: t.fg }}
    >
      {tier === "vip" && <Star size={10} fill="currentColor" strokeWidth={0} />}
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: t.fg }} />
      {t.label}
    </span>
  )
}

export function ClienteAvatar({ nombre, tier, size = 36 }: { nombre: string; tier: TierKey; size?: number }) {
  const init = avatarInitials(nombre)
  const color = avatarColor(init)
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-semibold shrink-0 relative"
      style={{ width: size, height: size, background: color, fontSize: size * 0.32 }}
    >
      {init}
      {tier === "vip" && (
        <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#faecd6] border-2 border-white flex items-center justify-center text-[8px] text-[#8c6a1e]">
          ★
        </span>
      )}
    </div>
  )
}

// ─── Bike Card ─────────────────────────────────────────────────────────────────

function BikeCard({
  b,
  expanded,
  onEdit,
  onDelete,
}: {
  b: Bicicleta
  expanded?: boolean
  onEdit?: () => void
  onDelete?: () => void
}) {
  return (
    <div className="bg-vs-card border border-vs-line rounded-[18px] p-4 hover:border-vs-violet transition-colors vs-scale-in">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-vs-violet-bg text-vs-violet flex items-center justify-center shrink-0">
          <Bike size={18} strokeWidth={1.6} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-semibold truncate">{b.marca}</span>
            <span className="text-[10px] font-mono text-[#a59682] bg-vs-chip px-1.5 py-0.5 rounded-full shrink-0">{b.id}</span>
          </div>
          <div className="text-[11.5px] text-[#8a7f70] mt-0.5">{b.tipo} · Talla {b.talla} · {b.color}</div>
          {expanded && (
            <>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="text-[10.5px]"><span className="text-[#a59682]">Serie: </span><span className="font-mono">{b.serial}</span></div>
                <div className="text-[10.5px]"><span className="text-[#a59682]">Año compra: </span><span className="font-mono">{b.añoCompra}</span></div>
              </div>
              {b.notas && <div className="mt-2 text-[11.5px] text-[#4a4438] leading-relaxed">{b.notas}</div>}
            </>
          )}
        </div>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={onEdit}
            className="w-8 h-8 rounded-full bg-vs-chip hover:bg-[#ebe3d6] flex items-center justify-center active:scale-90 transition-all duration-150"
          >
            <Pencil size={12} strokeWidth={1.6} />
          </button>
          <button
            onClick={onDelete}
            className="w-8 h-8 rounded-full bg-vs-chip hover:bg-vs-warn-bg hover:text-vs-warn flex items-center justify-center active:scale-90 transition-all duration-150"
          >
            <Trash2 size={12} strokeWidth={1.6} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Contact Alert ─────────────────────────────────────────────────────────────

function ContactAlert({
  type,
  value,
  onClose,
}: {
  type: "phone" | "email"
  value: string
  onClose: () => void
}) {
  const [copied, setCopied] = useState(false)

  const formatted =
    type === "phone"
      ? (() => {
          const digits = value.replace(/\D/g, "")
          if (digits.length === 11 && digits.startsWith("56")) {
            return `(+56) ${digits.slice(2, 3)} ${digits.slice(3, 7)} ${digits.slice(7, 11)}`
          }
          return value
        })()
      : value

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {}
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center vs-fade-in">
      <div onClick={onClose} className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="relative bg-vs-card border border-vs-line rounded-[24px] p-6 w-[340px] shadow-xl vs-scale-in">
        <div className="text-[13px] font-semibold text-vs-ink mb-1">
          {type === "phone" ? "Contactar por teléfono" : "Contactar por email"}
        </div>
        <div className="text-[12px] text-[#8a7f70] mb-4">Canal preferido del cliente</div>

        <div className="bg-vs-chip rounded-xl px-4 py-3 border border-vs-line-2 text-[14px] font-mono font-semibold text-center mb-4 break-all">
          {formatted}
        </div>

        <div className="flex gap-2">
          {type === "email" && (
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-1.5 bg-vs-violet-bg text-vs-violet px-4 py-2.5 rounded-full text-[12.5px] font-medium hover:bg-[#e0d9f8] active:scale-95 transition-all duration-150"
            >
              {copied ? <CheckCheck size={13} strokeWidth={2} /> : <Copy size={13} strokeWidth={2} />}
              {copied ? "Copiado" : "Copiar"}
            </button>
          )}
          <button
            onClick={onClose}
            className={cn(
              "flex items-center justify-center gap-1.5 bg-vs-ink text-white px-4 py-2.5 rounded-full text-[12.5px] font-medium hover:bg-[#1e2228] active:scale-95 transition-all duration-150",
              type === "email" ? "flex-1" : "w-full"
            )}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Delete Confirm Alert ──────────────────────────────────────────────────────

function DeleteConfirmAlert({
  itemName,
  onConfirm,
  onCancel,
}: {
  itemName: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center vs-fade-in">
      <div onClick={onCancel} className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="relative bg-vs-card border border-vs-line rounded-[24px] p-6 w-[340px] shadow-xl vs-scale-in">
        <div className="text-[13px] font-semibold text-vs-ink mb-1">¿Eliminar bicicleta?</div>
        <div className="text-[12px] text-[#8a7f70] mb-4">
          Estás a punto de eliminar <span className="font-semibold text-vs-ink">{itemName}</span>. Esta acción no se puede deshacer.
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-full bg-vs-chip text-vs-ink text-[12.5px] font-medium hover:bg-[#ebe3d6] active:scale-95 transition-all duration-150"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 flex items-center justify-center gap-1.5 bg-vs-warn text-white px-4 py-2.5 rounded-full text-[12.5px] font-medium hover:bg-[#b94a1f] active:scale-95 transition-all duration-150"
          >
            <Trash2 size={13} strokeWidth={2} />
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Manage View ───────────────────────────────────────────────────────────────

function ManageView({
  client,
  bicis,
  onCrearOT,
  onContactar,
  onAddBici,
  onEditBici,
  onDeleteBici,
}: {
  client: Cliente
  bicis: Bicicleta[]
  onCrearOT: () => void
  onContactar: () => void
  onAddBici: () => void
  onEditBici: (b: Bicicleta) => void
  onDeleteBici: (b: Bicicleta) => void
}) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-3">
        <StatBox label="Bicicletas" value={bicis.length} sub="registradas" />
        <StatBox label="OTs históricas" value={client.ots} sub="desde el inicio" />
        <StatBox label="Gasto total" value={fmtGastoK(client.gasto)} sub={`últ. ${client.ultima}`} />
      </div>

      <div>
        <div className="text-[11px] text-[#8a7f70] uppercase tracking-widest mb-2.5">Contacto</div>
        <div className="space-y-1">
          <RowInfo icon={<Mail size={14} strokeWidth={1.6} />} label="Email" value={client.email} />
          <RowInfo icon={<Phone size={14} strokeWidth={1.6} />} label="Teléfono" value={client.tel} />
          <RowInfo icon={<MapPin size={14} strokeWidth={1.6} />} label="Ciudad" value={client.ciudad} />
          <RowInfo icon={<User size={14} strokeWidth={1.6} />} label={client.idType} value={client.idNum} mono />
        </div>
      </div>

      <div>
        <div className="text-[11px] text-[#8a7f70] uppercase tracking-widest mb-2.5">Preferencias</div>
        <div className="flex flex-wrap gap-2">
          <span className="bg-vs-chip px-3 py-1.5 rounded-full text-[11.5px]">Canal preferido: <b className="ml-1">{client.canal}</b></span>
          <span className="bg-vs-chip px-3 py-1.5 rounded-full text-[11.5px]">Cliente desde: <b className="ml-1">{client.fechaReg}</b></span>
        </div>
        {client.notas && (
          <div className="mt-3 bg-vs-chip rounded-xl p-3 border border-vs-line-2 text-[12.5px] leading-relaxed text-[#4a4438]">
            &quot;{client.notas}&quot;
          </div>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="text-[11px] text-[#8a7f70] uppercase tracking-widest">Bicicletas ({bicis.length})</div>
          <button onClick={onAddBici} className="text-[11px] text-vs-violet font-semibold hover:underline">+ Añadir</button>
        </div>
        {bicis.length === 0 ? (
          <div className="text-[12px] text-[#8a7f70] italic">Sin bicicletas registradas.</div>
        ) : (
          <div className="space-y-2">
            {bicis.slice(0, 3).map(b => (
              <BikeCard
                key={b.id}
                b={b}
                onEdit={() => onEditBici(b)}
                onDelete={() => onDeleteBici(b)}
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="text-[11px] text-[#8a7f70] uppercase tracking-widest mb-2.5">Últimas OTs</div>
        <div className="space-y-2">
          {[
            { id: "OT-0343", tipo: "Diagnóstico", fecha: "23 Abr", estado: "Recibido" },
            { id: "OT-0338", tipo: "Mantención",  fecha: "12 Abr", estado: "Entregado" },
            { id: "OT-0319", tipo: "Reparación",  fecha: "28 Mar", estado: "Entregado" },
          ].map((o, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-vs-chip border border-vs-line-2">
              <span className="font-mono text-[11.5px] font-semibold">{o.id}</span>
              <span className="text-[11.5px] text-[#8a7f70]">· {o.tipo}</span>
              <span className="flex-1" />
              <span className="text-[10.5px] text-[#a59682] font-mono">{o.fecha}</span>
              <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-white">{o.estado}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-vs-line-2 flex gap-2">
        <button
          onClick={onCrearOT}
          className="flex-1 flex items-center justify-center gap-1.5 bg-vs-ink text-white px-4 py-2.5 rounded-full text-[12.5px] font-medium hover:bg-[#1e2228] active:scale-[0.98] transition-all duration-150"
        >
          <Plus size={14} strokeWidth={2} />
          Crear OT para este cliente
        </button>
        <button
          onClick={onContactar}
          className="flex items-center gap-1.5 bg-vs-chip text-vs-ink px-4 py-2.5 rounded-full text-[12px] font-medium hover:bg-[#ebe3d6] active:scale-95 transition-all duration-150"
        >
          <Mail size={13} strokeWidth={1.6} />
          Contactar
        </button>
      </div>
    </div>
  )
}

// ─── Edit View ─────────────────────────────────────────────────────────────────

function EditView({ draft, set }: { draft: Cliente; set: <K extends keyof Cliente>(k: K, v: Cliente[K]) => void }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <FLabel required>Nombre completo</FLabel>
          <FInput value={draft.nombre} onChange={v => set("nombre", v)} />
        </div>
        <div>
          <FLabel>Cliente ID</FLabel>
          <FInput value={draft.id} mono readOnly />
        </div>
      </div>

      <div className="grid grid-cols-[130px_1fr] gap-3">
        <div>
          <FLabel>Tipo ID</FLabel>
          <FSelect
            value={draft.idType}
            onChange={v => set("idType", v as IdType)}
            options={ID_TYPES.map(t => ({ value: t, label: t }))}
          />
        </div>
        <div>
          <FLabel required>Identificación</FLabel>
          <FInput value={draft.idNum} onChange={v => set("idNum", v)} mono />
        </div>
      </div>

      <div>
        <FLabel required>Email</FLabel>
        <FInput value={draft.email} onChange={v => set("email", v)} type="email" />
      </div>

      <div>
        <FLabel>Teléfono</FLabel>
        <FInput value={draft.tel} onChange={v => set("tel", v)} />
      </div>

      <div>
        <FLabel>Ciudad / Comuna</FLabel>
        <FInput value={draft.ciudad} onChange={v => set("ciudad", v)} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <FLabel>Canal preferido</FLabel>
          <FSelect
            value={draft.canal}
            onChange={v => set("canal", v as CanalKey)}
            options={CANALES.map(c => ({ value: c, label: c }))}
          />
        </div>
        <div>
          <FLabel>Nivel / Tier</FLabel>
          <FSelect
            value={draft.tier}
            onChange={v => set("tier", v as TierKey)}
            options={TIERS.map(t => ({ value: t.key, label: t.label }))}
          />
        </div>
      </div>

      <div>
        <FLabel>Notas internas</FLabel>
        <textarea
          value={draft.notas}
          onChange={e => set("notas", e.target.value)}
          rows={3}
          className="w-full bg-vs-chip rounded-xl px-3 py-2 text-[12.5px] outline-none border border-vs-line-2 focus:border-[#a59682] transition-colors leading-relaxed resize-none"
        />
      </div>

      <div className="pt-3 border-t border-vs-line-2">
        <div className="text-[11px] text-[#8a7f70] uppercase tracking-widest mb-2">Consentimiento</div>
        <label className="flex items-center gap-2 text-[12px] cursor-pointer select-none">
          <input type="checkbox" checked={!!draft.consentEmail} onChange={e => set("consentEmail", e.target.checked)} className="accent-vs-ink w-4 h-4" />
          Acepta envío de recordatorios por email
        </label>
        <label className="flex items-center gap-2 text-[12px] mt-1.5 cursor-pointer select-none">
          <input type="checkbox" checked={!!draft.consentWhatsApp} onChange={e => set("consentWhatsApp", e.target.checked)} className="accent-vs-ink w-4 h-4" />
          Acepta notificaciones por WhatsApp
        </label>
        <label className="flex items-center gap-2 text-[12px] mt-1.5 cursor-pointer select-none">
          <input type="checkbox" checked={!!draft.consentMarketing} onChange={e => set("consentMarketing", e.target.checked)} className="accent-vs-ink w-4 h-4" />
          Comunicación de marketing
        </label>
      </div>

      <div className="pt-3 border-t border-vs-line-2">
        <button className="flex items-center gap-1.5 text-[12px] text-vs-warn font-medium hover:bg-vs-warn-bg px-2 py-1 rounded-lg active:scale-95 transition-all duration-150">
          <Trash2 size={13} strokeWidth={1.6} />
          Desactivar cliente
        </button>
      </div>
    </div>
  )
}

// ─── Bikes View ────────────────────────────────────────────────────────────────

function BikesView({
  clientId,
  bicis,
  onAddBici,
  onEditBici,
  onDeleteBici,
}: {
  clientId: string
  bicis: Bicicleta[]
  onAddBici: () => void
  onEditBici: (b: Bicicleta) => void
  onDeleteBici: (b: Bicicleta) => void
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-[12.5px] text-[#8a7f70]">
          {bicis.length} bicicleta{bicis.length !== 1 ? "s" : ""} asociada{bicis.length !== 1 ? "s" : ""} a{" "}
          <span className="font-mono font-semibold text-vs-ink">{clientId}</span>
        </div>
        <button
          onClick={onAddBici}
          className="flex items-center gap-1.5 bg-vs-ink text-white px-3 py-1.5 rounded-full text-[11.5px] font-medium hover:bg-[#1e2228] active:scale-95 transition-all duration-150"
        >
          <Plus size={12} strokeWidth={2} />
          Registrar bici
        </button>
      </div>

      {bicis.length === 0 ? (
        <div className="bg-vs-card border-2 border-dashed border-vs-line rounded-[18px] p-8 text-center">
          <div className="text-[13px] text-[#8a7f70]">Este cliente no tiene bicicletas registradas.</div>
          <button
            onClick={onAddBici}
            className="mt-3 flex items-center gap-1.5 bg-vs-chip text-vs-ink px-4 py-2 rounded-full text-[12px] font-medium hover:bg-[#ebe3d6] active:scale-95 transition-all duration-150 mx-auto"
          >
            <Plus size={12} strokeWidth={2} />
            Añadir la primera
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {bicis.map(b => (
            <BikeCard
              key={b.id}
              b={b}
              expanded
              onEdit={() => onEditBici(b)}
              onDelete={() => onDeleteBici(b)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Bicicleta Form Drawer ─────────────────────────────────────────────────────

type BiciFormData = {
  marca: string
  modelo: string
  tipo: string
  talla: string
  color: string
  serial: string
  añoCompra: string
  notas: string
}

const EMPTY_BICI_FORM: BiciFormData = {
  marca: "",
  modelo: "",
  tipo: TIPOS_BICI[0],
  talla: "",
  color: "",
  serial: "",
  añoCompra: "",
  notas: "",
}

function parseMarcaModelo(marcaFull: string): { marca: string; modelo: string } {
  const parts = marcaFull.trim().split(" ")
  if (parts.length <= 1) return { marca: marcaFull, modelo: "" }
  return { marca: parts[0], modelo: parts.slice(1).join(" ") }
}

function BicicletaFormDrawer({
  bici,
  onClose,
  onSave,
}: {
  bici: Bicicleta | null
  onClose: () => void
  onSave: (bici: Bicicleta) => void
}) {
  const initial = useMemo<BiciFormData>(() => {
    if (!bici) return EMPTY_BICI_FORM
    const { marca, modelo } = parseMarcaModelo(bici.marca)
    return {
      marca,
      modelo,
      tipo: bici.tipo,
      talla: bici.talla,
      color: bici.color,
      serial: bici.serial,
      añoCompra: bici.añoCompra ? String(bici.añoCompra) : "",
      notas: bici.notas,
    }
  }, [bici])

  const [form, setForm] = useState<BiciFormData>(initial)
  const [errors, setErrors] = useState<Partial<Record<keyof BiciFormData, boolean>>>({})
  const isEditing = bici !== null

  const setField = <K extends keyof BiciFormData>(key: K, val: BiciFormData[K]) => {
    setForm(prev => ({ ...prev, [key]: val }))
    setErrors(prev => ({ ...prev, [key]: false }))
  }

  const validate = (): boolean => {
    const next: Partial<Record<keyof BiciFormData, boolean>> = {}
    let valid = true
    const required: (keyof BiciFormData)[] = ["marca", "tipo", "talla", "color"]
    for (const k of required) {
      if (!form[k].trim()) {
        next[k] = true
        valid = false
      }
    }
    setErrors(next)
    return valid
  }

  const handleSubmit = () => {
    if (!validate()) return
    const marcaFull = `${form.marca} ${form.modelo}`.trim()
    onSave({
      id: bici?.id ?? "",
      marca: marcaFull,
      tipo: form.tipo,
      talla: form.talla,
      color: form.color,
      serial: form.serial,
      añoCompra: form.añoCompra ? parseInt(form.añoCompra) : 0,
      notas: form.notas,
    })
  }

  const tipoOptions = TIPOS_BICI.map(t => ({ value: t, label: t }))

  return (
    <div className="fixed inset-0 z-[60] flex vs-fade-in">
      <div onClick={onClose} className="flex-1 bg-black/30 backdrop-blur-sm" />
      <div className="w-[480px] bg-vs-bg h-full overflow-y-auto flex flex-col vs-slide-in-right">
        <div className="bg-vs-card border border-vs-line rounded-[24px] m-3 mb-0 flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 p-5 border-b border-vs-line-2">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-vs-chip hover:bg-[#ebe3d6] flex items-center justify-center active:scale-90 transition-all duration-150 shrink-0"
            >
              <ChevronLeft size={16} strokeWidth={1.6} />
            </button>
            <div className="flex-1">
              <div className="text-[11px] text-[#8a7f70] uppercase tracking-widest">
                {isEditing ? "Editar bicicleta" : "Nueva bicicleta"}
              </div>
              <div className="text-[16px] font-semibold">
                {isEditing ? bici!.marca : "Registrar bici"}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FLabel required>Marca</FLabel>
                <FInput
                  value={form.marca}
                  onChange={v => setField("marca", v)}
                  placeholder="ej. Trek"
                  error={errors.marca}
                />
                {errors.marca && <p className="text-[11px] text-vs-warn mt-1">Requerido</p>}
              </div>
              <div>
                <FLabel>Modelo</FLabel>
                <FInput
                  value={form.modelo}
                  onChange={v => setField("modelo", v)}
                  placeholder="ej. Marlin 7 2024"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <FLabel required>Tipo</FLabel>
                <FSelect value={form.tipo} onChange={v => setField("tipo", v)} options={tipoOptions} />
              </div>
              <div>
                <FLabel required>Talla</FLabel>
                <FInput
                  value={form.talla}
                  onChange={v => setField("talla", v)}
                  placeholder="ej. M"
                  error={errors.talla}
                />
                {errors.talla && <p className="text-[11px] text-vs-warn mt-1">Requerido</p>}
              </div>
            </div>

            <div>
              <FLabel required>Color</FLabel>
              <FInput
                value={form.color}
                onChange={v => setField("color", v)}
                placeholder="ej. Rojo Volcán"
                error={errors.color}
              />
              {errors.color && <p className="text-[11px] text-vs-warn mt-1">Requerido</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <FLabel>Número de serie</FLabel>
                <FInput
                  value={form.serial}
                  onChange={v => setField("serial", v)}
                  placeholder="Opcional"
                />
              </div>
              <div>
                <FLabel>Año compra</FLabel>
                <FInput
                  value={form.añoCompra}
                  onChange={v => setField("añoCompra", v)}
                  placeholder="ej. 2024"
                  type="number"
                />
              </div>
            </div>

            <div>
              <FLabel>Notas</FLabel>
              <textarea
                value={form.notas}
                onChange={e => setField("notas", e.target.value)}
                rows={3}
                placeholder="Detalles adicionales de la bicicleta…"
                className="w-full bg-vs-chip rounded-xl px-3 py-2 text-[12.5px] outline-none border border-vs-line-2 focus:border-[#a59682] transition-colors leading-relaxed resize-none placeholder:text-[#b8a88d]"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 p-5 border-t border-vs-line-2 bg-[#faf6f0] rounded-b-[24px]">
            <div className="flex-1" />
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-vs-chip text-vs-ink text-[13px] font-medium hover:bg-[#ebe3d6] transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-vs-ink text-white text-[13px] font-medium hover:bg-[#1e2228] transition-colors"
            >
              <Check size={15} strokeWidth={2} />
              {isEditing ? "Guardar cambios" : "Registrar bicicleta"}
            </button>
          </div>
        </div>
        <div className="h-5" />
      </div>
    </div>
  )
}

// ─── Drawer ────────────────────────────────────────────────────────────────────

export type DrawerMode = "manage" | "edit" | "bikes"

export function ClienteDrawer({
  cliente: initial,
  mode: initialMode,
  onClose,
  onSave,
}: {
  cliente: Cliente
  mode: DrawerMode
  onClose: () => void
  onSave: (updated: Cliente) => void
}) {
  const [mode, setMode] = useState<DrawerMode>(initialMode)
  const [draft, setDraft] = useState<Cliente>({ ...initial })
  const [bicis, setBicis] = useState<Bicicleta[]>(BICIS_MOCK[initial.id] ?? [])
  const [showNuevaOT, setShowNuevaOT] = useState(false)
  const [contactAlert, setContactAlert] = useState<{ type: "phone" | "email"; value: string } | null>(null)

  // Bike form drawer state
  const [showBiciDrawer, setShowBiciDrawer] = useState(false)
  const [editingBici, setEditingBici] = useState<Bicicleta | null>(null)

  // Delete confirmation state
  const [deleteBici, setDeleteBici] = useState<Bicicleta | null>(null)

  const invalidateOrdenes = useInvalidateOrdenes()

  const prefillCliente: ClienteResult = useMemo(() => ({
    id: draft.id,
    nombre: draft.nombre,
    rut: draft.idNum,
  }), [draft.id, draft.nombre, draft.idNum])

  const set = <K extends keyof Cliente>(key: K, val: Cliente[K]) =>
    setDraft(prev => ({ ...prev, [key]: val }))

  const modeLabel = mode === "edit" ? "Editar datos" : mode === "bikes" ? "Bicicletas" : "Gestionar cliente"

  const handleAddBici = () => {
    setEditingBici(null)
    setShowBiciDrawer(true)
  }

  const handleEditBici = (b: Bicicleta) => {
    setEditingBici(b)
    setShowBiciDrawer(true)
  }

  const handleDeleteBici = (b: Bicicleta) => {
    setDeleteBici(b)
  }

  const handleSaveBici = (bici: Bicicleta) => {
    if (editingBici) {
      // Update existing
      setBicis(prev => prev.map(b => (b.id === editingBici.id ? { ...bici, id: editingBici.id } : b)))
    } else {
      // Create new - generate ID
      const nums = bicis.map(b => parseInt(b.id.replace(/\D/g, ""))).filter(n => !isNaN(n))
      const nextNum = nums.length ? Math.max(...nums) + 1 : 501
      const newId = `BC-${nextNum.toString().padStart(4, "0")}`
      setBicis(prev => [...prev, { ...bici, id: newId }])
    }
    setShowBiciDrawer(false)
    setEditingBici(null)
  }

  const handleConfirmDelete = () => {
    if (deleteBici) {
      setBicis(prev => prev.filter(b => b.id !== deleteBici.id))
      setDeleteBici(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex vs-fade-in">
      <div onClick={onClose} className="flex-1 bg-black/30 backdrop-blur-sm" />

      <div className="w-[560px] bg-vs-bg h-full overflow-y-auto flex flex-col vs-slide-in-right">
        <div className="bg-vs-card border border-vs-line rounded-[24px] m-3 mb-0">
          {/* Header */}
          <div className="flex items-center gap-3 p-5 border-b border-vs-line-2">
            <ClienteAvatar nombre={draft.nombre} tier={draft.tier} size={40} />
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-[#8a7f70] uppercase tracking-widest">
                {modeLabel} · <span className="font-mono">{draft.id}</span>
              </div>
              <div className="text-[16px] font-semibold truncate">{draft.nombre}</div>
            </div>

            {/* Mode tabs */}
            <div className="flex items-center gap-1 bg-vs-chip rounded-full p-1">
              {(["manage", "edit", "bikes"] as DrawerMode[]).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={cn(
                    "text-[11px] px-2.5 py-1 rounded-full font-medium transition-all duration-150",
                    mode === m ? "bg-white shadow-sm text-vs-ink" : "text-[#8a7f70] hover:text-vs-ink"
                  )}
                >
                  {m === "manage" ? "Ver" : m === "edit" ? "Editar" : "Bicis"}
                </button>
              ))}
            </div>

            {(mode === "edit" || mode === "bikes") && (
              <button
                onClick={() => onSave(draft)}
                className="flex items-center gap-1.5 bg-vs-ink text-white px-4 py-1.5 rounded-full text-[12px] font-medium hover:bg-[#1e2228] active:scale-95 transition-all duration-150"
              >
                <Check size={13} strokeWidth={2} />
                Guardar
              </button>
            )}

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-vs-chip hover:bg-[#ebe3d6] flex items-center justify-center active:scale-90 transition-all duration-150 shrink-0"
            >
              <X size={16} strokeWidth={1.6} />
            </button>
          </div>

          <div className="p-5">
            {mode === "manage" && (
              <ManageView
                client={draft}
                bicis={bicis}
                onCrearOT={() => setShowNuevaOT(true)}
                onContactar={() => {
                  const c = draft.canal
                  if (c === "WhatsApp") {
                    const digits = draft.tel.replace(/\D/g, "")
                    window.open(`https://wa.me/${digits}`, "_blank", "noopener,noreferrer")
                  } else if (c === "Email") {
                    setContactAlert({ type: "email", value: draft.email })
                  } else {
                    setContactAlert({ type: "phone", value: draft.tel })
                  }
                }}
                onAddBici={handleAddBici}
                onEditBici={handleEditBici}
                onDeleteBici={handleDeleteBici}
              />
            )}
            {mode === "edit" && <EditView draft={draft} set={set} />}
            {mode === "bikes" && (
              <BikesView
                clientId={draft.id}
                bicis={bicis}
                onAddBici={handleAddBici}
                onEditBici={handleEditBici}
                onDeleteBici={handleDeleteBici}
              />
            )}
          </div>
        </div>
        <div className="h-5" />
      </div>

      {showNuevaOT && (
        <NuevaOTModal
          onClose={() => setShowNuevaOT(false)}
          onCreate={() => {
            invalidateOrdenes()
            setShowNuevaOT(false)
          }}
          prefillCliente={prefillCliente}
        />
      )}

      {contactAlert && (
        <ContactAlert
          type={contactAlert.type}
          value={contactAlert.value}
          onClose={() => setContactAlert(null)}
        />
      )}

      {showBiciDrawer && (
        <BicicletaFormDrawer
          bici={editingBici}
          onClose={() => {
            setShowBiciDrawer(false)
            setEditingBici(null)
          }}
          onSave={handleSaveBici}
        />
      )}

      {deleteBici && (
        <DeleteConfirmAlert
          itemName={deleteBici.marca}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteBici(null)}
        />
      )}
    </div>
  )
}
