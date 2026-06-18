import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { clientesService } from "../services/clientes.provider"
import type { Cliente as ServiceCliente } from "../types/clientes.types"
import type { Cliente, TierKey } from "../components/clientes/clientes.mock"

export const clientesQueryKey = ["clientes"] as const
export const clienteDetalleQueryKey = (id: string) => ["cliente-detalle", id] as const

function isUuid(value: string | undefined) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value ?? "")
}

function clienteVisualId(cliente: ServiceCliente) {
  if (cliente.codigoCliente) return cliente.codigoCliente
  if (cliente.clienteId) return cliente.clienteId
  if (!cliente.backendId && cliente.id && !isUuid(cliente.id)) return cliente.id
  return ""
}

export function toClienteUI(s: ServiceCliente): Cliente {
  const codigoCliente = clienteVisualId(s)
  return {
    id: codigoCliente || s.id,
    backendId: s.backendId ?? (isUuid(s.id) ? s.id : undefined),
    codigoCliente: codigoCliente || null,
    nombre: `${s.nombre} ${s.apellido}`,
    idType: "RUT",
    idNum: s.rut,
    email: s.email,
    tel: s.telefono,
    ciudad: s.ciudad ?? s.direccion ?? "",
    fechaReg: s.fechaReg ?? "",
    tier: s.tipo.toLowerCase() as TierKey,
    bicis: s.bicicletasCount ?? s.bicicletas_count ?? 0,
    ots: s.ordenesCount ?? s.ordenes_count ?? 0,
    gasto: s.totalGastado ?? s.total_gastado ?? 0,
    ultima: s.ultimaVisita ?? "",
    canal: s.canal ?? "Email",
    notas: s.notas ?? "",
    consentEmail: s.consentEmail ?? false,
    consentWhatsApp: s.consentWhatsApp ?? false,
    consentMarketing: s.consentMarketing ?? false,
  }
}

export function useClientes() {
  return useQuery({
    queryKey: clientesQueryKey,
    queryFn: async () => {
      const res = await clientesService.getClientes()
      return res.clientes.map(toClienteUI)
    },
    staleTime: 30_000,
  })
}

export function useClienteDetalle(id: string | undefined, enabled = true) {
  return useQuery({
    queryKey: clienteDetalleQueryKey(id ?? ""),
    queryFn: () => clientesService.getClienteDetalle(id!),
    enabled: enabled && !!id,
    staleTime: 30_000,
  })
}

function toCreatePayload(cliente: Cliente) {
  const [nombre, ...apellidoParts] = cliente.nombre.trim().split(/\s+/)

  return {
    nombre: nombre || cliente.nombre.trim(),
    apellido: apellidoParts.join(" "),
    rut: cliente.idNum,
    email: cliente.email,
    telefono: cliente.tel,
    direccion: cliente.ciudad,
  }
}

export function useCreateClienteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (cliente: Cliente) => {
      await clientesService.createCliente(toCreatePayload(cliente))
      return cliente
    },
    onSuccess: cliente => {
      queryClient.setQueryData<Cliente[]>(clientesQueryKey, current => [cliente, ...(current ?? [])])
      void queryClient.invalidateQueries({ queryKey: clientesQueryKey })
    },
  })
}

export function useUpdateClienteCacheMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (cliente: Cliente) => {
      if (cliente.backendId) {
        await clientesService.updateCliente(cliente.backendId, toCreatePayload(cliente))
      }
      return cliente
    },
    onSuccess: cliente => {
      queryClient.setQueryData<Cliente[]>(clientesQueryKey, current =>
        (current ?? []).map(c => (c.backendId ?? c.id) === (cliente.backendId ?? cliente.id) ? cliente : c)
      )
      void queryClient.invalidateQueries({ queryKey: clientesQueryKey })
    },
  })
}
