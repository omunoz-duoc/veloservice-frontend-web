"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  Building2,
  ImageIcon,
  LoaderCircle,
  MapPin,
  Save,
  Upload,
} from "lucide-react"
import { Field } from "@/components/common/Field"
import { cn } from "@/lib/utils"
import { configuracionService } from "../../services/configuracion.provider"
import type {
  PerfilNegocio,
  SucursalConfiguracion,
} from "../../types/configuracion.types"
import {
  LOGO_ACCEPTED_MIME,
  validateLogoFile,
} from "./logo.utils"

export const TALLER_QUERY_KEY = ["configuracion", "taller"] as const
export const SUCURSALES_QUERY_KEY = ["configuracion", "sucursales"] as const

const EMPTY_TALLER: PerfilNegocio = {
  nombre: "",
  rut: "",
  telefono: "",
  email: "",
  logoUrl: null,
}

type Notice = { type: "success" | "error"; message: string }

function FormField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type,
  required,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: string
  required?: boolean
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-vs-ink">
        {label}
      </label>
      <Field
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  )
}

function LogoUploader({
  logoUrl,
  isPending,
  onUpload,
}: {
  logoUrl: string | null
  isPending: boolean
  onUpload: (file: File) => Promise<void>
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const objectUrlRef = useRef<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const previewUrl = localPreviewUrl ?? logoUrl

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    }
  }, [])

  function handleFile(nextFile: File | undefined) {
    if (!nextFile) return
    const validationError = validateLogoFile(nextFile)
    if (validationError) {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
      setError(validationError)
      setFile(null)
      setLocalPreviewUrl(null)
      if (inputRef.current) inputRef.current.value = ""
      return
    }

    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    const objectUrl = URL.createObjectURL(nextFile)
    objectUrlRef.current = objectUrl
    setLocalPreviewUrl(objectUrl)
    setFile(nextFile)
    setError(null)
  }

  async function handleUpload() {
    if (!file) return
    try {
      await onUpload(file)
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
      setFile(null)
      setLocalPreviewUrl(null)
      if (inputRef.current) inputRef.current.value = ""
    } catch {
      // Mutation feedback is rendered by the parent.
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 sm:items-start">
      <div className="relative h-32 w-32 overflow-hidden rounded-[28px] border border-[#ded4c7] bg-[#f4eee5] shadow-[0_16px_35px_rgba(45,41,38,0.08)]">
        {previewUrl ? (
          <Image
            src={previewUrl}
            alt="Logo del taller"
            fill
            sizes="128px"
            unoptimized
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-[#a59682]">
            <ImageIcon size={30} strokeWidth={1.5} aria-hidden="true" />
            <span className="text-xs font-medium">Sin logo</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
        <input
          ref={inputRef}
          id="logo-taller"
          type="file"
          accept={LOGO_ACCEPTED_MIME.join(",")}
          className="peer sr-only"
          onChange={(event) => handleFile(event.target.files?.[0])}
        />
        <label
          htmlFor="logo-taller"
          className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#d8cec0] bg-white px-3.5 py-2 text-xs font-semibold text-vs-ink transition-colors hover:bg-[#f7f3eb] peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-vs-ink peer-focus-visible:ring-offset-2"
        >
          <Upload size={14} aria-hidden="true" />
          {logoUrl ? "Cambiar logo" : "Elegir logo"}
        </label>
        {file ? (
          <button
            type="button"
            onClick={() => void handleUpload()}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-full bg-vs-ink px-3.5 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vs-ink focus-visible:ring-offset-2 disabled:opacity-50"
          >
            {isPending ? (
              <LoaderCircle
                size={14}
                className="animate-spin motion-reduce:animate-none"
                aria-hidden="true"
              />
            ) : (
              <Upload size={14} aria-hidden="true" />
            )}
            {isPending ? "Subiendo…" : "Subir logo"}
          </button>
        ) : null}
      </div>
      <p className="max-w-48 text-center text-[11px] leading-4 text-[#978b7c] sm:text-left">
        JPG, PNG o WebP. Máximo 5 MB.
      </p>
      {file ? (
        <p className="max-w-48 truncate text-xs font-medium text-[#635b52]" title={file.name}>
          {file.name}
        </p>
      ) : null}
      {error ? <p className="max-w-48 text-xs font-medium text-[#c85a2a]">{error}</p> : null}
    </div>
  )
}

function SucursalCard({
  sucursal,
  onNotice,
}: {
  sucursal: SucursalConfiguracion
  onNotice: (notice: Notice) => void
}) {
  const queryClient = useQueryClient()
  const [draft, setDraft] = useState<Partial<SucursalConfiguracion>>({})
  const form = { ...sucursal, ...draft }

  const guardarSucursal = useMutation({
    mutationFn: () =>
      configuracionService.guardarSucursal(sucursal.id, {
        nombre: form.nombre,
        direccion: form.direccion,
        telefono: form.telefono,
        email: form.email,
      }),
    onSuccess: (updated) => {
      queryClient.setQueryData<SucursalConfiguracion[]>(SUCURSALES_QUERY_KEY, (current) =>
        current?.map((item) => (item.id === updated.id ? updated : item))
      )
      setDraft({})
      onNotice({ type: "success", message: `${updated.nombre} se actualizó correctamente.` })
    },
    onError: () => {
      onNotice({ type: "error", message: `No se pudo guardar ${sucursal.nombre}.` })
    },
  })

  function set<K extends keyof Omit<SucursalConfiguracion, "id">>(key: K, value: string) {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        guardarSucursal.mutate()
      }}
      className="min-w-0 rounded-2xl border border-[#e5ddd2] bg-white p-5 shadow-[0_10px_30px_rgba(45,41,38,0.04)]"
    >
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#efe8dd] text-[#6c604f]">
          <MapPin size={19} strokeWidth={1.7} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[#a09280]">
            Sucursal
          </p>
          <h3 className="truncate text-base font-semibold text-vs-ink">{sucursal.nombre}</h3>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          id={`sucursal-${sucursal.id}-nombre`}
          label="Nombre"
          value={form.nombre}
          onChange={(value) => set("nombre", value)}
          placeholder="Providencia"
          required
        />
        <FormField
          id={`sucursal-${sucursal.id}-direccion`}
          label="Dirección"
          value={form.direccion}
          onChange={(value) => set("direccion", value)}
          placeholder="Av. Providencia 1234"
        />
        <FormField
          id={`sucursal-${sucursal.id}-telefono`}
          label="Teléfono"
          value={form.telefono}
          onChange={(value) => set("telefono", value)}
          placeholder="+56 2 2345 6789"
        />
        <FormField
          id={`sucursal-${sucursal.id}-email`}
          label="Email"
          type="email"
          value={form.email}
          onChange={(value) => set("email", value)}
          placeholder="sucursal@taller.cl"
        />
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          disabled={guardarSucursal.isPending || Object.keys(draft).length === 0}
          className="inline-flex items-center gap-2 rounded-full bg-vs-ink px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vs-ink focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45"
        >
          {guardarSucursal.isPending ? (
            <LoaderCircle
              size={15}
              className="animate-spin motion-reduce:animate-none"
              aria-hidden="true"
            />
          ) : (
            <Save size={15} aria-hidden="true" />
          )}
          {guardarSucursal.isPending ? "Guardando…" : "Guardar sucursal"}
        </button>
      </div>
    </form>
  )
}

function LoadingCard({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-2xl border border-[#e5ddd2] bg-white p-6 motion-reduce:animate-none",
        className
      )}
    >
      <div className="mb-5 h-5 w-40 rounded bg-[#eee8df]" />
      <div className="grid gap-4 sm:grid-cols-2">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="h-16 rounded-xl bg-[#f3eee7]" />
        ))}
      </div>
    </div>
  )
}

export function PerfilNegocioSection() {
  const queryClient = useQueryClient()
  const [draft, setDraft] = useState<Partial<PerfilNegocio>>({})
  const [notice, setNotice] = useState<Notice | null>(null)

  const tallerQuery = useQuery({
    queryKey: TALLER_QUERY_KEY,
    queryFn: () => configuracionService.getPerfilNegocio(),
  })
  const sucursalesQuery = useQuery({
    queryKey: SUCURSALES_QUERY_KEY,
    queryFn: () => configuracionService.getSucursales(),
  })

  useEffect(() => {
    if (!notice) return
    const timeout = window.setTimeout(() => setNotice(null), 4000)
    return () => window.clearTimeout(timeout)
  }, [notice])

  const guardarTaller = useMutation({
    mutationFn: (data: Omit<PerfilNegocio, "logoUrl">) =>
      configuracionService.guardarPerfilNegocio(data),
    onSuccess: (updated) => {
      queryClient.setQueryData(TALLER_QUERY_KEY, updated)
      setDraft({})
      setNotice({ type: "success", message: "Los datos del taller se actualizaron." })
    },
    onError: () => {
      setNotice({ type: "error", message: "No se pudieron guardar los datos del taller." })
    },
  })

  const subirLogo = useMutation({
    mutationFn: (file: File) => configuracionService.subirLogo(file),
    onSuccess: (updated) => {
      queryClient.setQueryData(TALLER_QUERY_KEY, updated)
      setNotice({ type: "success", message: "El logo se actualizó correctamente." })
    },
    onError: () => {
      setNotice({ type: "error", message: "No se pudo subir el logo." })
    },
  })

  const form = { ...EMPTY_TALLER, ...(tallerQuery.data ?? {}), ...draft }

  function set<K extends keyof Omit<PerfilNegocio, "logoUrl">>(key: K, value: string) {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="min-w-0 max-w-5xl">
      <div className="mb-7">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#a09280]">
          Configuración del negocio
        </p>
        <h2 className="text-2xl font-bold tracking-tight text-vs-ink">Tu taller, en un solo lugar</h2>
        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[#7d7265]">
          Mantén actualizados los datos generales y la información de contacto de cada sucursal.
        </p>
      </div>

      {tallerQuery.isLoading ? (
        <LoadingCard className="mb-8" />
      ) : null}

      {tallerQuery.isError ? (
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#f1cbb9] bg-[#fff7f2] px-5 py-4 text-sm text-[#a94f2a]">
          <span>No se pudieron cargar los datos del taller.</span>
          <button
            type="button"
            onClick={() => void tallerQuery.refetch()}
            className="font-semibold underline underline-offset-4"
          >
            Reintentar
          </button>
        </div>
      ) : null}

      {tallerQuery.data ? (
        <section className="mb-9 overflow-hidden rounded-[24px] border border-[#ded5c9] bg-white shadow-[0_18px_45px_rgba(45,41,38,0.05)]">
          <div className="border-b border-[#e8e0d5] bg-[#f8f4ed] px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-vs-ink text-white">
                <Building2 size={18} strokeWidth={1.7} aria-hidden="true" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-[#a09280]">
                  Casa matriz
                </p>
                <h3 className="font-semibold text-vs-ink">Identidad del taller</h3>
              </div>
            </div>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault()
              guardarTaller.mutate({
                nombre: form.nombre,
                rut: form.rut,
                telefono: form.telefono,
                email: form.email,
              })
            }}
            className="grid gap-7 p-6 md:grid-cols-[160px_minmax(0,1fr)] md:p-7"
          >
            <LogoUploader
              logoUrl={form.logoUrl}
              isPending={subirLogo.isPending}
              onUpload={(file) => subirLogo.mutateAsync(file).then(() => undefined)}
            />

            <div className="min-w-0">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  id="nombre-taller"
                  label="Nombre del taller"
                  value={form.nombre}
                  onChange={(value) => set("nombre", value)}
                  placeholder="Taller AutoVelo"
                  required
                />
                <FormField
                  id="rut-taller"
                  label="RUT"
                  value={form.rut}
                  onChange={(value) => set("rut", value)}
                  placeholder="76.123.456-7"
                  required
                />
                <FormField
                  id="telefono-taller"
                  label="Teléfono"
                  value={form.telefono}
                  onChange={(value) => set("telefono", value)}
                  placeholder="+56 9 1234 5678"
                />
                <FormField
                  id="email-taller"
                  label="Email de contacto"
                  type="email"
                  value={form.email}
                  onChange={(value) => set("email", value)}
                  placeholder="contacto@taller.cl"
                />
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={guardarTaller.isPending || Object.keys(draft).length === 0}
                  className="inline-flex items-center gap-2 rounded-full bg-vs-ink px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vs-ink focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {guardarTaller.isPending ? (
                    <LoaderCircle
                      size={16}
                      className="animate-spin motion-reduce:animate-none"
                      aria-hidden="true"
                    />
                  ) : (
                    <Save size={16} aria-hidden="true" />
                  )}
                  {guardarTaller.isPending ? "Guardando…" : "Guardar taller"}
                </button>
              </div>
            </div>
          </form>
        </section>
      ) : null}

      <section aria-labelledby="sucursales-title">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h3 id="sucursales-title" className="text-lg font-bold text-vs-ink">
              Sucursales
            </h3>
            <p className="mt-1 text-sm text-[#7d7265]">
              Cada ubicación conserva sus propios datos de contacto.
            </p>
          </div>
          {sucursalesQuery.data ? (
            <span className="rounded-full bg-[#efe8dd] px-3 py-1 text-xs font-semibold text-[#6c604f]">
              {sucursalesQuery.data.length}{" "}
              {sucursalesQuery.data.length === 1 ? "sucursal" : "sucursales"}
            </span>
          ) : null}
        </div>

        {sucursalesQuery.isLoading ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <LoadingCard />
            <LoadingCard />
          </div>
        ) : null}

        {sucursalesQuery.isError ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#f1cbb9] bg-[#fff7f2] px-5 py-4 text-sm text-[#a94f2a]">
            <span>No se pudieron cargar las sucursales.</span>
            <button
              type="button"
              onClick={() => void sucursalesQuery.refetch()}
              className="font-semibold underline underline-offset-4"
            >
              Reintentar
            </button>
          </div>
        ) : null}

        {sucursalesQuery.data?.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#d8cec0] bg-[#faf7f2] px-6 py-10 text-center">
            <MapPin size={28} className="mx-auto mb-3 text-[#a59682]" aria-hidden="true" />
            <p className="font-semibold text-vs-ink">Aún no hay sucursales registradas</p>
            <p className="mt-1 text-sm text-[#7d7265]">
              Cuando existan, podrás actualizar sus datos desde aquí.
            </p>
          </div>
        ) : null}

        {sucursalesQuery.data?.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {sucursalesQuery.data.map((sucursal) => (
              <SucursalCard
                key={sucursal.id}
                sucursal={sucursal}
                onNotice={setNotice}
              />
            ))}
          </div>
        ) : null}
      </section>

      {notice ? (
        <div
          role="status"
          className={cn(
            "fixed bottom-6 right-6 z-50 max-w-sm rounded-xl px-4 py-3 text-sm font-medium text-white shadow-xl",
            notice.type === "success" ? "bg-emerald-700" : "bg-[#c85a2a]"
          )}
        >
          {notice.message}
        </div>
      ) : null}
    </div>
  )
}
