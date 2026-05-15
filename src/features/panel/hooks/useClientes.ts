import { useQuery } from "@tanstack/react-query"
import { clientesService } from "../services/clientes.provider"
import type { Cliente as ServiceCliente } from "../types/clientes.types"
import type { Cliente, TierKey } from "../components/clientes/clientes.mock"

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
    queryKey: ["clientes"],
    queryFn: async () => {
      const res = await clientesService.getClientes()
      return res.clientes.map(toClienteUI)
    },
    staleTime: 30_000,
  })
}
