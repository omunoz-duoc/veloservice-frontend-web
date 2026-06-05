import { httpClient } from "@/lib/api/http-client";
import {
    BulkUpdateOrdenPayload,
    CreateOrdenPayload,
    IOrdenesService,
    OrdenCatalogoItem,
    OrdenTrabajo as ApiOrdenTrabajo,
    OrdenTrabajoDetalle,
    OrdenesListResponse,
    OrdenesMetricas,
    OrdenProductoAddPayload,
    UpdateOrdenPayload,
} from "../types/ordenes.types";
import {
    type OrdenTrabajo,
} from "../components/ordenes/ordenes.types";
import {
    normalizeCatalogResponse,
    normalizeEstadoOrden,
    normalizePrioridadOrden,
    normalizeTipoOrden,
} from "./ordenes.catalogos";

type BackendCatalogValue = {
    id?: string;
    codigo?: string;
    nombre?: string;
}

type BackendOrdenTrabajo = Partial<Omit<ApiOrdenTrabajo, "tipo" | "estado" | "bicicleta" | "cliente" | "mecanico">> & {
    id?: string;
    numeroOrden?: string;
    tipo?: string | BackendCatalogValue;
    estado?: string | BackendCatalogValue;
    fechaPrometida?: string | null;
    observacionesCliente?: string | null;
    bicicleta?: {
        id?: string;
        marca?: string;
        modelo?: string;
        tipo?: string | null;
        aro?: string | null;
        color?: string | null;
        numeroSerie?: string | null;
    };
    cliente?: string | {
        id?: string;
        nombre?: string;
        apellido?: string;
        telefono?: string | null;
        email?: string | null;
        rut?: string | null;
    };
    mecanico?: string | {
        id?: string;
        nombre?: string;
        apellido?: string;
    } | null;
}

type BackendOrdenesListResponse = {
    total: number;
    ordenes: BackendOrdenTrabajo[];
}

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

function normalizeCode(value: string) {
    return value
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "_")
}

function catalogValue(value: string | BackendCatalogValue | undefined, fallback = "") {
    if (!value) return { id: "", codigo: fallback, nombre: fallback }
    if (typeof value === "string") return { id: "", codigo: normalizeCode(value), nombre: value }
    const nombre = value.nombre ?? value.codigo ?? fallback
    return {
        id: value.id ?? "",
        codigo: normalizeCode(value.codigo ?? nombre),
        nombre,
    }
}

function formatFechaIngreso(value: string | undefined) {
    const fecha = new Date(value ?? "")
    if (Number.isNaN(fecha.getTime())) return "Sin fecha"

    const day = fecha.getUTCDate().toString().padStart(2, "0")
    const month = MONTHS[fecha.getUTCMonth()]
    const hh = fecha.getUTCHours().toString().padStart(2, "0")
    const mm = fecha.getUTCMinutes().toString().padStart(2, "0")

    return `${day} ${month} · ${hh}:${mm}`
}

function fullName(person: { nombre?: string; apellido?: string } | undefined | null) {
    return [person?.nombre, person?.apellido].filter(Boolean).join(" ")
}

function isUuid(value: string | undefined) {
    return !!value && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)
}

export function mapApiOrden(apiOrden: ApiOrdenTrabajo | BackendOrdenTrabajo, idx: number): OrdenTrabajo {
    const orden = apiOrden as BackendOrdenTrabajo
    const tipo = catalogValue(orden.tipo, "mantencion")
    const estado = catalogValue(orden.estado, "recibida")
    const cliente = typeof orden.cliente === "string" ? orden.cliente : fullName(orden.cliente)
    const mecanico = typeof orden.mecanico === "string" ? orden.mecanico : fullName(orden.mecanico)
    const mecanicoLabel = mecanico && !isUuid(mecanico) ? mecanico : ""
    const biciMarca = `${orden.bicicleta?.marca ?? ""} ${orden.bicicleta?.modelo ?? ""}`.trim()

    return {
        id: orden.numeroOrden ?? `OT-${String(idx + 1).padStart(4, "0")}`,
        backendId: orden.id,
        tipo: {
            id: tipo.id,
            codigo: normalizeTipoOrden(tipo.codigo),
            nombre: tipo.nombre,
        },
        estado: normalizeEstadoOrden(estado.codigo),
        prioridad: normalizePrioridadOrden(orden.prioridad),
        fechaIngreso: formatFechaIngreso(orden.fechaIngreso),
        fechaEstimada: orden.fechaPrometida ?? "",
        mecanicoId: mecanicoLabel || "Sin asignar",
        clienteNombre: cliente || "Sin cliente",
        clienteTelefono: typeof orden.cliente === "object" ? orden.cliente?.telefono ?? undefined : undefined,
        clienteEmail: typeof orden.cliente === "object" ? orden.cliente?.email ?? undefined : undefined,
        biciMarca: biciMarca || "Sin bicicleta",
        biciTipo: orden.bicicleta?.tipo ?? "Otro",
        biciTalla: orden.bicicleta?.aro ?? undefined,
        biciColor: orden.bicicleta?.color ?? "",
        biciNumSerie: orden.bicicleta?.numeroSerie ?? undefined,
        descripcion: orden.diagnosticoInicial ?? orden.observacionesCliente ?? "Sin descripcion",
    }
}

export const ordenesService: IOrdenesService = {
    async getOrdenes() {
        return httpClient.get<BackendOrdenesListResponse>("ordenes") as unknown as Promise<OrdenesListResponse>;
    },

    async getOrdenesMetricas() {
        return httpClient.get<OrdenesMetricas>("ordenes/metricas");
    },

    async getEstadosOrden() {
        const response = await httpClient.get<unknown>("ordenes/catalogos/estados");
        return normalizeCatalogResponse(response, "estados") as OrdenCatalogoItem[];
    },

    async getTiposOrden() {
        const response = await httpClient.get<unknown>("ordenes/catalogos/tipos");
        return normalizeCatalogResponse(response, "tipos") as OrdenCatalogoItem[];
    },

    async getPrioridadesOrden() {
        const response = await httpClient.get<unknown>("ordenes/catalogos/prioridades");
        return normalizeCatalogResponse(response, "prioridades") as OrdenCatalogoItem[];
    },

    async getOrdenById(id: string) {
        return httpClient.get<OrdenTrabajoDetalle>(`ordenes/${id}`);
    },

    async createOrden(payload: CreateOrdenPayload) {
        return httpClient.post("ordenes", payload);
    },

    async updateOrden(id: string, payload: UpdateOrdenPayload) {
        return httpClient.patch<ApiOrdenTrabajo>(`ordenes/${id}`, payload);
    },

    async addProductos(id: string, payload: OrdenProductoAddPayload[]) {
        return httpClient.post<OrdenTrabajoDetalle["productos"]>(`ordenes/${id}/productos`, payload);
    },

    async bulkUpdateOrdenes(payload: BulkUpdateOrdenPayload) {
        return httpClient.patch<void>("ordenes/bulk", payload);
    },

    async deleteOrden(id: string) {
        return httpClient.delete(`ordenes/${id}`);
    }
}
