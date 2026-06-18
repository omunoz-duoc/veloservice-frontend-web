import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { adminService } from "@/features/admin/services/admin.provider"

export function useAdminTalleres() {
  return useQuery({
    queryKey: ["admin", "talleres"],
    queryFn: () => adminService.getTalleres(),
  })
}

export function useAdminTallerById(id: string) {
  return useQuery({
    queryKey: ["admin", "talleres", id],
    queryFn: () => adminService.getTallerById(id),
    enabled: !!id,
  })
}

export function useAdminPlanes() {
  return useQuery({
    queryKey: ["admin", "planes"],
    queryFn: () => adminService.getPlanes(),
  })
}

export function useCreateTaller() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: adminService.createTaller,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "talleres"] })
      qc.invalidateQueries({ queryKey: ["admin", "suscripciones"] })
      qc.invalidateQueries({ queryKey: ["admin", "kpis"] })
      qc.invalidateQueries({ queryKey: ["admin", "metrics"] })
      qc.invalidateQueries({ queryKey: ["admin", "executive-summary"] })
    },
  })
}

export function useUpdateTallerEstado() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, activo }: { id: string; activo: boolean }) =>
      adminService.updateTallerEstado(id, activo),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "talleres"] })
      qc.invalidateQueries({ queryKey: ["admin", "suscripciones"] })
      qc.invalidateQueries({ queryKey: ["admin", "kpis"] })
      qc.invalidateQueries({ queryKey: ["admin", "metrics"] })
      qc.invalidateQueries({ queryKey: ["admin", "executive-summary"] })
    },
  })
}

export function useUpdateTallerModulos() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, moduloIds }: { id: string; moduloIds: string[] }) =>
      adminService.updateTallerModulos(id, moduloIds),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "talleres"] })
    },
  })
}

export function useAdminModulos() {
  return useQuery({
    queryKey: ["admin", "modulos"],
    queryFn: () => adminService.getModulos(),
  })
}

export function useAdminSuscripciones() {
  return useQuery({
    queryKey: ["admin", "suscripciones"],
    queryFn: () => adminService.getSuscripciones(),
  })
}

export function useUpdateSuscripcion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (args: { tallerId: string; data: Parameters<typeof adminService.updateSuscripcion>[1] }) =>
      adminService.updateSuscripcion(args.tallerId, args.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "suscripciones"] })
      qc.invalidateQueries({ queryKey: ["admin", "talleres"] })
      qc.invalidateQueries({ queryKey: ["admin", "kpis"] })
    },
  })
}

export function useSaasKpis() {
  return useQuery({
    queryKey: ["admin", "kpis"],
    queryFn: () => adminService.getSaasKpis(),
  })
}

export function useAdminMetrics() {
  return useQuery({
    queryKey: ["admin", "metrics"],
    queryFn: () => adminService.getMetricasDetalle(),
  })
}
