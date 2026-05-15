export interface IOrdenesService {
    getOrdenes(): Promise<OrdenesListResponse>;
    getOrdenesUrgentes(): Promise<OrdenesListResponse>;
    getOrdenesMetricas(): Promise<OrdenesMetricas>;
    createOrden(payload: CreateOrdenPayload): Promise<void>;
    getOrdenById(id: string): Promise<Orden>;
    updateOrden(id: string, payload: UpdateOrdenPayload): Promise<Orden>;
    bulkUpdateOrdenes(payload: BulkUpdateOrdenPayload): Promise<void>;
    deleteOrden(id: string): Promise<void>;
}

export type Orden = {
    externalId: string | null;
    tipo: string;
    fechaIngreso: string;
    nombreMecanico: string;
    nombreCliente: string;
    descripcion: string;
    observacionesCliente?: string;
    prioridad?: "Baja" | "Media" | "Alta";
    fechaEstimada?: string;
    bicicleta: {
        marca: string;
        color: string;
        tipo: string;
        talla: string;
    };
    estado: string;
}


export type CreateOrdenPayload = {
    tipo: TipoOT;
    prioridad: Prioridad;
    fechaEstimada: string;
    mecanicoId: string;
    bicicletaId: string;
    descripcion: string;
    estado: EstadoOT;
    notasInternas?: string;
}

export type UpdateOrdenPayload = {
    tipo?: TipoOT;
    prioridad?: Prioridad;
    fechaEstimada?: string;
    mecanicoId?: string;
    bicicletaId?: string;
    descripcion?: string;
    estado?: EstadoOT;
    notasInternas?: string;
}

export type BulkUpdateOrdenPayload = {
    ids: string[];
    estado?: string;
    mecanicoId?: string;
}

export type TipoOT = "Mantención" | "Diagnóstico" | "Garantía" | "Armado" | "Otro";
export type EstadoOT = "Recibido" | "En Proceso" | "Listo" | "Entregado" | "Cancelado";
export type Prioridad = "Baja" | "Media" | "Alta";
export type TipoBici = "Ruta" | "Montaña" | "Híbrida" | "Eléctrica" | "Infantil" | "Otra";

export type OrdenesListResponse = { total: number; ordenes: Orden[] }
export type OrdenesMetricas = { recibidas: number; enProceso: number; listas: number; entregadas: number }