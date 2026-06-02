import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { clientesService } from "../services/clientes.provider"
import type { Cliente as ServiceCliente } from "../types/clientes.types"
import type { Cliente, TierKey } from "../components/clientes/clientes.mock"

export const clientesQueryKey = ["clientes"] as const

export function toClienteUI(s: ServiceCliente): Cliente {
  return {
    id: s.id,
    nombre: `${s.nombre} ${s.apellido}`,
    idType: "RUT",
    idNum: s.rut,
    email: s.email,
    tel: s.telefono,
    ciudad: s.ciudad ?? "",
    fechaReg: s.fechaReg ?? "",
    tier: s.tipo.toLowerCase() as TierKey,
    bicis: s.bicicletasCount,
    ots: s.ordenesCount,
    gasto: s.totalGastado,
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

function toCreatePayload(cliente: Cliente) {
  const [nombre, ...apellidoParts] = cliente.nombre.trim().split(/\s+/)

  return {
    nombre: nombre || cliente.nombre.trim(),
    apellido: apellidoParts.join(" "),
    rut: cliente.idNum,
    email: cliente.email,
    telefono: cliente.tel,
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
    mutationFn: async (cliente: Cliente) => cliente,
    onSuccess: cliente => {
      queryClient.setQueryData<Cliente[]>(clientesQueryKey, current =>
        (current ?? []).map(c => c.id === cliente.id ? cliente : c)
      )
    },
  })
}
